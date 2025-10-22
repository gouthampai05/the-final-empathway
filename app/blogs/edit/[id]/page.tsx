'use client';

import { useParams } from 'next/navigation';
import { BlogEditorPage } from '@/features/blogs';

export default function Page() {
  const params = useParams();
  const blogId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  return <BlogEditorPage blogId={blogId} />;
}
