'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import Typography from '@tiptap/extension-typography';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Youtube } from '@tiptap/extension-youtube';
import { createLowlight } from 'lowlight';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingToolbar } from './editor/FloatingToolbar';
import { FormattingToolbar } from './editor/FormattingToolbar';
import { SlashCommandMenu } from './editor/SlashCommandMenu';
import { ImageUploadDialog } from './editor/ImageUploadDialog';
import { CustomImage } from './editor/ImageExtension';
import { Maximize2, Minimize2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Configure lowlight for syntax highlighting
const lowlight = createLowlight();

interface EnhancedBlogEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  onFocusChange?: (focused: boolean) => void;
}

export const EnhancedBlogEditor: React.FC<EnhancedBlogEditorProps> = ({
  initialContent = '',
  onChange,
  editable = true,
  placeholder = 'Start writing your story...',
  onFocusChange,
}) => {
  const [slashCommandOpen, setSlashCommandOpen] = useState(false);
  const [slashCommandQuery, setSlashCommandQuery] = useState('');
  const [slashCommandPosition, setSlashCommandPosition] = useState<{ top: number; left: number }>();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        includeChildren: true,
        showOnlyWhenEditable: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary transition-colors cursor-pointer',
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Dropcursor.configure({
        color: 'hsl(var(--primary))',
        width: 2,
      }),
      Gapcursor,
      Typography,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded',
        },
      }),
      Underline,
      Strike,
      Superscript,
      Subscript,
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-8 border-t-2 border-border',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-muted/50 border border-border p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border bg-muted font-semibold text-left p-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border p-2',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'list-none pl-2',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'rounded-lg my-4',
        },
      }),
    ],
    content: initialContent,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());

      // Detect slash command
      const { state } = editor;
      const { selection } = state;
      const $pos = selection.$from;
      const textBefore = $pos.parent.textBetween(0, $pos.parentOffset, null, '\uFFFC');

      if (textBefore.endsWith('/')) {
        // Get cursor position for menu
        const { view } = editor;
        const coords = view.coordsAtPos(selection.from);

        setSlashCommandPosition({
          top: coords.top + window.scrollY + 24,
          left: coords.left + window.scrollX,
        });
        setSlashCommandOpen(true);
        setSlashCommandQuery('');
      } else if (slashCommandOpen) {
        const queryMatch = textBefore.match(/\/\s*(\w*)$/);
        if (queryMatch) {
          setSlashCommandQuery(queryMatch[1]);
        } else {
          setSlashCommandOpen(false);
          setSlashCommandQuery('');
        }
      }
    },
    onFocus: () => {
      setIsFocused(true);
      onFocusChange?.(true);
    },
    onBlur: () => {
      setIsFocused(false);
      onFocusChange?.(false);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-8 md:px-12 lg:px-16 py-8 prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8 prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-6 prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-4 prose-p:leading-relaxed prose-p:my-4 prose-a:no-underline prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-transparent prose-pre:p-0 prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-img:rounded-lg prose-img:shadow-md',
      },
    },
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editable, editor]);

  // Update content when initialContent changes (fixes edit mode content loading)
  useEffect(() => {
    if (editor && initialContent !== undefined && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  const handleImageInsert = useCallback(
    (src: string, alt?: string, title?: string) => {
      if (!editor) return;
      editor.chain().focus().setImage({ src, alt, title }).run();
    },
    [editor]
  );

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      editorContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!editor) return null;

  return (
    <div
      ref={editorContainerRef}
      className={`relative ${isFullscreen ? 'bg-background' : ''}`}
    >
      {/* Formatting Toolbar */}
      {editable && (
        <FormattingToolbar
          editor={editor}
          onImageClick={() => setImageDialogOpen(true)}
        />
      )}

      {/* Floating Action Buttons */}
      {editable && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isFocused ? 1 : 0.6, y: 0 }}
          className="fixed bottom-8 right-8 z-40 flex flex-col gap-2"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setImageDialogOpen(true)}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={toggleFullscreen}
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full shadow-lg bg-background"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Floating Toolbar */}
      <FloatingToolbar editor={editor} />

      {/* Slash Command Menu */}
      <SlashCommandMenu
        editor={editor}
        isOpen={slashCommandOpen}
        onClose={() => setSlashCommandOpen(false)}
        query={slashCommandQuery}
        position={slashCommandPosition}
      />

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onImageInsert={handleImageInsert}
      />

      {/* Editor Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative bg-background rounded-lg transition-all ${
          isFocused
            ? 'ring-2 ring-primary/20 shadow-lg'
            : 'ring-1 ring-border hover:ring-primary/10'
        }`}
      >
        <EditorContent
          editor={editor}
          className="min-h-[500px] focus:outline-none"
          spellCheck={true}
        />

        {/* Hint for slash commands */}
        <AnimatePresence>
          {editable && !isFocused && !initialContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-24 left-8 md:left-12 lg:left-16 text-muted-foreground text-sm pointer-events-none"
            >
              <p>Type <kbd className="px-2 py-1 bg-muted rounded text-xs">/</kbd> for commands</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
