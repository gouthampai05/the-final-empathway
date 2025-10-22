'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { InputDialog } from '@/components/shared/InputDialog';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import { CustomImage } from './editor/ImageExtension';
import Typography from '@tiptap/extension-typography';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
// import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import { createLowlight } from 'lowlight';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Palette,
  Type,
  Highlighter,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Youtube as YoutubeIcon,
} from 'lucide-react';

// Configure lowlight for syntax highlighting
const lowlight = createLowlight();

interface BlogEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  initialContent = '',
  onChange,
  editable = true,
  placeholder = 'Type "/" for commands, or start writing...'
}) => {
  const [slashCommandOpen, setSlashCommandOpen] = useState(false);
  const [slashCommandQuery, setSlashCommandQuery] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [toolbarExpanded, setToolbarExpanded] = useState(false);
  const slashCommandRef = useRef<HTMLDivElement>(null);
  const [imageDialog, setImageDialog] = useState(false);
  const [linkDialog, setLinkDialog] = useState(false);

  // Enhanced slash commands for Notion-like experience
  const SLASH_COMMANDS = [
    { title: 'Text', description: 'Just start typing with plain text', icon: 'T', command: (editor: any) => editor.chain().focus().setParagraph().run() },
    { title: 'Heading 1', description: 'Big section heading', icon: 'H1', command: (editor: any) => editor.chain().focus().setHeading({ level: 1 }).run() },
    { title: 'Heading 2', description: 'Medium section heading', icon: 'H2', command: (editor: any) => editor.chain().focus().setHeading({ level: 2 }).run() },
    { title: 'Heading 3', description: 'Small section heading', icon: 'H3', command: (editor: any) => editor.chain().focus().setHeading({ level: 3 }).run() },
    { title: 'Bullet List', description: 'Create a simple bullet list', icon: '•', command: (editor: any) => editor.chain().focus().toggleBulletList().run() },
    { title: 'Numbered List', description: 'Create a list with numbering', icon: '1.', command: (editor: any) => editor.chain().focus().toggleOrderedList().run() },
    { title: 'Quote', description: 'Capture a quote', icon: '"', command: (editor: any) => editor.chain().focus().toggleBlockquote().run() },
    { title: 'Code Block', description: 'Create a code block', icon: '</>', command: (editor: any) => editor.chain().focus().toggleCodeBlock().run() },
    { title: 'Divider', description: 'Visually divide blocks', icon: '—', command: (editor: any) => editor.chain().focus().setHorizontalRule().run() },
    { title: 'Image', description: 'Upload or embed an image', icon: '🖼', command: () => setImageDialog(true) },
    { title: 'Link', description: 'Add a link', icon: '🔗', command: () => setLinkDialog(true) },
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Placeholder.configure({ 
        placeholder,
        includeChildren: true,
        showOnlyWhenEditable: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      CustomImage,
      Dropcursor,
      Gapcursor,
      Typography,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Strike,
      Superscript,
      Subscript,
      HorizontalRule,
       // Youtube.configure({
       //   width: 640,
       //   height: 480,
       //   HTMLAttributes: {
       //     class: 'rounded-lg',
       //   },
       // }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialContent,
    editable,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());

      // Detect slash command
      const { state } = editor;
      const { doc, selection } = state;
      const $pos = selection.$from;
      const textBefore = $pos.parent.textBetween(0, $pos.parentOffset, null, '\uFFFC');

      if (textBefore.endsWith('/')) {
        setSlashCommandOpen(true);
        setSlashCommandQuery('');
        setSelectedCommandIndex(0);
      } else if (slashCommandOpen) {
        const queryMatch = textBefore.match(/\/\s*(\w*)$/);
        if (queryMatch) {
          setSlashCommandQuery(queryMatch[1]);
          setSelectedCommandIndex(0);
        } else {
          setSlashCommandOpen(false);
          setSlashCommandQuery('');
        }
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-6',
      },
    },
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editable, editor]);

  // Run command from slash menu
  const runSlashCommand = (command: (editor: any) => void) => {
    if (!editor) return;
    
    const { state } = editor;
    const { selection } = state;
    const { from } = selection;
    const textBefore = editor.state.doc.textBetween(Math.max(0, from - 50), from, null, '\uFFFC');
    const slashIndex = textBefore.lastIndexOf('/');
    
    if (slashIndex !== -1) {
      const deleteFrom = from - (textBefore.length - slashIndex);
      editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
    }
    
    command(editor);
    setSlashCommandOpen(false);
    setSlashCommandQuery('');
  };

  const filteredCommands = SLASH_COMMANDS.filter(cmd => 
    cmd.title.toLowerCase().includes(slashCommandQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(slashCommandQuery.toLowerCase())
  );

  // Keyboard navigation for slash menu
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (slashCommandOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedCommandIndex]) {
          runSlashCommand(filteredCommands[selectedCommandIndex].command);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSlashCommandOpen(false);
        setSlashCommandQuery('');
      }
    }
  };

  if (!editor) return null;

  return (
    <div className="relative">
      {/* Slash Command Menu */}
      {slashCommandOpen && filteredCommands.length > 0 && (
        <div
          ref={slashCommandRef}
          className="absolute bg-background shadow-xl rounded-lg border w-80 max-h-80 overflow-auto z-50"
          style={{ top: '-20rem' }}
          onKeyDown={onKeyDown}
          tabIndex={-1}
        >
          <div className="p-2 text-xs text-muted-foreground border-b">
            Choose a block type
          </div>
          {filteredCommands.map((cmd, idx) => (
            <div
              key={cmd.title}
              className={`p-3 cursor-pointer select-none transition-colors hover:bg-accent rounded flex items-center gap-3 ${
                idx === selectedCommandIndex ? 'bg-accent' : ''
              }`}
              onClick={() => runSlashCommand(cmd.command)}
              onMouseEnter={() => setSelectedCommandIndex(idx)}
            >
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-medium">
                {cmd.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{cmd.title}</div>
                <div className="text-sm text-muted-foreground">{cmd.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Content */}
      <div className="border rounded-lg bg-background">
        {/* Top Toolbar */}
        {editable && (
          <div className="border-b bg-muted/30">
            {/* Mobile Toolbar Toggle */}
            <div className="lg:hidden flex items-center justify-between p-2 border-b">
              <span className="text-sm font-medium">Formatting</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setToolbarExpanded(!toolbarExpanded)}
              >
                {toolbarExpanded ? 'Hide' : 'Show'} Tools
              </Button>
            </div>
            
            {/* Toolbar Content */}
            <div className={`p-2 flex flex-wrap gap-1 overflow-x-auto ${toolbarExpanded ? 'block' : 'hidden lg:flex'}`}>
              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <Button
                  variant={editor.isActive('bold') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('italic') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('underline') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('strike') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('code') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Text Alignment */}
              <div className="flex items-center gap-1">
                <Button
                  variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Headings */}
              <div className="flex items-center gap-1">
                <Button
                  variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Lists */}
              <div className="flex items-center gap-1">
                <Button
                  variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Blocks */}
              <div className="flex items-center gap-1">
                <Button
                  variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                  <Quote className="h-4 w-4" />
                </Button>
                <Button
                  variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                  <Code2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Media */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImageDialog(true)}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLinkDialog(true)}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Advanced Formatting */}
              <div className="flex items-center gap-1">
                <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Palette className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="grid grid-cols-8 gap-1">
                        {['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'].map((color) => (
                          <button
                            key={color}
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              editor.chain().focus().setColor(color).run();
                              setShowColorPicker(false);
                            }}
                          />
                        ))}
                      </div>
                      <Label>Highlight Color</Label>
                      <div className="grid grid-cols-8 gap-1">
                        {['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f'].map((color) => (
                          <button
                            key={color}
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              editor.chain().focus().setHighlight({ color }).run();
                              setShowColorPicker(false);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant={editor.isActive('highlight') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="min-h-[500px] focus:outline-none"
          spellCheck={true}
          onKeyDown={onKeyDown}
        />
      </div>

      {/* Image Dialog */}
      <InputDialog
        open={imageDialog}
        onOpenChange={setImageDialog}
        title="Insert Image"
        description="Enter the URL of the image you want to insert"
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        confirmText="Insert"
        onConfirm={(url) => {
          if (editor) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      />

      {/* Link Dialog */}
      <InputDialog
        open={linkDialog}
        onOpenChange={setLinkDialog}
        title="Insert Link"
        description="Enter the URL you want to link to"
        label="URL"
        placeholder="https://example.com"
        confirmText="Insert"
        onConfirm={(url) => {
          if (editor) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      />
    </div>
  );
};
