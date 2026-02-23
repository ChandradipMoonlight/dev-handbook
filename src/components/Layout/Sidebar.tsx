import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SidebarItem {
  title: string;
  path: string;
  folder?: string;
  order?: number;
}

interface SidebarGroup {
  folder: string;
  items: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export default function Sidebar({ items, title }: SidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Safety check: ensure items is an array
  if (!items || !Array.isArray(items)) {
    return null;
  }

  // Sort items by order if available
  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Separate items with and without folders
  const itemsWithoutFolder: SidebarItem[] = [];
  const folderMap = new Map<string, SidebarItem[]>();

  sortedItems.forEach((item) => {
    if (item.folder) {
      if (!folderMap.has(item.folder)) {
        folderMap.set(item.folder, []);
      }
      folderMap.get(item.folder)!.push(item);
    } else {
      itemsWithoutFolder.push(item);
    }
  });

  // Build grouped items: items without folder first, then folders
  const groupedItems: (SidebarGroup | SidebarItem)[] = [...itemsWithoutFolder];
  
  // Add folders (sorted by folder name for consistency)
  const sortedFolders = Array.from(folderMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  sortedFolders.forEach(([folderName, folderItems]) => {
    groupedItems.push({ folder: folderName, items: folderItems });
  });

  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsOpen(false);
  }, [location.pathname]);

  const renderItem = (item: SidebarItem) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`
          block px-3 py-2 rounded-md text-sm transition-colors ml-4
          ${
            isActive
              ? 'bg-gray-100 dark:bg-[#1f6feb]/20 text-gray-900 dark:text-[#58a6ff] font-medium'
              : 'text-gray-600 dark:text-[#8b949e] hover:bg-gray-50 dark:hover:bg-[#21262d] hover:text-gray-900 dark:hover:text-[#c9d1d9]'
          }
        `}
        onClick={() => setIsOpen(false)}
      >
        {item.title}
      </Link>
    );
  };

  const isSidebarGroup = (item: SidebarGroup | SidebarItem): item is SidebarGroup => {
    return 'folder' in item && 'items' in item;
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className="lg:hidden fixed top-16 right-4 z-50 bg-gray-900 dark:bg-[#21262d] text-white p-3 rounded-lg shadow-xl hover:bg-gray-800 dark:hover:bg-[#30363d] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
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
        )}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-14 lg:top-0 left-0 h-[calc(100vh-3.5rem)] lg:h-screen
          w-64 bg-white dark:bg-[#161b22] border-r border-gray-200 dark:border-[#30363d] z-40 lg:z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-4 lg:p-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
          <nav className="space-y-1">
            {groupedItems.map((item) => {
              if (isSidebarGroup(item)) {
                // It's a folder group
                if (!item.items || !Array.isArray(item.items) || item.items.length === 0) {
                  return null;
                }
                return (
                  <div key={item.folder} className="mt-4 first:mt-0">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">
                      {item.folder}
                    </div>
                    <div className="space-y-1">
                      {item.items.map((subItem: SidebarItem) => renderItem(subItem))}
                    </div>
                  </div>
                );
              } else {
                // It's a regular item
                return renderItem(item);
              }
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
