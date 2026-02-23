import { useState, useEffect } from 'react';

export default function ScrollButtons() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Show top button when scrolled down more than 300px
      setShowTop(scrollTop > 300);
      
      // Show bottom button when not at bottom (with 100px threshold)
      setShowBottom(scrollTop + clientHeight < scrollHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll to Top Button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-50 bg-gray-900 dark:bg-[#21262d] text-white dark:text-[#e6edf3] p-3 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-[#30363d] transition-all hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Scroll to Bottom Button */}
      {showBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-[#21262d] text-white dark:text-[#e6edf3] p-3 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-[#30363d] transition-all hover:scale-110"
          aria-label="Scroll to bottom"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </>
  );
}
