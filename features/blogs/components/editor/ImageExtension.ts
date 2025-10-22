import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DraggableImage } from './DraggableImage';

export const CustomImage = Image.extend({
  name: 'image',

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: 'medium',
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.width) return {};
          return { 'data-width': attributes.width };
        },
        parseHTML: (element: HTMLElement) => element.getAttribute('data-width') || 'medium',
      },
      align: {
        default: 'center',
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.align) return {};
          return { 'data-align': attributes.align };
        },
        parseHTML: (element: HTMLElement) => element.getAttribute('data-align') || 'center',
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DraggableImage);
  },
});
