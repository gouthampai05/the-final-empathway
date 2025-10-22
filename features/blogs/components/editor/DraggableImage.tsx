'use client';

import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState, useRef, useCallback } from 'react';
import { Grip, X, Maximize2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const DraggableImage = ({ node, updateAttributes, deleteNode, selected }: NodeViewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const src = node.attrs.src;
  const alt = node.attrs.alt || '';
  const title = node.attrs.title || '';
  const width = node.attrs.width || 'auto';
  const align = node.attrs.align || 'center';

  const handleResize = useCallback((newWidth: string) => {
    updateAttributes({ width: newWidth });
  }, [updateAttributes]);

  const handleAlign = useCallback((newAlign: string) => {
    updateAttributes({ align: newAlign });
  }, [updateAttributes]);

  const getAlignmentClass = () => {
    switch (align) {
      case 'left':
        return 'mr-auto';
      case 'right':
        return 'ml-auto';
      case 'center':
      default:
        return 'mx-auto';
    }
  };

  const getWidthStyle = () => {
    if (width === 'small') return '40%';
    if (width === 'medium') return '60%';
    if (width === 'large') return '80%';
    if (width === 'full') return '100%';
    return width;
  };

  return (
    <NodeViewWrapper className="relative group my-4" data-drag-handle>
      <div
        className={`relative ${getAlignmentClass()}`}
        style={{ width: getWidthStyle(), maxWidth: '100%' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!showControls) setShowControls(false);
        }}
      >
        {/* Image */}
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          title={title}
          className={`rounded-lg shadow-md transition-shadow duration-200 ${
            selected ? 'ring-2 ring-primary ring-offset-2' : ''
          } ${isHovered ? 'shadow-xl' : ''}`}
          style={{
            width: '100%',
            height: 'auto',
            cursor: 'grab'
          }}
          draggable={false}
        />

        {/* Hover Controls */}
        <div
          className={`absolute top-2 right-2 flex gap-1 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border p-1 transition-opacity ${
            (isHovered || selected || showControls) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Popover open={showControls} onOpenChange={setShowControls}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowControls(!showControls)}
              >
                <Grip className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Size</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['small', 'medium', 'large', 'full'].map((size) => (
                      <Button
                        key={size}
                        variant={width === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleResize(size)}
                        className="capitalize"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Alignment</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={align === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAlign('left')}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={align === 'center' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAlign('center')}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={align === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAlign('right')}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={deleteNode}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drag Handle */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-primary/20 backdrop-blur-sm rounded-full p-3">
            <Grip className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Caption */}
        {title && (
          <p className="text-sm text-muted-foreground text-center mt-2 italic">
            {title}
          </p>
        )}
      </div>
    </NodeViewWrapper>
  );
};
