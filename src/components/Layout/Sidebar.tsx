import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SidebarItem {
  title: string;
  path: string;
  order?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export default function Sidebar({ items, title }: SidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Sort items by order if available
  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-screen
          w-64 bg-white border-r border-gray-200 z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
          <nav className="space-y-1">
            {sortedItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    block px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
