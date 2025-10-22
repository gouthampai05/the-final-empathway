'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2, Crop } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageCropDialog } from './ImageCropDialog';

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageInsert: (src: string, alt?: string, title?: string) => void;
}

export const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onOpenChange,
  onImageInsert,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [title, setTitle] = useState('');
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    } else {
      toast.error('Please drop an image file');
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // In a real app, you would upload to a server here
      // For now, we'll just use the data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = (e) => resolve(e.target?.result as string);
        r.readAsDataURL(file);
      });

      setImageUrl(dataUrl);
      toast.success('Image loaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlInsert = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    onImageInsert(imageUrl, alt || undefined, title || undefined);
    handleClose();
  };

  const handleCropClick = () => {
    if (preview) {
      setImageToCrop(preview);
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setPreview(croppedImageUrl);
    setImageUrl(croppedImageUrl);
  };

  const handleClose = () => {
    setImageUrl('');
    setAlt('');
    setTitle('');
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Insert Image
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </motion.div>
                ) : preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto max-h-64 object-contain rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={handleCropClick}
                          className="p-2 bg-background/90 rounded-full hover:bg-background"
                          title="Crop image"
                        >
                          <Crop className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setPreview(null);
                            setImageUrl('');
                          }}
                          className="p-2 bg-background/90 rounded-full hover:bg-background"
                          title="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 text-center"
                  >
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Drag and drop an image here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click to browse from your computer
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      Browse Files
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="space-y-2">
                  <Label htmlFor="alt">Alt Text (for accessibility)</Label>
                  <Input
                    id="alt"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="Describe the image"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Caption (optional)</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a caption"
                  />
                </div>
                <Button onClick={handleUrlInsert} className="w-full">
                  Insert Image
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Image URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="pl-10"
                  />
                </div>
              </div>

              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-48 object-contain rounded"
                      onError={() => toast.error('Failed to load image')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url-alt">Alt Text</Label>
                    <Input
                      id="url-alt"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      placeholder="Describe the image"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url-title">Caption</Label>
                    <Input
                      id="url-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Add a caption"
                    />
                  </div>
                </motion.div>
              )}

              <Button
                onClick={handleUrlInsert}
                disabled={!imageUrl.trim()}
                className="w-full"
              >
                Insert Image
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {imageToCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
        />
      )}
    </Dialog>
  );
};
