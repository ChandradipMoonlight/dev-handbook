import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getContentByCategory, getContentByPath } from '@/utils/contentIndex';
import { loadMarkdown } from '@/utils/markdownLoader';
import MarkdownRenderer from '@/components/Content/MarkdownRenderer';
import TableOfContents from '@/components/Content/TableOfContents';
import Sidebar from '@/components/Layout/Sidebar';
import type { ContentItem } from '@/types/content';

export default function LanguageTutorial() {
  const { lang, topic } = useParams<{ lang?: string; topic?: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!lang) {
          // Show language list
          setContent('');
          setLoading(false);
          return;
        }

        const items = getContentByCategory('languages', lang);
        
        if (!topic && items.length > 0) {
          // Redirect to first topic if no topic specified
          navigate(`/languages/${lang}/${items[0].metadata.topic}`, { replace: true });
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
        console.error('Error loading content:', err);
      }
    };

    loadContent();
  }, [lang, topic, navigate]);

  const languageItems = getContentByCategory('languages', lang || '');

  if (!lang) {
    // Show language selection
    const languages = ['java', 'python'];
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Programming Languages</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((language) => {
              const items = getContentByCategory('languages', language);
              return (
                <Link
                  key={language}
                  to={`/languages/${language}`}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
                >
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white capitalize">
                    {language}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {items.length} tutorial{items.length !== 1 ? 's' : ''} available
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

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
          <Link to="/languages" className="text-blue-600 hover:underline">
            Go back to languages
          </Link>
        </div>
      </div>
    );
  }

  const sidebarItems = languageItems.map((item) => ({
    title: item.metadata.title,
    path: `/languages/${lang}/${item.metadata.topic}`,
    order: item.metadata.order,
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="flex">
        <Sidebar items={sidebarItems} title={lang.toUpperCase()} />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </article>
            <div className="hidden xl:block sticky top-20 mt-12">
              <TableOfContents content={content} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
