import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import Monitoring from './pages/Monitoring';
import WeatherSync from './pages/WeatherSync';
import CropHistoryWizard from './pages/CropHistoryWizard';
import MultiModelVision from './pages/MultiModelVision';
import EngineCompute from './pages/EngineCompute';
import Sensors from './pages/Sensors';
import ESP32Connect from './pages/ESP32Connect';
import FertilizerGuide from './pages/FertilizerGuide';
import UnifiedAnalysisFlow from './pages/CropAnalysis/UnifiedAnalysisFlow';
import Alerts from './pages/Alerts';
import History from './pages/History';
import SettingsPage from './pages/Settings';

import ProblemCategory from './pages/ProblemCategory';
import ProblemDetail from './pages/ProblemDetail';

// Legacy components
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
          <Route path="crop-analysis" element={<UnifiedAnalysisFlow />} />
          
          <Route path="fertilizer-guide">
            <Route index element={<FertilizerGuide />} />
            <Route path="category/:categoryId" element={<ProblemCategory />} />
            <Route path="problem/:problemId" element={<ProblemDetail />} />
          </Route>
          
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="sensors" element={<Sensors />} />
          <Route path="esp32-connect" element={<ESP32Connect />} />
          <Route path="weather" element={<Weather />} />
          <Route path="weather-sync" element={<WeatherSync />} />
          <Route path="iot-sync" element={<Sensors isDiagnosticMode={true} />} />
          <Route path="image-upload" element={<MultiModelVision />} />
          <Route path="engine-compute" element={<EngineCompute />} />
          <Route path="reports" element={<CropHistoryWizard />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Analysis Flow routes mapped */}
          <Route path="analysis/disease" element={<CropAnalysis />} />
          <Route path="analysis/pest" element={<PestDetection />} />
          <Route path="analysis/pro" element={<TerraLeafPro />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
