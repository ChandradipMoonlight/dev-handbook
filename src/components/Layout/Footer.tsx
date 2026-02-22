export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 dark:text-gray-400 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Dev Handbook</h3>
            <p className="text-sm">
              Your comprehensive guide to programming languages, data structures,
              system design, and interview preparation.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/languages" className="hover:text-white transition-colors">
                  Programming Languages
                </a>
              </li>
              <li>
                <a href="/dsa" className="hover:text-white transition-colors">
                  Data Structures & Algorithms
                </a>
              </li>
              <li>
                <a href="/system-design" className="hover:text-white transition-colors">
                  System Design
                </a>
              </li>
              <li>
                <a href="/interview" className="hover:text-white transition-colors">
                  Interview Preparation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <p className="text-sm">
              Learn programming concepts in simple English with real-world examples.
              Perfect for beginners and experienced developers alike.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Dev Handbook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
