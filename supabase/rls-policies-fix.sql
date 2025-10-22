-- Fix RLS policies for blogs table to allow delete operations
-- Run this in your Supabase SQL editor if deletions are failing

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete their own blogs" ON blogs;

-- Create a policy that allows users to delete their own blogs
CREATE POLICY "Users can delete their own blogs"
ON blogs
FOR DELETE
USING (auth.uid() = user_id);

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'blogs' AND cmd = 'DELETE';
