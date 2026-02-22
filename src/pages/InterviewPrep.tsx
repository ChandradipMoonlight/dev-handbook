import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getContentByCategory } from '@/utils/contentIndex';
import { loadMarkdown } from '@/utils/markdownLoader';
import MarkdownRenderer from '@/components/Content/MarkdownRenderer';
import TableOfContents from '@/components/Content/TableOfContents';
import Sidebar from '@/components/Layout/Sidebar';

export default function InterviewPrep() {
  const { topic } = useParams<{ topic?: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const items = getContentByCategory('interview');
        
        if (!topic && items.length > 0) {
          // Redirect to first topic if no topic specified
          navigate(`/interview/${items[0].metadata.topic}`, { replace: true });
          return;
        }

        const contentItem = topic
          ? items.find((item) => item.metadata.topic === topic)
          : items[0];

        if (!contentItem) {
          setError('Content not found');
          setLoading(false);
          return;
        }

        // Load markdown content
        const markdownContent = await loadMarkdown(contentItem.path);
        setContent(markdownContent);
        setLoading(false);
      } catch (err) {
        setError('Failed to load content');
        setLoading(false);
      }
    };

    loadContent();
  }, [topic, navigate]);

  const interviewItems = getContentByCategory('interview');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/interview" className="text-blue-600 hover:underline">
            Go back to Interview Prep topics
          </Link>
        </div>
      </div>
    );
  }

  const sidebarItems = interviewItems.map((item) => ({
    title: item.metadata.title,
    path: `/interview/${item.metadata.topic}`,
    order: item.metadata.order,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar items={sidebarItems} title="Interview Prep" />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 mb-8">
              <MarkdownRenderer content={content} />
            </div>
            <div className="hidden xl:block sticky top-20">
              <TableOfContents content={content} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
