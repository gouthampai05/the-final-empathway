import { Blog } from '../types/Blog';

export const MOCK_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'Getting Started with Next.js 14 and React Server Components',
    slug: 'getting-started-with-nextjs-14-and-react-server-components',
    content: `<h1>Introduction to Next.js 14</h1>
<p>Next.js 14 brings exciting new features and improvements that make building React applications more efficient and powerful. In this comprehensive guide, we'll explore the latest features and how to leverage them in your projects.</p>

<h2>What's New in Next.js 14</h2>
<p>The latest version introduces several groundbreaking features:</p>
<ul>
<li>Enhanced App Router with improved performance</li>
<li>Server Components optimization</li>
<li>Better TypeScript support</li>
<li>Improved developer experience</li>
</ul>

<h2>Getting Started</h2>
<p>To start using Next.js 14, simply run:</p>
<pre><code>npx create-next-app@latest my-app</code></pre>

<blockquote>
<p>Next.js 14 represents a significant leap forward in React framework capabilities, offering developers unprecedented control over their applications.</p>
</blockquote>`,
    excerpt: 'Learn how to build modern web applications with Next.js 14 and React Server Components. This comprehensive guide covers everything you need to know to get started.',
    status: 'published',
    author: 'John Developer',
    tags: ['nextjs', 'react', 'web-development', 'javascript', 'tutorial'],
    category: 'technology',
    featured: true,
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    views: 1250,
    likes: 89,
  },
  {
    id: 'blog-2',
    title: 'Modern UI/UX Design Principles for 2024',
    slug: 'modern-ui-ux-design-principles-for-2024',
    content: `<h1>Design Trends That Will Shape 2024</h1>
<p>The landscape of UI/UX design continues to evolve rapidly, with new trends emerging that prioritize user experience, accessibility, and visual appeal. Let's explore the key principles that will define modern design in 2024.</p>

<h2>Key Design Principles</h2>
<ul>
<li><strong>Minimalism with Purpose:</strong> Clean interfaces that focus on essential elements</li>
<li><strong>Dark Mode Optimization:</strong> Designing for both light and dark themes</li>
<li><strong>Micro-interactions:</strong> Subtle animations that enhance user engagement</li>
<li><strong>Accessibility First:</strong> Inclusive design practices</li>
</ul>

<h2>Color and Typography</h2>
<p>Modern design emphasizes:</p>
<ul>
<li>High contrast ratios for better readability</li>
<li>Sustainable design choices</li>
<li>Variable fonts for performance</li>
</ul>

<p>These principles help create interfaces that are not only beautiful but also functional and inclusive.</p>`,
    excerpt: 'Explore the latest UI/UX design principles and trends that will shape digital experiences in 2024 and beyond. From minimalism to accessibility.',
    status: 'published',
    author: 'Sarah Designer',
    tags: ['design', 'ui', 'ux', 'trends', '2024'],
    category: 'design',
    featured: false,
    publishedAt: '2024-01-12T14:20:00Z',
    createdAt: '2024-01-11T09:15:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    readTime: 6,
    views: 890,
    likes: 67,
  },
  {
    id: 'blog-3',
    title: 'Building Scalable APIs with Node.js and TypeScript',
    slug: 'building-scalable-apis-with-nodejs-and-typescript',
    content: `<h1>Building Production-Ready APIs</h1>
<p>Creating robust and scalable APIs is crucial for modern web applications. This guide walks through best practices for building APIs with Node.js and TypeScript.</p>

<h2>Project Setup</h2>
<p>Start by setting up your TypeScript environment:</p>
<pre><code>npm init -y
npm install express typescript @types/node @types/express
npm install -D ts-node nodemon</code></pre>

<h2>Best Practices</h2>
<ul>
<li>Use proper error handling middleware</li>
<li>Implement request validation</li>
<li>Add rate limiting</li>
<li>Use environment variables for configuration</li>
</ul>

<h2>Testing Your API</h2>
<p>Don't forget to implement comprehensive testing with Jest and Supertest.</p>`,
    excerpt: 'A complete guide to building production-ready APIs using Node.js and TypeScript with best practices and performance optimization techniques.',
    status: 'draft',
    author: 'Mike Backend',
    tags: ['nodejs', 'typescript', 'api', 'backend', 'express'],
    category: 'development',
    featured: false,
    createdAt: '2024-01-13T11:45:00Z',
    updatedAt: '2024-01-13T16:20:00Z',
    readTime: 12,
    views: 0,
    likes: 0,
  },
  {
    id: 'blog-4',
    title: 'Mastering React Hooks in 2024',
    slug: 'mastering-react-hooks-in-2024',
    content: `<h1>Advanced React Hooks Patterns</h1>
<p>React Hooks have revolutionized how we write React components. In this article, we'll dive deep into advanced patterns and best practices.</p>

<h2>Custom Hooks</h2>
<p>Creating reusable logic with custom hooks:</p>
<pre><code>const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  // ... rest of the implementation
};</code></pre>

<h2>Performance Optimization</h2>
<ul>
<li>useMemo for expensive calculations</li>
<li>useCallback for function memoization</li>
<li>React.memo for component optimization</li>
</ul>`,
    excerpt: 'Deep dive into advanced React Hooks patterns and performance optimization techniques for building better React applications.',
    status: 'published',
    author: 'Emma React',
    tags: ['react', 'hooks', 'javascript', 'performance', 'frontend'],
    category: 'development',
    featured: true,
    publishedAt: '2024-01-10T08:30:00Z',
    createdAt: '2024-01-09T14:15:00Z',
    updatedAt: '2024-01-10T08:30:00Z',
    readTime: 10,
    views: 2100,
    likes: 156,
  },
  {
    id: 'blog-5',
    title: 'The Future of Web Development',
    slug: 'the-future-of-web-development',
    content: `<h1>Emerging Technologies in Web Development</h1>
<p>The web development landscape is constantly evolving. Let's explore the technologies and trends that will shape the future of web development.</p>

<h2>Key Technologies</h2>
<ul>
<li><strong>WebAssembly (WASM):</strong> Near-native performance in browsers</li>
<li><strong>Edge Computing:</strong> Reducing latency with distributed computing</li>
<li><strong>Progressive Web Apps:</strong> Bridging web and native app experiences</li>
<li><strong>AI Integration:</strong> Intelligent user interfaces</li>
</ul>

<h2>Development Trends</h2>
<p>Several trends are reshaping how we build for the web:</p>
<ul>
<li>Component-driven development</li>
<li>Jamstack architecture</li>
<li>Serverless computing</li>
<li>Low-code/no-code platforms</li>
</ul>

<blockquote>
<p>The future of web development lies in creating more performant, accessible, and user-centric experiences.</p>
</blockquote>`,
    excerpt: 'Explore the emerging technologies and trends that will define the future of web development, from WebAssembly to AI integration.',
    status: 'published',
    author: 'Alex Future',
    tags: ['web-development', 'future', 'technology', 'trends', 'innovation'],
    category: 'technology',
    featured: false,
    publishedAt: '2024-01-08T16:45:00Z',
    createdAt: '2024-01-07T10:20:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
    readTime: 7,
    views: 1580,
    likes: 94,
  },
  {
    id: 'blog-6',
    title: 'CSS Grid vs Flexbox: When to Use Each',
    slug: 'css-grid-vs-flexbox-when-to-use-each',
    content: `<h1>Understanding CSS Layout Systems</h1>
<p>CSS Grid and Flexbox are both powerful layout systems, but they serve different purposes. Understanding when to use each can significantly improve your CSS skills.</p>

<h2>When to Use Flexbox</h2>
<p>Flexbox excels at:</p>
<ul>
<li>One-dimensional layouts (rows or columns)</li>
<li>Centering content</li>
<li>Distributing space between items</li>
<li>Component-level layouts</li>
</ul>

<h2>When to Use CSS Grid</h2>
<p>CSS Grid is perfect for:</p>
<ul>
<li>Two-dimensional layouts</li>
<li>Complex page layouts</li>
<li>Overlapping content</li>
<li>Responsive design patterns</li>
</ul>

<h2>Practical Examples</h2>
<pre><code>/* Flexbox for navigation */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Grid for page layout */
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
}</code></pre>`,
    excerpt: 'A comprehensive comparison of CSS Grid and Flexbox, including practical examples and guidelines on when to use each layout system.',
    status: 'draft',
    author: 'Lisa CSS',
    tags: ['css', 'grid', 'flexbox', 'layout', 'frontend'],
    category: 'design',
    featured: false,
    createdAt: '2024-01-14T09:30:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
    readTime: 5,
    views: 0,
    likes: 0,
  },
  {
    id: 'blog-7',
    title: 'Database Optimization Techniques for Web Applications',
    slug: 'database-optimization-techniques-for-web-applications',
    content: `<h1>Optimizing Database Performance</h1>
<p>Database performance is crucial for web application success. This guide covers essential optimization techniques that every developer should know.</p>

<h2>Indexing Strategies</h2>
<p>Proper indexing can dramatically improve query performance:</p>
<ul>
<li>Create indexes on frequently queried columns</li>
<li>Use composite indexes for multi-column queries</li>
<li>Avoid over-indexing to prevent write performance issues</li>
</ul>

<h2>Query Optimization</h2>
<ul>
<li>Use EXPLAIN to analyze query execution plans</li>
<li>Avoid N+1 query problems</li>
<li>Implement proper pagination</li>
<li>Use database functions instead of application logic when appropriate</li>
</ul>

<h2>Caching Strategies</h2>
<p>Implement multiple layers of caching:</p>
<ul>
<li>Application-level caching (Redis, Memcached)</li>
<li>Database query result caching</li>
<li>CDN for static assets</li>
</ul>`,
    excerpt: 'Learn essential database optimization techniques to improve web application performance, including indexing, query optimization, and caching strategies.',
    status: 'published',
    author: 'David Database',
    tags: ['database', 'optimization', 'performance', 'sql', 'backend'],
    category: 'development',
    featured: false,
    publishedAt: '2024-01-05T12:15:00Z',
    createdAt: '2024-01-04T08:45:00Z',
    updatedAt: '2024-01-05T12:15:00Z',
    readTime: 9,
    views: 1820,
    likes: 103,
  },
  {
    id: 'blog-8',
    title: 'Building Responsive Designs with Tailwind CSS',
    slug: 'building-responsive-designs-with-tailwind-css',
    content: `<h1>Mastering Responsive Design with Tailwind</h1>
<p>Tailwind CSS makes building responsive designs intuitive and efficient. Learn how to create beautiful, responsive interfaces using Tailwind's utility classes.</p>

<h2>Responsive Design Principles</h2>
<ul>
<li>Mobile-first approach</li>
<li>Progressive enhancement</li>
<li>Flexible grid systems</li>
<li>Scalable typography</li>
</ul>

<h2>Tailwind Responsive Utilities</h2>
<pre><code><!-- Responsive text sizing -->
<h1 class="text-2xl md:text-4xl lg:text-6xl">
  Responsive Heading
</h1>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Grid items -->
</div></code></pre>

<h2>Advanced Techniques</h2>
<p>Take your Tailwind skills to the next level:</p>
<ul>
<li>Custom breakpoints</li>
<li>Container queries</li>
<li>Dynamic spacing</li>
<li>Responsive animations</li>
</ul>`,
    excerpt: 'Master responsive web design using Tailwind CSS utilities. Learn mobile-first design principles and advanced responsive techniques.',
    status: 'archived',
    author: 'Sophie Styles',
    tags: ['tailwind', 'css', 'responsive', 'design', 'frontend'],
    category: 'design',
    featured: false,
    publishedAt: '2023-12-20T14:30:00Z',
    createdAt: '2023-12-19T11:20:00Z',
    updatedAt: '2023-12-20T14:30:00Z',
    readTime: 6,
    views: 945,
    likes: 72,
  },
];
