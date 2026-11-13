import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { PathGeneratorPage } from './pages/PathGeneratorPage';
import { TestModePage } from './pages/TestModePage';
import { NotesPage } from './pages/NotesPage';
import { MasteryPage } from './pages/MasteryPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#070B14] text-[#F8FAFC] font-sans selection:bg-teal-500 selection:text-[#070B14]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/learn/:courseId?/:videoId?" element={<WorkspacePage />} />
              <Route path="/discovery" element={<DiscoveryPage />} />
              <Route path="/path-generator" element={<PathGeneratorPage />} />
              <Route path="/test" element={<TestModePage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/mastery" element={<MasteryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Fallback to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
