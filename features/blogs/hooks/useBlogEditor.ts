import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { createLowlight } from 'lowlight';
import { useState, useCallback, useEffect } from 'react';

const lowlight = createLowlight();

export const useBlogEditor = (initialContent?: string) => {
  const [isEditable, setIsEditable] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Type "/" for commands, or start writing your blog...',
        includeChildren: true,
        showOnlyWhenEditable: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
          draggable: 'true',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg',
        },
      }),
    ],
    content: initialContent || '<p>Start writing your blog post...</p>',
    editable: isEditable,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto max-w-3xl text-justify focus:outline-none min-h-[400px] p-6',
      },
      handlePaste(view, event) {
        const clipboard = event.clipboardData;
        if (!clipboard) return false;
        const items = clipboard.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const src = typeof reader.result === 'string' ? reader.result : '';
                if (src) {
                  editor?.chain().focus().setImage({ src }).run();
                }
              };
              reader.readAsDataURL(file);
              event.preventDefault();
              return true;
            }
          }
        }
        return false;
      },
      handleDrop(view, event) {
        const dataTransfer = event.dataTransfer;
        if (!dataTransfer || !dataTransfer.files?.length) return false;
        const file = Array.from(dataTransfer.files).find(f => f.type.startsWith('image/'));
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const src = typeof reader.result === 'string' ? reader.result : '';
            if (src) {
              editor?.chain().focus().setImage({ src }).run();
            }
          };
          reader.readAsDataURL(file);
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  // Keep editor content in sync when initialContent changes (e.g., after loading a blog)
  useEffect(() => {
    if (!editor) return;
    if (typeof initialContent === 'string' && initialContent.length > 0) {
      const current = editor.getHTML();
      if (current !== initialContent) {
        editor.commands.setContent(initialContent, { emitUpdate: false });
      }
    }
  }, [editor, initialContent]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const setHeading = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const setTextAlign = useCallback((align: 'left' | 'center' | 'right' | 'justify') => {
    editor?.chain().focus().setTextAlign(align).run();
  }, [editor]);

  const addLink = useCallback((url: string) => {
    editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback((src: string, alt?: string) => {
    editor?.chain().focus().setImage({ src, alt }).run();
  }, [editor]);

  const getContent = useCallback(() => {
    return editor?.getHTML() || '';
  }, [editor]);

  const getTextContent = useCallback(() => {
    return editor?.getText() || '';
  }, [editor]);

  const getWordCount = useCallback(() => {
    return editor?.storage.characterCount?.words() || 0;
  }, [editor]);

  const clearContent = useCallback(() => {
    editor?.commands.clearContent();
  }, [editor]);

  const setEditable = useCallback((editable: boolean) => {
    setIsEditable(editable);
    editor?.setEditable(editable);
  }, [editor]);

  return {
    editor,
    isEditable,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    setHeading,
    toggleBulletList,
    toggleOrderedList,
    toggleBlockquote,
    toggleCodeBlock,
    addLink,
    addImage,
    getContent,
    getTextContent,
    getWordCount,
    clearContent,
    setEditable,
    setTextAlign,
  };
};
