import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold text-blue-600">📚</div>
            <span className="text-xl font-bold text-gray-900">Dev Handbook</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/languages"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Languages
            </Link>
            <Link
              to="/dsa"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              DSA
            </Link>
            <Link
              to="/system-design"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              System Design
            </Link>
            <Link
              to="/interview"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Interview Prep
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
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
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/languages"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Languages
              </Link>
              <Link
                to="/dsa"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                DSA
              </Link>
              <Link
                to="/system-design"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                System Design
              </Link>
              <Link
                to="/interview"
                className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Interview Prep
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
