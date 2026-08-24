import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import Monitoring from './pages/Monitoring';
import WeatherSync from './pages/WeatherSync';
import IoTSync from './pages/IoTSync';
import CropHistoryWizard from './pages/CropHistoryWizard';
import Sensors from './pages/Sensors';
import ESP32Connect from './pages/ESP32Connect';
import FertilizerGuide from './pages/FertilizerGuide';

import ProblemCategory from './pages/ProblemCategory';
import ProblemDetail from './pages/ProblemDetail';

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
        
        {/* Wizard Flow Route (No Sidebar) */}
        <Route path="/setup" element={<CropHistoryWizard />} />

        {/* Main Application Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fields" element={<div className="p-4">Fields Map (Under Construction)</div>} />
          
          <Route path="fertilizer-guide">
            <Route index element={<FertilizerGuide />} />
            <Route path="category/:categoryId" element={<ProblemCategory />} />
            <Route path="problem/:problemId" element={<ProblemDetail />} />
          </Route>
          
          <Route path="irrigation" element={<div className="p-4">Irrigation (Under Construction)</div>} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="sensors" element={<Sensors />} />
          <Route path="esp32-connect" element={<ESP32Connect />} />
          <Route path="soil-npk" element={<div className="p-4">Soil & NPK (Under Construction)</div>} />
          <Route path="weather" element={<Weather />} />
          <Route path="weather-sync" element={<WeatherSync />} />
          <Route path="iot-sync" element={<IoTSync />} />
          <Route path="reports" element={<CropHistoryWizard />} />
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
