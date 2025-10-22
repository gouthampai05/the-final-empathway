export const extractTextFromHtml = (html: string): string => {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  return text;
};

export const calculateReadTime = (html: string, wordsPerMinute: number = 200): number => {
  const text = extractTextFromHtml(html);
  const wordCount = text.split(' ').filter(word => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const generateExcerpt = (html: string, maxLength: number = 200): string => {
  const text = extractTextFromHtml(html);
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};


