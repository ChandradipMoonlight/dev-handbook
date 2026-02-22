import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117]">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Dev Handbook
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
              Learn programming concepts in simple English with real-world examples
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/languages"
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Start Learning
              </Link>
              <Link
                to="/dsa"
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Explore DSA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Programming Languages */}
            <Link
              to="/languages"
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <div className="text-3xl mb-3">💻</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Programming Languages
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Learn Java, Python, and more with simple explanations and real-world examples.
              </p>
            </Link>

            {/* DSA */}
            <Link
              to="/dsa"
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Data Structures & Algorithms
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Master arrays, linked lists, trees, and algorithms with clear explanations.
              </p>
            </Link>

            {/* System Design */}
            <Link
              to="/system-design"
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <div className="text-3xl mb-3">🏗️</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                System Design
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Learn to design scalable systems and understand architecture patterns.
              </p>
            </Link>

            {/* Interview Prep */}
            <Link
              to="/interview"
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Interview Preparation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Prepare for technical interviews with common questions and solutions.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose Dev Handbook?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Simple English
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Complex concepts explained in easy-to-understand language, perfect for beginners.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Real-World Examples
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Learn with practical examples that you'll encounter in actual projects.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Comprehensive Coverage
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                From basics to advanced topics, everything you need in one place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
