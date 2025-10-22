export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: BlogStatus;
  author: string;
  authorId?: string;
  tags: string[];
  category: string;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  likes: number;
}

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogFilters {
  status?: BlogStatus;
  category?: string;
  author?: string;
  tag?: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  featured: boolean;
  status: BlogStatus;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  id: string;
}

export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalLikes: number;
}
