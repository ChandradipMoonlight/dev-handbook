import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');

      if (!inline && language) {
        return <CodeBlock language={language} code={codeString} />;
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
