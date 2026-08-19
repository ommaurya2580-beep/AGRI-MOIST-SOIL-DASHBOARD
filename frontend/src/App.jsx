import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import Monitoring from './pages/Monitoring';
import CropHistoryWizard from './pages/CropHistoryWizard';

// Legacy components mapped to new routes for now
import PestDetection from './components/PestDetection';
import CropAnalysis from './components/CropAnalysis';
import TerraLeafPro from './components/TerraLeafPro';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Application Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fields" element={<div className="p-4">Fields (Under Construction)</div>} />
          <Route path="crop-history" element={<CropHistoryWizard />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="sensors" element={<div className="p-4">Sensors Data (Under Construction)</div>} />
          <Route path="weather" element={<Weather />} />
          <Route path="reports" element={<div className="p-4">Reports & History (Under Construction)</div>} />
          <Route path="alerts" element={<div className="p-4">Alerts & Notifications (Under Construction)</div>} />
          <Route path="recommendations" element={<div className="p-4">Recommendations (Under Construction)</div>} />
          <Route path="settings" element={<div className="p-4">Settings (Under Construction)</div>} />
          
          {/* Analysis Flow routes mapped to existing components for now */}
          <Route path="analysis/disease" element={<CropAnalysis />} />
          <Route path="analysis/pest" element={<PestDetection />} />
          <Route path="analysis/pro" element={<TerraLeafPro />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
