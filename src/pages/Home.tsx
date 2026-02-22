import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Dev Handbook
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Learn programming concepts in simple English with real-world examples
            </p>
            <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/languages"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
            >
              Start Learning
            </Link>
            <Link
              to="/dsa"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all hover:scale-105 border border-blue-500 shadow-lg"
            >
              Explore DSA
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Programming Languages */}
            <Link
              to="/languages"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-blue-500 hover:scale-105"
            >
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Programming Languages
              </h3>
              <p className="text-gray-600">
                Learn Java, Python, and more with simple explanations and real-world examples.
              </p>
            </Link>

            {/* DSA */}
            <Link
              to="/dsa"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-blue-500 hover:scale-105"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Data Structures & Algorithms
              </h3>
              <p className="text-gray-600">
                Master arrays, linked lists, trees, and algorithms with clear explanations.
              </p>
            </Link>

            {/* System Design */}
            <Link
              to="/system-design"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-blue-500 hover:scale-105"
            >
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                System Design
              </h3>
              <p className="text-gray-600">
                Learn to design scalable systems and understand architecture patterns.
              </p>
            </Link>

            {/* Interview Prep */}
            <Link
              to="/interview"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-blue-500 hover:scale-105"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Interview Preparation
              </h3>
              <p className="text-gray-600">
                Prepare for technical interviews with common questions and solutions.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Dev Handbook?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Simple English
              </h3>
              <p className="text-gray-600">
                Complex concepts explained in easy-to-understand language, perfect for beginners.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Real-World Examples
              </h3>
              <p className="text-gray-600">
                Learn with practical examples that you'll encounter in actual projects.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Comprehensive Coverage
              </h3>
              <p className="text-gray-600">
                From basics to advanced topics, everything you need in one place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
