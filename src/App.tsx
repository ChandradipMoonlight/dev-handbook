import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import LanguageTutorial from './pages/LanguageTutorial';
import DSATutorial from './pages/DSATutorial';
import SystemDesign from './pages/SystemDesign';
import InterviewPrep from './pages/InterviewPrep';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/languages" element={<LanguageTutorial />} />
              <Route path="/languages/:lang" element={<LanguageTutorial />} />
              <Route path="/languages/:lang/:topic" element={<LanguageTutorial />} />
              <Route path="/dsa" element={<DSATutorial />} />
              <Route path="/dsa/:topic" element={<DSATutorial />} />
              <Route path="/system-design" element={<SystemDesign />} />
              <Route path="/system-design/:topic" element={<SystemDesign />} />
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/interview/:topic" element={<InterviewPrep />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
