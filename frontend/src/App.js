import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';
import AdminPanel from './pages/AdminPanel';
import SourceHub from './pages/SourceHub';
import SourceManager from './pages/SourceManager';
import MagicScanner from './pages/MagicScanner';

function App() {
  return (
    // यहाँ अब <Router> टैग की ज़रूरत नहीं है, सिर्फ Routes रखें
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/job/:id" element={<JobDetail />} />
      {/* अगर कोई गलत URL डाले तो होम पर वापस भेजें */}
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/sources" element={<SourceHub />} />
      <Route path="/manage-sources" element={<SourceManager />} />
      <Route path="/magic-scanner" element={<MagicScanner />} />
    </Routes>
  );
}

export default App;