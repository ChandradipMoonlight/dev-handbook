import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getContentByCategory } from '@/utils/contentIndex';
import { loadMarkdown } from '@/utils/markdownLoader';
import MarkdownRenderer from '@/components/Content/MarkdownRenderer';
import TableOfContents from '@/components/Content/TableOfContents';
import Sidebar from '@/components/Layout/Sidebar';
import ScrollButtons from '@/components/Layout/ScrollButtons';

export default function LanguageTutorial() {
  const { lang, topic } = useParams<{ lang?: string; topic?: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languageItems = getContentByCategory('languages', lang || '');

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
        
        if (items.length === 0) {
          setError('No content available for this language');
          setLoading(false);
          return;
        }
        
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
        
        // Scroll to top when content loads
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError('Failed to load content');
        setLoading(false);
        console.error('Error loading content:', err);
      }
    };

    loadContent();
  }, [lang, topic, navigate]);

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

  const sidebarItems = languageItems && Array.isArray(languageItems)
    ? languageItems.map((item) => ({
        title: item.metadata.title,
        path: `/languages/${lang}/${item.metadata.topic}`,
        folder: item.metadata.folder,
        order: item.metadata.order,
      }))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors">
        <div className="flex">
          {lang && <Sidebar items={sidebarItems} title={lang.toUpperCase()} />}
          <main className="flex-1 lg:ml-64">
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-[#58a6ff] mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-[#8b949e]">Loading content...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors">
        <div className="flex">
          {lang && <Sidebar items={sidebarItems} title={lang.toUpperCase()} />}
          <main className="flex-1 lg:ml-64">
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Link to="/languages" className="text-blue-600 dark:text-[#58a6ff] hover:underline">
                  Go back to languages
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Find current topic index and get next/previous topics
  const currentIndex = languageItems.findIndex((item) => item.metadata.topic === topic);
  const nextItem = currentIndex >= 0 && currentIndex < languageItems.length - 1 ? languageItems[currentIndex + 1] : null;
  const prevItem = currentIndex > 0 ? languageItems[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors">
      <div className="flex">
        <Sidebar items={sidebarItems} title={lang.toUpperCase()} />
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
                    to={`/languages/${lang}/${prevItem.metadata.topic}`}
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
                    to={`/languages/${lang}/${nextItem.metadata.topic}`}
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
