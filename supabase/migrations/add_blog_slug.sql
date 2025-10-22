-- Migration: Add slug column to blogs table
-- Description: Adds URL-friendly slug field for public blog viewing with ISR
-- Date: 2025-01-XX

-- Add slug column to blogs table
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug for published blogs
-- This ensures no duplicate slugs for published content
DROP INDEX IF EXISTS blogs_slug_unique;
CREATE UNIQUE INDEX blogs_slug_unique ON blogs(slug) WHERE status = 'published';

-- Create regular index for faster slug lookups
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);

-- Backfill slugs for existing blogs
-- Converts title to URL-friendly slug (lowercase, hyphenated, no special chars)
UPDATE blogs
SET slug = lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(title, '[^\w\s-]', '', 'g'),  -- Remove special chars
      '\s+', '-', 'g'                               -- Replace spaces with hyphens
    ),
    '-+', '-', 'g'                                  -- Remove duplicate hyphens
  )
)
WHERE slug IS NULL;

-- Add comment to column for documentation
COMMENT ON COLUMN blogs.slug IS 'URL-friendly identifier for public blog access. Auto-generated from title.';

-- Verify migration
DO $$
DECLARE
  blog_count INTEGER;
  slug_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO blog_count FROM blogs;
  SELECT COUNT(*) INTO slug_count FROM blogs WHERE slug IS NOT NULL;

  RAISE NOTICE 'Migration complete: % blogs total, % have slugs', blog_count, slug_count;

  IF slug_count < blog_count THEN
    RAISE WARNING 'Some blogs still missing slugs. Please check data.';
  END IF;
END $$;
