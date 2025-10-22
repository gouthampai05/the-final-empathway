'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Command } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: 'text' | 'format' | 'blocks' | 'navigation';
}

const SHORTCUTS: Shortcut[] = [
  // Text formatting
  { keys: ['Ctrl', 'B'], description: 'Bold', category: 'format' },
  { keys: ['Ctrl', 'I'], description: 'Italic', category: 'format' },
  { keys: ['Ctrl', 'U'], description: 'Underline', category: 'format' },
  { keys: ['Ctrl', 'Shift', 'S'], description: 'Strikethrough', category: 'format' },
  { keys: ['Ctrl', 'Shift', 'H'], description: 'Highlight', category: 'format' },
  { keys: ['Ctrl', 'K'], description: 'Add link', category: 'format' },
  { keys: ['Ctrl', 'Shift', 'K'], description: 'Remove link', category: 'format' },
  
  // Headings
  { keys: ['Ctrl', 'Alt', '1'], description: 'Heading 1', category: 'blocks' },
  { keys: ['Ctrl', 'Alt', '2'], description: 'Heading 2', category: 'blocks' },
  { keys: ['Ctrl', 'Alt', '3'], description: 'Heading 3', category: 'blocks' },
  { keys: ['Ctrl', 'Alt', '0'], description: 'Paragraph', category: 'blocks' },
  
  // Lists
  { keys: ['Ctrl', 'Shift', '8'], description: 'Bullet list', category: 'blocks' },
  { keys: ['Ctrl', 'Shift', '7'], description: 'Numbered list', category: 'blocks' },
  { keys: ['Ctrl', 'Shift', '9'], description: 'Task list', category: 'blocks' },
  
  // Blocks
  { keys: ['Ctrl', 'Shift', 'B'], description: 'Blockquote', category: 'blocks' },
  { keys: ['Ctrl', 'Alt', 'C'], description: 'Code block', category: 'blocks' },
  { keys: ['Ctrl', 'Shift', 'H'], description: 'Horizontal rule', category: 'blocks' },
  
  // Text alignment
  { keys: ['Ctrl', 'Shift', 'L'], description: 'Align left', category: 'format' },
  { keys: ['Ctrl', 'Shift', 'E'], description: 'Align center', category: 'format' },
  { keys: ['Ctrl', 'Shift', 'R'], description: 'Align right', category: 'format' },
  { keys: ['Ctrl', 'Shift', 'J'], description: 'Justify', category: 'format' },
  
  // Navigation
  { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'navigation' },
  { keys: ['Ctrl', 'Y'], description: 'Redo', category: 'navigation' },
  { keys: ['Ctrl', 'A'], description: 'Select all', category: 'navigation' },
  { keys: ['Ctrl', 'F'], description: 'Find', category: 'navigation' },
  { keys: ['Ctrl', 'S'], description: 'Save', category: 'navigation' },
  { keys: ['Ctrl', 'Shift', 'P'], description: 'Publish', category: 'navigation' },
  { keys: ['Ctrl', '/'], description: 'Show shortcuts', category: 'navigation' },
];

interface KeyboardShortcutsProps {
  onShortcut?: (shortcut: string) => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onShortcut }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts with Ctrl+/
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
        onShortcut?.('show-shortcuts');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onShortcut]);

  const shortcutsByCategory = SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  const categoryLabels = {
    text: 'Text',
    format: 'Formatting',
    blocks: 'Blocks',
    navigation: 'Navigation',
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Keyboard className="h-4 w-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to work more efficiently in the editor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <Badge variant="secondary" className="text-xs font-mono">
                            {key === 'Ctrl' ? 'Ctrl' : key === 'Shift' ? 'Shift' : key === 'Alt' ? 'Alt' : key}
                          </Badge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Press <Badge variant="secondary" className="text-xs font-mono">Ctrl</Badge> + <Badge variant="secondary" className="text-xs font-mono">/</Badge> to toggle this panel
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
