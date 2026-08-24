import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Thermometer, FlaskConical, Clock, Activity, Wifi, Link, CheckCircle, ExternalLink, Leaf, AlertCircle, Power, CheckCircle2, ChevronRight, Database } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API_URL = '/api';

export default function Sensors({ isDiagnosticMode = false }) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [savedPayload, setSavedPayload] = useState(null);

  const handleDiagnosticConfirm = () => {
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    const iotPayload = {
      soil_moisture_percent: moisture,
      soil_temperature_c: mockTemp,
      soil_ph: mockPh,
      nitrogen_mg_kg: 45, // Using diagnostic mock for NPK as it's not live
      phosphorus_mg_kg: 28,
      potassium_mg_kg: 110,
      device_id: "ESP32-WF-01",
      is_online: isOnline
    };
    currentData.iot = iotPayload;
    
    setSavedPayload(iotPayload);
    setIsSaving(true);
    
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));
    
    setTimeout(() => {
      navigate('/image-upload');
    }, 2500);
  };

  const [activeTab, setActiveTab] = useState('24h');

  // Backend Live State
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [moisture, setMoisture] = useState(28);
  const [trendData, setTrendData] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [timeAgoStr, setTimeAgoStr] = useState('Waiting for data...');

  // Mock data for other sensors
  const [mockTemp] = useState(24.6);
  const [mockPh] = useState(6.7);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isOnline) {
        setTimeAgoStr('Sensor Offline');
        return;
      }
      if (lastUpdateTime) {
        const seconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
        if (seconds < 2) setTimeAgoStr('Just now');
        else if (seconds < 60) setTimeAgoStr(`${seconds} seconds ago`);
        else setTimeAgoStr(`${Math.floor(seconds/60)} mins ago`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdateTime, isOnline]);

  const fetchData = async () => {
    try {
      const stateRes = await fetch(`${API_URL}/state`);
      const stateData = await stateRes.json();
      if (stateData.state) {
        setIsAutoMode(stateData.state.isAutoMode);
        setPumpStatus(stateData.state.pumpIsOn);
      }
      setMoisture(stateData.currentMoisture || 0);
      
      const online = stateData.isOnline !== undefined ? stateData.isOnline : false;
      setIsOnline(online);
      
      if (online) {
        setLastUpdateTime(Date.now());
      }

      const trendRes = await fetch(`${API_URL}/trend`);
      const trendJson = await trendRes.json();
      
      const formattedTrend = trendJson.map(item => ({
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        moisture: item.moistureLevel,
        temp: mockTemp + (Math.random() * 2 - 1), // Fake temp around mock
        ph: mockPh + (Math.random() * 0.4 - 0.2) // Fake pH around mock
      }));
      setTrendData(formattedTrend.slice(-20)); // Keep last 20 for chart
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateControl = async (updates) => {
    try {
      await fetch(`${API_URL}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      fetchData();
    } catch (error) {
      console.error("Error updating control:", error);
    }
  };

  const handleAutoToggle = (e) => {
    const newVal = e.target.checked;
    setIsAutoMode(newVal);
    updateControl({ isAutoMode: newVal });
  };

  const handleManualToggle = () => {
    const newVal = !pumpStatus;
    setPumpStatus(newVal);
    updateControl({ pumpIsOn: newVal, isManualOverride: true });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto relative">
      
      {/* Diagnostic Saving Data Overlay */}
      {isSaving && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 border-2 border-emerald-500">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">Live IoT Data Captured!</h2>
            <p className="text-slate-500 mb-6 text-center text-sm">Data structured for Root Cause Engine</p>
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Moisture Level</span>
                  <span className="text-slate-800 font-semibold">{savedPayload?.moisture} (Analog)</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Temperature</span>
                  <span className="text-slate-800 font-semibold">{savedPayload?.temperature}°C</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">pH Level</span>
                  <span className="text-slate-800 font-semibold">{savedPayload?.pH}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-slate-400 text-xs uppercase font-bold tracking-wider block mb-1">Pump State</span>
                  <span className="text-slate-800 font-semibold">{savedPayload?.pump_state}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm font-bold text-slate-400 mt-6 text-center animate-pulse flex items-center justify-center gap-2">
              Proceeding to Step 4: Multi-Model AI Vision <ChevronRight size={16} />
            </p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sensors</h1>
          <p className="text-slate-500">Real-time soil monitoring</p>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 ${!isOnline && 'border-red-200'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isOnline ? 'Device Online' : 'Device Offline'}
          </div>
          <div className="text-sm text-slate-500">
            Last Sync: <strong>{timeAgoStr}</strong>
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
                <h3 className={`text-3xl font-bold ${!isOnline ? 'text-slate-400' : 'text-slate-800'}`}>{isOnline ? moisture : '--'}</h3>
                <span className="text-lg font-semibold text-slate-600">%</span>
              </div>
              <p className={`${
                !isOnline ? 'text-red-500' :
                moisture < 40 ? 'text-orange-500' : 
                moisture > 60 ? 'text-blue-500' : 'text-emerald-500'
              } text-sm font-medium mt-1`}>
                {!isOnline ? 'Disconnected' : moisture < 40 ? 'Dry' : moisture > 60 ? 'Wet' : 'Optimal'}
              </p>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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
                <h3 className={`text-3xl font-bold ${!isOnline ? 'text-slate-400' : 'text-slate-800'}`}>{isOnline ? mockTemp.toFixed(1) : '--'}</h3>
                <span className="text-lg font-semibold text-slate-600">°C</span>
              </div>
              <p className={`${!isOnline ? 'text-red-500' : 'text-emerald-500'} text-sm font-medium mt-1`}>
                {!isOnline ? 'Disconnected' : 'Optimal'}
              </p>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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
                <h3 className={`text-3xl font-bold ${!isOnline ? 'text-slate-400' : 'text-slate-800'}`}>{isOnline ? mockPh.toFixed(1) : '--'}</h3>
              </div>
              <p className={`${!isOnline ? 'text-red-500' : 'text-emerald-500'} text-sm font-medium mt-1`}>
                {!isOnline ? 'Disconnected' : 'Optimal'}
              </p>
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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

      {/* Motor Control Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-3">
          <div className="flex items-center gap-3 font-semibold text-slate-800 mb-6 text-lg">
            <div className={`p-2 rounded-lg ${pumpStatus ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              <Power size={20} />
            </div>
            Premium Motor Control
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-semibold text-slate-800 text-lg">Smart Auto-Irrigation</div>
                <div className="text-sm text-slate-500 mt-1">AI-driven watering based on moisture thresholds.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer scale-125 mr-2">
                <input type="checkbox" className="sr-only peer" checked={isAutoMode} onChange={handleAutoToggle} />
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-slate-800">Manual Override</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider ${pumpStatus ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                  {pumpStatus ? 'PUMP RUNNING' : 'PUMP OFF'}
                </span>
              </div>
              
              <button 
                className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition-all text-lg ${
                  pumpStatus 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg shadow-slate-500/20'
                }`}
                onClick={handleManualToggle}
              >
                <Power size={24} />
                {pumpStatus ? 'TAP TO TURN OFF MOTOR' : 'TAP TO START MOTOR'}
              </button>
            </div>
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
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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

      {/* Diagnostic Flow Footer (Only visible when navigated from Weather Sync) */}
      {isDiagnosticMode && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider">Live Link Active</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Is this the live sensor data for your affected field?</h3>
            <p className="text-slate-500 text-sm">We will use this real-time Ground Truth to cross-reference with Weather data.</p>
          </div>
          <button 
            onClick={handleDiagnosticConfirm}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/30 shrink-0"
          >
            <CheckCircle2 size={20} /> Attach Data & Continue <ChevronRight size={18} />
          </button>
        </div>
      )}

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
