'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface BlogContentProps {
  content: string;
}

export const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  const containerRef = useRef<HTMLElement>(null);
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre, img');
      setSections(Array.from(elements) as HTMLElement[]);
    }
  }, [content]);

  return (
    <motion.article
      ref={containerRef}
      style={{ opacity, scale }}
      className="max-w-4xl mx-auto px-6 py-8"
    >
      <div
        className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
          prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
          prose-p:leading-[1.8] prose-p:text-[1.0625rem] prose-p:my-6
          prose-a:text-primary prose-a:no-underline prose-a:font-medium prose-a:transition-all
          hover:prose-a:underline hover:prose-a:decoration-2 hover:prose-a:underline-offset-4
          prose-blockquote:border-l-4 prose-blockquote:border-primary
          prose-blockquote:pl-6 prose-blockquote:italic
          prose-blockquote:text-muted-foreground prose-blockquote:my-8
          prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
          prose-code:bg-muted prose-code:px-2 prose-code:py-1
          prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border
          prose-pre:p-6 prose-pre:rounded-lg prose-pre:my-8
          prose-pre:overflow-x-auto prose-pre:shadow-lg
          prose-ul:my-6 prose-ul:list-disc
          prose-ol:my-6 prose-ol:list-decimal
          prose-li:my-2 prose-li:leading-relaxed
          prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-10
          prose-img:border prose-img:border-border prose-img:transition-transform prose-img:duration-300
          hover:prose-img:scale-[1.02]
          prose-hr:border-border prose-hr:my-12
          prose-table:border-collapse prose-table:my-8 prose-table:shadow-md prose-table:rounded-lg prose-table:overflow-hidden
          prose-th:border prose-th:border-border prose-th:bg-muted
          prose-th:p-3 prose-th:font-semibold prose-th:text-left
          prose-td:border prose-td:border-border prose-td:p-3
          prose-strong:font-semibold prose-strong:text-foreground
          prose-em:italic
          [&>*]:animate-in [&>*]:fade-in [&>*]:slide-in-from-bottom-4 [&>*]:duration-700
          [&>*:nth-child(even)]:delay-100 [&>*:nth-child(3n)]:delay-200"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </motion.article>
  );
};

function AnimatedSection({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
