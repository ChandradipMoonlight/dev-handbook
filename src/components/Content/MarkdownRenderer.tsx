import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
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
