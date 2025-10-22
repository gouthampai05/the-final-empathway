'use client';

import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Image as ImageIcon,
  Link as LinkIcon,
  Table,
  CheckSquare,
} from 'lucide-react';

interface Command {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: Editor) => void;
  keywords: string[];
}

interface SlashCommandMenuProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  query: string;
  position?: { top: number; left: number };
}

const COMMANDS: Command[] = [
  {
    title: 'Text',
    description: 'Start writing with plain text',
    icon: <Type className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().setParagraph().run(),
    keywords: ['paragraph', 'text', 'p'],
  },
  {
    title: 'Heading 1',
    description: 'Big section heading',
    icon: <Heading1 className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
    keywords: ['h1', 'heading', 'title'],
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
    keywords: ['h2', 'heading', 'subtitle'],
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <Heading3 className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
    keywords: ['h3', 'heading'],
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    icon: <List className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
    keywords: ['ul', 'list', 'bullet'],
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering',
    icon: <ListOrdered className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    keywords: ['ol', 'list', 'numbered', 'ordered'],
  },
  {
    title: 'Quote',
    description: 'Capture a quote',
    icon: <Quote className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    keywords: ['blockquote', 'quote', 'citation'],
  },
  {
    title: 'Code Block',
    description: 'Display code with syntax highlighting',
    icon: <Code className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    keywords: ['code', 'codeblock', 'pre'],
  },
  {
    title: 'Divider',
    description: 'Visually divide content sections',
    icon: <Minus className="h-4 w-4" />,
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
    keywords: ['hr', 'divider', 'separator', 'line'],
  },
  {
    title: 'Image',
    description: 'Upload or embed an image',
    icon: <ImageIcon className="h-4 w-4" />,
    command: (editor) => {
      const url = window.prompt('Enter image URL');
      if (url) editor.chain().focus().setImage({ src: url }).run();
    },
    keywords: ['image', 'img', 'photo', 'picture'],
  },
  {
    title: 'Link',
    description: 'Add a hyperlink',
    icon: <LinkIcon className="h-4 w-4" />,
    command: (editor) => {
      const url = window.prompt('Enter URL');
      if (url) editor.chain().focus().setLink({ href: url }).run();
    },
    keywords: ['link', 'url', 'href', 'anchor'],
  },
];

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  editor,
  isOpen,
  onClose,
  query,
  position,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredCommands = COMMANDS.filter((cmd) => {
    const searchTerm = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(searchTerm) ||
      cmd.description.toLowerCase().includes(searchTerm) ||
      cmd.keywords.some((keyword) => keyword.includes(searchTerm))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = useCallback(
    (command: Command) => {
      if (!editor) return;

      // Delete the slash command text
      const { state } = editor;
      const { selection } = state;
      const { from } = selection;
      const textBefore = editor.state.doc.textBetween(Math.max(0, from - 50), from, null, '\uFFFC');
      const slashIndex = textBefore.lastIndexOf('/');

      if (slashIndex !== -1) {
        const deleteFrom = from - (textBefore.length - slashIndex);
        editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
      }

      command.command(editor);
      onClose();
    },
    [editor, onClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredCommands.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, executeCommand, onClose]);

  if (!isOpen || filteredCommands.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="fixed z-50 bg-background/95 backdrop-blur-xl rounded-lg shadow-2xl border border-border/50 w-80 max-h-[400px] overflow-auto"
        style={position ? { top: position.top, left: position.left } : {}}
      >
        <div className="p-2 text-xs font-medium text-muted-foreground border-b">
          Choose a block type
        </div>
        <div className="p-1">
          {filteredCommands.map((cmd, idx) => (
            <motion.div
              key={cmd.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={`group flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all ${
                idx === selectedIndex
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => executeCommand(cmd)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                idx === selectedIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
              }`}>
                {cmd.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{cmd.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {cmd.description}
                </div>
              </div>
              {idx === selectedIndex && (
                <motion.div
                  layoutId="selected-indicator"
                  className="w-1.5 h-8 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
