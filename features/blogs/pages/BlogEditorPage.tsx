'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EditorLoader } from '@/components/shared';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Settings, 
  MoreHorizontal,
  Clock,
  FileText,
  Tag,
  Calendar,
  User,
  BarChart3,
  Share2,
  Download,
  Upload,
  Trash2,
  Copy,
  Archive,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EnhancedBlogEditor } from '../components/EnhancedBlogEditor';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { useBlogById } from '../hooks/useBlogData';
import { CreateBlogData, UpdateBlogData } from '../types/Blog';
import { BLOG_CATEGORIES, BLOG_STATUS_OPTIONS } from '../config/blogConfig';
import { extractTextFromHtml, calculateReadTime } from '@/lib/contentUtils';
import { createBlog, updateBlog } from '../actions';
import { useFormSubmission } from '@/hooks/useFormSubmission';

interface BlogEditorPageProps {
  blogId?: string;
}

export const BlogEditorPage: React.FC<BlogEditorPageProps> = ({ blogId }) => {
  const router = useRouter();
  const isEditing = !!blogId;
  const { blog, loading: blogLoading } = useBlogById(blogId || '');
  const { loading, error, submitForm } = useFormSubmission();
  
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    category: '',
    featured: false,
    status: 'draft',
  });
  
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [currentBlogId, setCurrentBlogId] = useState<string | undefined>(blogId);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    setAutoSaveStatus('saving');
    try {
      if (currentBlogId) {
        await updateBlog({ id: currentBlogId, ...formData } as UpdateBlogData);
      } else {
        const newBlog = await createBlog(formData);
        setCurrentBlogId(newBlog.id);
        // Update URL to edit mode without reloading
        window.history.replaceState({}, '', `/blogs/edit/${newBlog.id}`);
      }
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('unsaved');
      toast.error('Auto-save failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  }, [formData, currentBlogId]);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title.trim() && formData.content.trim()) {
        autoSave();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formData, autoSave]);

  // Update word count and read time
  useEffect(() => {
    const text = extractTextFromHtml(formData.content);
    setWordCount(text.split(' ').length);
    setReadTime(calculateReadTime(formData.content));
  }, [formData.content]);

  useEffect(() => {
    if (blog && isEditing) {
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        tags: blog.tags,
        category: blog.category,
        featured: blog.featured,
        status: blog.status,
      });
    }
  }, [blog, isEditing]);

  const handleInputChange = (field: keyof CreateBlogData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setAutoSaveStatus('unsaved');
  };

  const handleContentChange = (content: string) => {
    const excerpt = formData.excerpt || extractTextFromHtml(content).slice(0, 200);
    setFormData(prev => ({
      ...prev,
      content,
      excerpt,
    }));
    setAutoSaveStatus('unsaved');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
      setAutoSaveStatus('unsaved');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
    setAutoSaveStatus('unsaved');
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    const dataToSave = {
      ...formData,
      status: status || formData.status,
    };

    setAutoSaveStatus('saving');
    try {
      await submitForm(async () => {
        if (currentBlogId) {
          await updateBlog({ id: currentBlogId, ...dataToSave } as UpdateBlogData);
        } else {
          const newBlog = await createBlog(dataToSave);
          setCurrentBlogId(newBlog.id);
        }
      });

      // Update local state to reflect the new status
      if (status) {
        setFormData(prev => ({ ...prev, status }));
      }

      setAutoSaveStatus('saved');
      setLastSaved(new Date());

      // Show success message
      const message = status === 'published'
        ? 'Blog published successfully!'
        : 'Blog saved as draft';
      toast.success(message);

      // Redirect to blogs list
      setTimeout(() => {
        router.push('/blogs');
      }, 500);
    } catch (error) {
      console.error('Failed to save blog:', error);
      setAutoSaveStatus('unsaved');
      toast.error('Failed to save blog', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (blogLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <EditorLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/blogs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">
                {isEditing ? 'Edit Blog' : 'New Blog'}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Saving...</span>
                  </div>
                )}
                {autoSaveStatus === 'saved' && lastSaved && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                {autoSaveStatus === 'unsaved' && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-orange-600" />
                    <span>Unsaved changes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <KeyboardShortcuts />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSave('draft')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSave('published')}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Publish
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              onClick={() => handleSave('published')}
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish'
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 py-6 lg:px-6">
          {/* Title Input */}
          <div className="mb-8">
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Untitled"
              className="text-4xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground"
            />
          </div>

          {/* Editor */}
          <div className="space-y-6">
            <EnhancedBlogEditor
              initialContent={formData.content}
              onChange={handleContentChange}
              editable={!showPreview}
              placeholder="Type '/' for commands, or start writing..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error: {error}
              </AlertDescription>
            </Alert>
          )}
        </main>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-full lg:w-80 border-l-0 lg:border-l border-t lg:border-t-0 bg-muted/30 p-4 lg:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="publish" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="publish">Publish</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="publish" className="space-y-4">
                {/* Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select 
                      value={formData.status}
                      onValueChange={(value: any) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOG_STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured" className="text-sm">Featured Post</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange('featured', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Category */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOG_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Add a tag..."
                        className="flex-1"
                      />
                      <Button onClick={handleAddTag} size="sm">
                        Add
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                {/* Excerpt */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Excerpt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Brief description of your blog post..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {formData.excerpt.length}/200 characters
                    </p>
                  </CardContent>
                </Card>

                {/* SEO Preview */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">SEO Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm font-medium text-blue-600">
                      {formData.title || 'Untitled'}
                    </div>
                    <div className="text-xs text-green-600">
                      yoursite.com/blog/{formData.title?.toLowerCase().replace(/\s+/g, '-') || 'untitled'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formData.excerpt || 'No description provided'}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                {/* Writing Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Writing Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Words</span>
                      </div>
                      <span className="font-medium">{wordCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Read time</span>
                      </div>
                      <span className="font-medium">{readTime} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Tags</span>
                      </div>
                      <span className="font-medium">{formData.tags.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Publishing Info */}
                {isEditing && blog && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Publishing Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Author</span>
                        </div>
                        <span className="font-medium">{blog.author}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Created</span>
                        </div>
                        <span className="font-medium">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {blog.publishedAt && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Published</span>
                          </div>
                          <span className="font-medium">
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </aside>
        )}

        {/* Sidebar Toggle */}
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="sm"
            className="fixed right-4 top-20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
