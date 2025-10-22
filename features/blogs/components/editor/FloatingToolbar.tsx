'use client';

import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Highlighter,
  Type,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FloatingToolbarProps {
  editor: Editor | null;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      const { from, to, empty } = editor.state.selection;

      if (empty) {
        setShow(false);
        setShowLinkInput(false);
        return;
      }

      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) {
        setShow(false);
        return;
      }

      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calculate position
      const toolbarHeight = 48; // Approximate toolbar height
      const top = rect.top + window.scrollY - toolbarHeight - 8;
      const left = rect.left + window.scrollX + rect.width / 2;

      setPosition({ top, left });
      setShow(true);
    };

    const handleUpdate = () => {
      // Small delay to let selection settle
      setTimeout(updateToolbar, 10);
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  useEffect(() => {
    if (editor && show) {
      const currentLink = editor.getAttributes('link').href;
      setLinkUrl(currentLink || '');
    }
  }, [editor, show]);

  const handleSetLink = () => {
    if (!editor) return;

    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }

    setShowLinkInput(false);
  };

  const handleColorChange = (color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
  };

  if (!editor || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="fixed z-50"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="bg-background/95 backdrop-blur-xl rounded-lg shadow-2xl border border-border/50 p-1 flex items-center gap-0.5">
          <Button
            variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('code') ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant={editor.isActive('highlight') ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Type className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40" align="center">
              <div className="space-y-2">
                <Label className="text-xs">Text Color</Label>
                <div className="grid grid-cols-4 gap-1">
                  {['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
            <PopoverTrigger asChild>
              <Button
                variant={editor.isActive('link') ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="center">
              <div className="space-y-3">
                <Label htmlFor="link-url">Link URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSetLink();
                      }
                    }}
                    autoFocus
                  />
                  <Button onClick={handleSetLink} size="sm">
                    Set
                  </Button>
                </div>
                {editor.isActive('link') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setLinkUrl('');
                      setShowLinkInput(false);
                    }}
                    className="w-full"
                  >
                    Remove Link
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
