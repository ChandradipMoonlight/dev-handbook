import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import CodeBlock from './CodeBlock';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

// Helper function to convert .md links to React Router paths
function convertMarkdownLinkToRoute(href: string): string | null {
  // Skip external links
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return null;
  }

  // Only process .md files
  if (!href.includes('.md')) {
    return null;
  }

  // Split href and hash fragment
  const [pathPart, hashFragment] = href.split('#');
  
  // Remove .md extension
  let path = pathPart.replace(/\.md$/, '');
  
  // Handle relative paths
  if (path.startsWith('./')) {
    path = path.substring(2);
  }
  
  // Remove leading slash if present (for relative paths)
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  
  // Extract filename from path (e.g., topics/01-network-security -> 01-network-security)
  const filename = path.split('/').pop() || path;
  
  // Map to system-design routes for security content
  if (filename.startsWith('01-') || filename.startsWith('02-') || 
      filename.startsWith('03-') || filename.startsWith('04-') ||
      filename.startsWith('05-') || filename.startsWith('06-') ||
      filename.startsWith('07-') || filename.startsWith('08-') ||
      filename.startsWith('09-') || filename.startsWith('10-') ||
      filename.startsWith('11-') || filename.startsWith('12-') ||
      filename.startsWith('project-') || filename === 'security-roadmap' ||
      filename === 'security-architecture-overview') {
    // Add hash fragment back if present
    const route = `/system-design/${filename}`;
    return hashFragment ? `${route}#${hashFragment}` : route;
  }
  
  return null;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    a({ href, children, ...props }) {
      const routePath = href ? convertMarkdownLinkToRoute(href) : null;
      
      if (routePath) {
        // Use React Router Link for internal .md links
        return (
          <Link to={routePath} className="text-blue-600 dark:text-[#58a6ff] hover:underline">
            {children}
          </Link>
        );
      }
      
      // External links or non-.md links use regular anchor tags
      return (
        <a 
          href={href} 
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-blue-600 dark:text-[#58a6ff] hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    },
    code(props) {
      const { className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');
      const inline = !className || !match;

      if (!inline && language) {
        return <CodeBlock language={language} code={codeString} />;
      }

      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border-collapse">{children}</table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-gray-50 dark:bg-[#161b22]">{children}</thead>;
    },
    tbody({ children }) {
      return <tbody>{children}</tbody>;
    },
    tr({ children }) {
      return <tr className="border-b border-gray-200 dark:border-[#30363d]">{children}</tr>;
    },
    th({ children }) {
      return (
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-[#c9d1d9] border-r border-gray-200 dark:border-[#30363d] last:border-r-0">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="px-4 py-3 text-sm text-gray-700 dark:text-[#8b949e] border-r border-gray-200 dark:border-[#30363d] last:border-r-0">
          {children}
        </td>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
