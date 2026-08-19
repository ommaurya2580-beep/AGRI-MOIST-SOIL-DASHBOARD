import React, { useState } from 'react';
import { Droplet, Thermometer, FlaskConical, Clock, Activity, Wifi, Link, CheckCircle, ExternalLink, Leaf, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockData = [
  { time: '12:00 PM', moisture: 75, temp: 42, ph: 24 },
  { time: '2:00 PM', moisture: 78, temp: 44, ph: 23 },
  { time: '4:00 PM', moisture: 82, temp: 40, ph: 28 },
  { time: '6:00 PM', moisture: 80, temp: 45, ph: 27 },
  { time: '8:00 PM', moisture: 77, temp: 48, ph: 26 },
  { time: '10:00 PM', moisture: 76, temp: 50, ph: 28 },
  { time: '12:00 AM', moisture: 85, temp: 52, ph: 31 },
  { time: '2:00 AM', moisture: 80, temp: 48, ph: 29 },
  { time: '4:00 AM', moisture: 77, temp: 45, ph: 27 },
  { time: '6:00 AM', moisture: 74, temp: 42, ph: 25 },
  { time: '8:00 AM', moisture: 76, temp: 44, ph: 24 },
  { time: '10:30 AM', moisture: 74, temp: 43, ph: 23 },
];

export default function Sensors() {
  const [activeTab, setActiveTab] = useState('24h');

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sensors</h1>
          <p className="text-slate-500">Real-time soil monitoring</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Device Online
          </div>
          <div className="text-sm text-slate-500">
            Last Sync: <strong>Just now</strong>
          </div>
        </div>
      </div>

      {/* Top Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Soil Moisture */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Droplet className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Soil Moisture</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h3 className="text-3xl font-bold text-slate-800">28</h3>
                <span className="text-lg font-semibold text-slate-600">%</span>
              </div>
              <p className="text-emerald-500 text-sm font-medium mt-1">Optimal</p>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.slice(-6)}>
                <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Soil Temperature */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <Thermometer className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Soil Temperature</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h3 className="text-3xl font-bold text-slate-800">24.6</h3>
                <span className="text-lg font-semibold text-slate-600">°C</span>
              </div>
              <p className="text-emerald-500 text-sm font-medium mt-1">Optimal</p>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.slice(-6)}>
                <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Soil pH */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <FlaskConical className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Soil pH</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h3 className="text-3xl font-bold text-slate-800">6.7</h3>
              </div>
              <p className="text-emerald-500 text-sm font-medium mt-1">Optimal</p>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.slice(-6)}>
                <Line type="monotone" dataKey="ph" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Update Interval */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Clock size={100} />
          </div>
          <div className="flex items-center gap-2 text-slate-600 mb-4">
            <Clock size={18} />
            <h3 className="font-semibold">Update Interval</h3>
          </div>
          <p className="text-sm text-slate-500">Update Every</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">15 Minutes</h2>
          
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Last Updated</p>
            <p className="text-sm font-semibold text-slate-700">10:30 AM</p>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Soil NPK Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="text-emerald-500" size={20} />
            <h3 className="font-bold text-slate-800">Soil NPK Status</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Nitrogen */}
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center text-center border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-3">N</div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Nitrogen (N)</p>
              <h3 className="text-2xl font-bold text-slate-800">42</h3>
              <p className="text-xs text-slate-500 mb-2">kg/ha</p>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full mb-3">Optimal</span>
              <p className="text-[10px] text-slate-400">Range: 20-60</p>
            </div>
            
            {/* Phosphorus */}
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center text-center border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-3">P</div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Phosphorus (P)</p>
              <h3 className="text-2xl font-bold text-slate-800">28</h3>
              <p className="text-xs text-slate-500 mb-2">kg/ha</p>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full mb-3">Optimal</span>
              <p className="text-[10px] text-slate-400">Range: 15-40</p>
            </div>
            
            {/* Potassium */}
            <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center text-center border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-3">K</div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Potassium (K)</p>
              <h3 className="text-2xl font-bold text-slate-800">35</h3>
              <p className="text-xs text-slate-500 mb-2">kg/ha</p>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full mb-3">Optimal</span>
              <p className="text-[10px] text-slate-400">Range: 20-50</p>
            </div>
          </div>
        </div>

        {/* Sensor Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="font-bold text-slate-800 mb-6">Sensor Overview</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <Activity size={18} className="text-emerald-500" />
                <span className="text-sm">Total Sensors</span>
              </div>
              <span className="font-bold text-slate-800">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <Activity size={18} className="text-emerald-500" />
                <span className="text-sm">Active Sensors</span>
              </div>
              <span className="font-bold text-slate-800">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <CheckCircle size={18} className="text-emerald-500" />
                <span className="text-sm">Status</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">All Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <DatabaseIcon size={18} className="text-emerald-500" />
                <span className="text-sm">Data Logging</span>
              </div>
              <span className="text-sm font-bold text-slate-800">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <Clock size={18} className="text-emerald-500" />
                <span className="text-sm">Update Interval</span>
              </div>
              <span className="text-sm font-bold text-slate-800">15 Minutes</span>
            </div>
          </div>
        </div>

        {/* ESP32 Device Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <CpuIcon size={20} className="text-emerald-500" />
            <h3 className="font-bold text-slate-800">ESP32 Device Details</h3>
          </div>
          <div className="space-y-4">
            <DetailRow label="Device Name" value="ESP32-WF-01" />
            <DetailRow label="Device ID" value="ESP32-3A7F" />
            <DetailRow label="MAC Address" value="24:6F:28:3A:7F:11" />
            <DetailRow label="Wi-Fi SSID" value="AgriPulse_Net" />
            <DetailRow label="IP Address" value="192.168.1.105" />
            <DetailRow label="Firmware Version" value="v1.0.6" />
            <DetailRow label="Uptime" value="2d 14h 32m" />
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sensor Data History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">
              Sensor Data History <span className="text-sm font-normal text-slate-500">(Last 24 Hours)</span>
            </h3>
            <div className="flex gap-2">
              {['24h', '7d', '30d'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${activeTab === tab ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" name="Soil Moisture (%)" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Soil Temperature (°C)" dataKey="temp" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Soil pH" dataKey="ph" stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Connect */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link size={20} className="text-emerald-500" />
              <h3 className="font-bold text-slate-800">Quick Connect ESP32</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Connect your ESP32 device to start monitoring real-time data.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
                <p className="text-sm text-slate-700">Power on your ESP32 device</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
                <p className="text-sm text-slate-700">Connect to Wi-Fi network</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
                <p className="text-sm text-slate-700">Enter device credentials below</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0">4</div>
                <p className="text-sm text-slate-700">Start receiving live data</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-[#064e3b] hover:bg-emerald-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Wifi size={18} />
              Connect ESP32
            </button>
            <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
              View Connection Guide <ExternalLink size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helpers
const DatabaseIcon = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const CpuIcon = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-800">{value}</span>
  </div>
);
