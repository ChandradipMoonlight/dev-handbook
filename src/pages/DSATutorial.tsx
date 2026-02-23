import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getContentByCategory } from '@/utils/contentIndex';
import { loadMarkdown } from '@/utils/markdownLoader';
import MarkdownRenderer from '@/components/Content/MarkdownRenderer';
import TableOfContents from '@/components/Content/TableOfContents';
import Sidebar from '@/components/Layout/Sidebar';
import ScrollButtons from '@/components/Layout/ScrollButtons';

export default function DSATutorial() {
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
        const items = getContentByCategory('dsa');
        
        if (!topic && items.length > 0) {
          // Redirect to first topic if no topic specified
          navigate(`/dsa/${items[0].metadata.topic}`, { replace: true });
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
        
        // Scroll to top when content loads
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError('Failed to load content');
        setLoading(false);
      }
    };

    loadContent();
  }, [topic, navigate]);

  const dsaItems = getContentByCategory('dsa');

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
          <Link to="/dsa" className="text-blue-600 hover:underline">
            Go back to DSA topics
          </Link>
        </div>
      </div>
    );
  }

  const sidebarItems = dsaItems.map((item) => ({
    title: item.metadata.title,
    path: `/dsa/${item.metadata.topic}`,
    order: item.metadata.order,
  }));

  // Find current topic index and get next/previous topics
  const currentIndex = dsaItems.findIndex((item) => item.metadata.topic === topic);
  const nextItem = currentIndex >= 0 && currentIndex < dsaItems.length - 1 ? dsaItems[currentIndex + 1] : null;
  const prevItem = currentIndex > 0 ? dsaItems[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors">
      <div className="flex">
        <Sidebar items={sidebarItems} title="DSA Topics" />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </article>
            
            {/* Next/Previous Topic Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-[#30363d]">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {prevItem ? (
                  <Link
                    to={`/dsa/${prevItem.metadata.topic}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group flex-1 p-4 rounded-lg border border-gray-200 dark:border-[#30363d] hover:border-gray-300 dark:hover:border-[#40464e] hover:bg-gray-50 dark:hover:bg-[#161b22] transition-colors"
                  >
                    <div className="text-sm text-gray-500 dark:text-[#8b949e] mb-1">Previous</div>
                    <div className="font-medium text-gray-900 dark:text-[#e6edf3] group-hover:text-blue-600 dark:group-hover:text-[#58a6ff]">
                      ← {prevItem.metadata.title}
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                
                {nextItem ? (
                  <Link
                    to={`/dsa/${nextItem.metadata.topic}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group flex-1 p-4 rounded-lg border border-gray-200 dark:border-[#30363d] hover:border-gray-300 dark:hover:border-[#40464e] hover:bg-gray-50 dark:hover:bg-[#161b22] transition-colors text-right sm:text-left"
                  >
                    <div className="text-sm text-gray-500 dark:text-[#8b949e] mb-1">Next</div>
                    <div className="font-medium text-gray-900 dark:text-[#e6edf3] group-hover:text-blue-600 dark:group-hover:text-[#58a6ff]">
                      {nextItem.metadata.title} →
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            </div>
            
            <div className="hidden xl:block sticky top-20 mt-8">
              <TableOfContents content={content} />
            </div>
          </div>
        </main>
      </div>
      <ScrollButtons />
    </div>
  );
}
