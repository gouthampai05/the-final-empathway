'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, FileText, Edit, Trash2, Eye, MoreVertical, Clock, ExternalLink, Archive, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, TableLoader } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatsGrid, StatItem, ListPageHeader, SearchAndFilters, FilterConfig, Pagination, EmptyState } from '@/components/admin';
import { useBlogData } from '../hooks/useBlogData';
import { useTableState } from '@/hooks/useTableState';
import { Blog, BlogFilters } from '../types/Blog';
import { BLOG_CATEGORIES, BLOG_STATUS_OPTIONS } from '../config/blogConfig';
import { deleteBlog } from '../actions';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { formatDistanceToNow } from 'date-fns';
import { generateSlug } from '@/lib/contentUtils';

export const BlogListPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<BlogFilters>({});

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const { blogs, stats, loading, error, refreshBlogs } = useBlogData(memoizedFilters);
  const { submitForm } = useFormSubmission();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; blog: Blog | null }>({
    open: false,
    blog: null,
  });

  const tableState = useTableState({
    data: blogs,
    itemsPerPage: 20,
    filterFunction: (items, searchTerm) => {
      return items.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  });

  const handleEdit = (blog: Blog) => {
    router.push(`/blogs/edit/${blog.id}`);
  };

  const handleDelete = (blog: Blog) => {
    setDeleteDialog({ open: true, blog });
  };

  const handleViewPublic = (blog: Blog) => {
    // Use the same slug generation from contentUtils to ensure consistency
    const slug = blog.slug || generateSlug(blog.title);
    window.open(`/blogs/${slug}`, '_blank');
  };

  const confirmDelete = async () => {
    if (!deleteDialog.blog) return;

    const toastId = toast.loading('Deleting blog...');
    const blogId = deleteDialog.blog.id;

    try {
      await submitForm(async () => {
        await deleteBlog(blogId);
      });

      // Close dialog first
      setDeleteDialog({ open: false, blog: null });

      // Then refresh and show success
      toast.success('Blog deleted successfully', { id: toastId });
      await refreshBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast.error('Failed to delete blog', {
        id: toastId,
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleFilterChange = (key: keyof BlogFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value && value !== 'all' ? (value as any) : undefined,
    }));
  };

  const getStatusBadgeVariant = (status: Blog['status']) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <TableLoader rows={10} columns={6} />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Blogs</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={refreshBlogs} variant="outline">Try Again</Button>
      </motion.div>
    );
  }

  // Convert blog stats to StatItem format
  const statsItems: StatItem[] = stats ? [
    { title: 'Total Blogs', value: stats.totalBlogs, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Published', value: stats.publishedBlogs, icon: Eye, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Drafts', value: stats.draftBlogs, icon: Archive, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Total Likes', value: stats.totalLikes.toLocaleString(), icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50' },
  ] : [];

  // Convert filter configs
  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      options: BLOG_STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label })),
      value: filters.status,
      placeholder: 'Status',
      width: 'w-[140px]',
    },
    {
      key: 'category',
      label: 'Categories',
      options: BLOG_CATEGORIES.map(c => ({ value: c.value, label: c.label })),
      value: filters.category,
      placeholder: 'Category',
      width: 'w-[140px]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StatsGrid
            stats={statsItems}
            columns={{ default: 1, md: 3, lg: 5 }}
            variant="default"
            animate={false}
          />
        </motion.div>
      )}

      {/* Header & Actions */}
      <ListPageHeader
        title="Blogs"
        description="Manage your blog posts"
        actionLabel="New Blog"
        actionIcon={Plus}
        onAction={() => router.push('/blogs/new')}
      />

      {/* Filters */}
      <SearchAndFilters
        searchTerm={tableState.searchTerm}
        onSearchChange={tableState.handleSearchChange}
        filters={filterConfigs}
        onFilterChange={(key, value) => handleFilterChange(key as keyof BlogFilters, value)}
        hasActiveFilters={tableState.hasActiveFilters}
        onClearFilters={tableState.handleClearFilters}
        searchPlaceholder="Search blogs..."
      />

      {/* Table */}
      {tableState.paginatedData.length === 0 ? (
        blogs.length === 0 && !tableState.hasActiveFilters ? (
          <EmptyState
            icon={FileText}
            title="No blogs yet"
            description="Create your first blog post to get started"
            actionLabel="Create Blog"
            onAction={() => router.push('/blogs/new')}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="No results"
            description="No blogs match your current filters"
            actionLabel="Clear Filters"
            onAction={tableState.handleClearFilters}
          />
        )
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border rounded-lg bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2">
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableState.paginatedData.map((blog, index) => (
                <motion.tr
                  key={blog.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b last:border-b-0"
                  onClick={() => handleEdit(blog)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium line-clamp-1">{blog.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {blog.excerpt}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">{blog.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(blog.status)} className="font-medium">
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {blog.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {blog.readTime}m
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {blog.status === 'published' && (
                          <DropdownMenuItem onClick={() => handleViewPublic(blog)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Public
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEdit(blog)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(blog)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Pagination */}
      {tableState.paginationConfig && (
        <Pagination
          currentPage={tableState.paginationConfig.currentPage}
          totalPages={tableState.paginationConfig.totalPages}
          itemsPerPage={tableState.paginationConfig.itemsPerPage}
          totalItems={tableState.filteredData.length}
          onPreviousPage={tableState.paginationConfig.onPreviousPage}
          onNextPage={tableState.paginationConfig.onNextPage}
        />
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, blog: null })}
        title="Delete Blog"
        description={`Are you sure you want to delete "${deleteDialog.blog?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
};
