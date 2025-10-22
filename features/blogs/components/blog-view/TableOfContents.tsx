'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse headings from content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');

    const items: TocItem[] = Array.from(headings).map((heading, index) => {
      const id = `heading-${index}`;
      const level = parseInt(heading.tagName.charAt(1));
      return {
        id,
        text: heading.textContent || '',
        level,
      };
    });

    setToc(items);

    // Add IDs to actual headings in the DOM
    const actualHeadings = document.querySelectorAll('article h1, article h2, article h3');
    actualHeadings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    actualHeadings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [content]);

  if (toc.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="hidden xl:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto"
    >
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          <List className="h-4 w-4" />
          <span>Table of Contents</span>
        </div>
        <ul className="space-y-2">
          {toc.map((item) => (
            <motion.li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`text-sm text-left w-full py-1 transition-colors ${
                  activeId === item.id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.text}
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};
