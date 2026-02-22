import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117]">
      {/* 1️⃣ Hero Section */}
      <section className="relative overflow-hidden py-24">
        {/* Subtle gradient background with blurred elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#0d1117] dark:via-[#0d1117] dark:to-[#161b22] -z-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30 dark:opacity-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30 dark:opacity-10" />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-[#e6edf3] leading-tight tracking-tight">
              Dev Handbook
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700 dark:text-[#c9d1d9]">
              Master Java, LLD, and System Design in Simple Language
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-[#8b949e] mb-10 max-w-2xl mx-auto leading-relaxed">
              Your comprehensive guide to mastering programming fundamentals, low-level design patterns, and high-level system architecture with clear explanations and real-world examples.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/languages"
                className="px-8 py-3.5 bg-gray-900 dark:bg-[#21262d] text-white dark:text-[#e6edf3] rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-[#30363d] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Learning
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white dark:bg-[#161b22] text-gray-900 dark:text-[#e6edf3] rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#21262d] transition-all duration-300 border border-gray-200 dark:border-[#30363d] shadow-sm hover:shadow-md"
              >
                View GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Features Section - 3 Premium Cards */}
      <section className="py-24 border-b border-gray-200 dark:border-[#30363d]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Java Fundamentals Card */}
            <Link
              to="/languages"
              className="group p-8 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-[#30363d] hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors duration-300">
                <span className="text-2xl">☕</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-[#e6edf3]">
                Java Fundamentals
              </h3>
              <p className="text-gray-600 dark:text-[#8b949e] leading-relaxed mb-4">
                Master core Java concepts, OOP principles, collections, and advanced features with practical examples and clear explanations.
              </p>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:underline inline-flex items-center">
                Explore Java →
              </span>
            </Link>

            {/* Low Level Design Card */}
            <Link
              to="/dsa"
              className="group p-8 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-[#30363d] hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100 dark:hover:shadow-purple-900/20 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-[#e6edf3]">
                Low Level Design
              </h3>
              <p className="text-gray-600 dark:text-[#8b949e] leading-relaxed mb-4">
                Learn design patterns, SOLID principles, and object-oriented design with hands-on examples and best practices.
              </p>
              <span className="text-purple-600 dark:text-purple-400 font-medium text-sm group-hover:underline inline-flex items-center">
                Explore LLD →
              </span>
            </Link>

            {/* High Level Design Card */}
            <Link
              to="/system-design"
              className="group p-8 bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-[#30363d] hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-[#e6edf3]">
                High Level Design
              </h3>
              <p className="text-gray-600 dark:text-[#8b949e] leading-relaxed mb-4">
                Design scalable, distributed systems. Learn microservices, databases, caching, load balancing, and system architecture.
              </p>
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:underline inline-flex items-center">
                Explore HLD →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3️⃣ Why Dev Handbook Section */}
      <section className="py-24 border-b border-gray-200 dark:border-[#30363d]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-[#e6edf3]">
              Why Dev Handbook?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-[#e6edf3]">
                  Simple Language
                </h3>
                <p className="text-gray-600 dark:text-[#8b949e] leading-relaxed">
                  Complex concepts explained in plain English. No jargon, no confusion—just clear, actionable knowledge.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-[#e6edf3]">
                  Real-World Examples
                </h3>
                <p className="text-gray-600 dark:text-[#8b949e] leading-relaxed">
                  Learn with practical examples from actual projects and industry-standard implementations.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-[#e6edf3]">
                  Interview Focused
                </h3>
                <p className="text-gray-600 dark:text-[#8b949e] leading-relaxed">
                  Content curated specifically to help you ace technical interviews at top tech companies.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-[#e6edf3]">
                  Comprehensive Coverage
                </h3>
                <p className="text-gray-600 dark:text-[#8b949e] leading-relaxed">
                  From basics to advanced topics—everything you need to become a better developer in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ Call To Action Section */}
      <section className="py-24 bg-gray-900 dark:bg-[#161b22]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white dark:text-[#e6edf3]">
              Ready to Master Development?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 dark:text-[#8b949e] mb-10 max-w-2xl mx-auto leading-relaxed">
              Start your journey today and join thousands of developers mastering Java, LLD, and System Design.
            </p>
            <Link
              to="/languages"
              className="inline-block px-10 py-4 bg-white dark:bg-[#21262d] text-gray-900 dark:text-[#e6edf3] rounded-lg font-semibold text-lg hover:bg-gray-100 dark:hover:bg-[#30363d] transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start Learning Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
