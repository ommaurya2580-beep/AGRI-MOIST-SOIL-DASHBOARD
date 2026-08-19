import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudRain, Wind, Droplets, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">AgriPulse Dashboard</h1>
        <p className="text-slate-500">Welcome to your farm's digital control center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards for other dashboard metrics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2">Total Fields</h3>
          <p className="text-3xl font-bold text-emerald-600">24</p>
          <p className="text-sm text-emerald-500 mt-2 font-medium">16 Healthy • 5 Need Attention</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-2">Active Alerts</h3>
          <p className="text-3xl font-bold text-amber-500">3</p>
          <p className="text-sm text-slate-500 mt-2 font-medium">2 Pest Warnings • 1 Low Moisture</p>
        </div>

        {/* Compact Weather Summary Card */}
        <div 
          onClick={() => navigate('/weather')}
          className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-sm border border-blue-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow-sm text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <ArrowRight size={16} />
          </div>
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
            Weather Summary
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <CloudRain size={40} className="text-blue-500" />
            <div>
              <div className="text-3xl font-bold text-slate-800">28°C</div>
              <div className="text-sm font-medium text-slate-500">Partly Cloudy</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-blue-100 pt-4">
            <div className="text-center">
              <Droplets size={14} className="mx-auto text-blue-400 mb-1" />
              <div className="text-xs font-semibold text-slate-700">65%</div>
            </div>
            <div className="text-center">
              <Wind size={14} className="mx-auto text-slate-400 mb-1" />
              <div className="text-xs font-semibold text-slate-700">12 km/h</div>
            </div>
            <div className="text-center">
              <CloudRain size={14} className="mx-auto text-blue-400 mb-1" />
              <div className="text-xs font-semibold text-slate-700">20%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center mt-12">
        <h2 className="text-xl font-bold text-emerald-800 mb-2">More Dashboard Features Coming Soon</h2>
        <p className="text-emerald-600">The rest of the dashboard is being built out with real-time data integration.</p>
      </div>
    </div>
  );
}
