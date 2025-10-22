'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { InputDialog } from '@/components/shared/InputDialog';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import { CustomImage } from '@/features/blogs/components/editor/ImageExtension';
import Typography from '@tiptap/extension-typography';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
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
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Palette,
  Highlighter,
} from 'lucide-react';

interface EmailEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  initialContent = '',
  onChange,
  editable = true,
  placeholder = 'Write your email content here...'
}) => {
  const [slashCommandOpen, setSlashCommandOpen] = useState(false);
  const [slashCommandQuery, setSlashCommandQuery] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [toolbarExpanded, setToolbarExpanded] = useState(false);
  const slashCommandRef = useRef<HTMLDivElement>(null);
  const [imageDialog, setImageDialog] = useState(false);
  const [linkDialog, setLinkDialog] = useState(false);

  // Simplified slash commands for email (no code blocks, simpler formatting)
  const SLASH_COMMANDS = [
    { title: 'Text', description: 'Plain text paragraph', icon: 'T', command: (editor: any) => editor.chain().focus().setParagraph().run() },
    { title: 'Heading 1', description: 'Large heading', icon: 'H1', command: (editor: any) => editor.chain().focus().setHeading({ level: 1 }).run() },
    { title: 'Heading 2', description: 'Medium heading', icon: 'H2', command: (editor: any) => editor.chain().focus().setHeading({ level: 2 }).run() },
    { title: 'Heading 3', description: 'Small heading', icon: 'H3', command: (editor: any) => editor.chain().focus().setHeading({ level: 3 }).run() },
    { title: 'Bullet List', description: 'Create a bullet list', icon: '•', command: (editor: any) => editor.chain().focus().toggleBulletList().run() },
    { title: 'Numbered List', description: 'Create a numbered list', icon: '1.', command: (editor: any) => editor.chain().focus().toggleOrderedList().run() },
    { title: 'Quote', description: 'Add a quote', icon: '"', command: (editor: any) => editor.chain().focus().toggleBlockquote().run() },
    { title: 'Divider', description: 'Visual divider', icon: '—', command: (editor: any) => editor.chain().focus().setHorizontalRule().run() },
    { title: 'Image', description: 'Add an image', icon: '🖼', command: () => setImageDialog(true) },
    { title: 'Link', description: 'Add a link', icon: '🔗', command: () => setLinkDialog(true) },
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        includeChildren: true,
        showOnlyWhenEditable: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
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
      HorizontalRule,
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
      const { selection } = state;
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
        class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editable, editor]);

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
          style={{ top: '-16rem' }}
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
        {/* Toolbar */}
        {editable && (
          <div className="border-b bg-muted/30">
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

              {/* Colors */}
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
          className="min-h-[400px] focus:outline-none"
          spellCheck={true}
          onKeyDown={onKeyDown}
        />
      </div>

      {/* Image Dialog */}
      <InputDialog
        open={imageDialog}
        onOpenChange={setImageDialog}
        title="Insert Image"
        description="Enter the URL of the image"
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
        description="Enter the URL"
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
