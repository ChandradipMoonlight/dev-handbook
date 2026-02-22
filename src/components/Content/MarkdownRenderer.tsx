import ReactMarkdown from 'react-markdown';
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
  };

  return (
    <ReactMarkdown components={components}>{content}</ReactMarkdown>
  );
}
