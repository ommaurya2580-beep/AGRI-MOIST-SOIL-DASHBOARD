import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Radio, 
  RefreshCw, 
  Cpu, 
  Wifi, 
  Clock, 
  Droplets, 
  Thermometer, 
  FlaskConical, 
  Sprout, 
  ShieldAlert, 
  CheckCircle2, 
  LineChart as ChartIcon, 
  Sun, 
  CloudRain, 
  Lightbulb, 
  ExternalLink, 
  Wrench, 
  Layers, 
  Zap, 
  Power,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function Sensors({ isDiagnosticMode = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDiag = isDiagnosticMode || location.pathname === '/iot-sync';

  // Live IoT States from Backend
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [moisture, setMoisture] = useState(42);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('20 Oct 2026, 01:32 PM');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active Metric for Trends Chart
  const [selectedMetric, setSelectedMetric] = useState('Moisture');

  // Static / Semi-static Agro Metrics matching mockup
  const [temperature] = useState(24);
  const [phVal] = useState(6.8);
  const [nitrogen] = useState(42);
  const [phosphorus] = useState(28);
  const [potassium] = useState(35);

  const handleDiagnosticConfirm = () => {
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    currentData.sensors = {
      moisture: moisture,
      temperature: temperature,
      pH: phVal,
      nitrogen: nitrogen,
      phosphorus: phosphorus,
      potassium: potassium,
      pump_state: pumpStatus,
      is_online: isOnline
    };
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));
    navigate('/image-upload');
  };

  const fetchDeviceData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      if (data) {
        if (data.currentMoisture !== undefined) setMoisture(data.currentMoisture || 42);
        if (data.isOnline !== undefined) setIsOnline(data.isOnline);
        if (data.state) {
          setIsAutoMode(data.state.isAutoMode ?? true);
          setPumpStatus(data.state.pumpIsOn ?? false);
        }
        const now = new Date();
        setLastSyncTime(`${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      }
    } catch (err) {
      console.warn("Could not fetch state, using sensor cache");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchDeviceData();
    const interval = setInterval(fetchDeviceData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleControlUpdate = async (updates) => {
    try {
      await fetch('/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      fetchDeviceData();
    } catch (e) {
      console.error(e);
    }
  };

  // Trend data series for the 24h chart
  const trendSeries = {
    'Moisture': [
      { time: '12 AM', value: 34 },
      { time: '2 AM', value: 32 },
      { time: '4 AM', value: 35 },
      { time: '6 AM', value: 38 },
      { time: '8 AM', value: 44 },
      { time: '10 AM', value: 50 },
      { time: '12 PM', value: 56 },
      { time: '2 PM', value: 52 },
      { time: '4 PM', value: 48 },
      { time: '6 PM', value: 45 },
      { time: '8 PM', value: 42 },
      { time: '10 PM', value: 40 },
      { time: '12 AM', value: 38 }
    ],
    'Temperature': [
      { time: '12 AM', value: 19 },
      { time: '4 AM', value: 17 },
      { time: '8 AM', value: 21 },
      { time: '12 PM', value: 27 },
      { time: '4 PM', value: 25 },
      { time: '8 PM', value: 22 },
      { time: '12 AM', value: 20 }
    ],
    'pH': [
      { time: '12 AM', value: 6.7 },
      { time: '4 AM', value: 6.7 },
      { time: '8 AM', value: 6.8 },
      { time: '12 PM', value: 6.9 },
      { time: '4 PM', value: 6.8 },
      { time: '8 PM', value: 6.8 },
      { time: '12 AM', value: 6.7 }
    ],
    'Nitrogen (N)': [
      { time: '12 AM', value: 40 },
      { time: '4 AM', value: 40 },
      { time: '8 AM', value: 42 },
      { time: '12 PM', value: 43 },
      { time: '4 PM', value: 42 },
      { time: '8 PM', value: 41 },
      { time: '12 AM', value: 41 }
    ],
    'Phosphorus (P)': [
      { time: '12 AM', value: 27 },
      { time: '4 AM', value: 27 },
      { time: '8 AM', value: 28 },
      { time: '12 PM', value: 29 },
      { time: '4 PM', value: 28 },
      { time: '8 PM', value: 28 },
      { time: '12 AM', value: 27 }
    ],
    'Potassium (K)': [
      { time: '12 AM', value: 34 },
      { time: '4 AM', value: 34 },
      { time: '8 AM', value: 35 },
      { time: '12 PM', value: 36 },
      { time: '4 PM', value: 35 },
      { time: '8 PM', value: 35 },
      { time: '12 AM', value: 34 }
    ]
  };

  const currentChartData = trendSeries[selectedMetric] || trendSeries['Moisture'];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-16 animate-in fade-in">
      
      {/* 1. Header Banner with Soil Probe Graphic */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-stone-200/80 shadow-sm p-6 lg:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Title & Subtitle */}
        <div className="flex items-start gap-4 z-10 max-w-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
            <Radio size={26} className="animate-pulse stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              IoT Soil Monitoring
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium leading-relaxed">
              Real-time field data to understand soil conditions and support better crop decisions.
            </p>
          </div>
        </div>

        {/* Right Side Crop Image */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 lg:w-[35%] overflow-hidden pointer-events-none">
          <img 
            src="/images/soil_sensor_banner.jpg" 
            alt="Soil probe in crop field" 
            className="w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
        </div>
      </div>

      {/* 2. Device Status Bar */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-stone-200/70 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Status */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700">
              <span>Device Online</span>
            </div>
            <p className="text-[11px] text-slate-400">Last Sync: {lastSyncTime}</p>
          </div>
        </div>

        {/* Device Name */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Cpu size={17} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Device Name</span>
            <h4 className="text-xs font-bold text-slate-800">ESP32-WF-01</h4>
            <p className="text-[10px] text-slate-400">MAC: 24:6F:28:3A:7F:11</p>
          </div>
        </div>

        {/* Network */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Wifi size={17} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Network</span>
            <h4 className="text-xs font-bold text-slate-800">AgriPulse_Net</h4>
            <p className="text-[10px] text-slate-400">IP: 192.168.1.105</p>
          </div>
        </div>

        {/* Uptime */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock size={17} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Uptime</span>
            <h4 className="text-xs font-bold text-slate-800">2d 14h 32m</h4>
            <p className="text-[10px] text-slate-400">Firmware: v1.0.6</p>
          </div>
        </div>

        {/* Refresh Button */}
        <div>
          <button
            onClick={fetchDeviceData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#EBF4FF] hover:bg-[#DDEBFF] text-[#2B7FFF] border border-blue-200/60 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
        </div>

      </div>

      {/* 3. Live Sensor Readings (6 Cards Row) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sprout size={14} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Live Sensor Readings</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Last Updated: {lastSyncTime}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Data
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          {/* 1. Moisture */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Droplets size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Soil Moisture</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{moisture}%</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Optimal
                </span>
                <span className="text-[10px] text-slate-400">Range: 20 - 60%</span>
              </div>
            </div>
          </div>

          {/* 2. Temperature */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Thermometer size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Soil Temperature</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{temperature}°C</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Normal
                </span>
                <span className="text-[10px] text-slate-400">Range: 10 - 35°C</span>
              </div>
            </div>
          </div>

          {/* 3. pH */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FlaskConical size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Soil pH</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{phVal}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Good
                </span>
                <span className="text-[10px] text-slate-400">Range: 6.0 - 7.5</span>
              </div>
            </div>
          </div>

          {/* 4. Nitrogen (N) */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sprout size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Nitrogen (N)</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{nitrogen} <span className="text-xs font-normal text-slate-400">kg/ha</span></div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Optimal
                </span>
                <span className="text-[10px] text-slate-400">Range: 20 - 60</span>
              </div>
            </div>
          </div>

          {/* 5. Phosphorus (P) */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sprout size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Phosphorus (P)</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{phosphorus} <span className="text-xs font-normal text-slate-400">kg/ha</span></div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Optimal
                </span>
                <span className="text-[10px] text-slate-400">Range: 15 - 40</span>
              </div>
            </div>
          </div>

          {/* 6. Potassium (K) */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Layers size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Potassium (K)</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{potassium} <span className="text-xs font-normal text-slate-400">kg/ha</span></div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Optimal
                </span>
                <span className="text-[10px] text-slate-400">Range: 20 - 50</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Middle Section: Sensor Trends (24h) & Field Environment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (Span 7): Sensor Trends Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <ChartIcon size={18} className="text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">Sensor Trends (Last 24 Hours)</h3>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {['Moisture', 'Temperature', 'pH', 'Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedMetric(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMetric === tab
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Area Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: '#94A3B8' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#94A3B8' }} 
                    axisLine={false} 
                    tickLine={false} 
                    domain={['dataMin - 5', 'dataMax + 10']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '12px', 
                      border: '1px solid #E2E8F0', 
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563EB" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#moistureGrad)" 
                    dot={{ fill: '#2563EB', r: 3.5 }}
                    activeDot={{ r: 6, fill: '#1D4ED8' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (Span 5): Field Environment Overview & Pump Control */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/70 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sprout size={18} className="text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">Field Environment Overview</h3>
            </div>

            {/* 4 Mini Environment Metric Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Thermometer size={18} className="text-rose-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Air Temperature</div>
                  <div className="text-sm font-bold text-slate-800">28°C</div>
                  <span className="text-[9px] text-slate-400">Partly Cloudy</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Droplets size={18} className="text-blue-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Humidity</div>
                  <div className="text-sm font-bold text-slate-800">65%</div>
                  <span className="text-[9px] font-bold text-emerald-600">Normal</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Sun size={18} className="text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Light Intensity</div>
                  <div className="text-sm font-bold text-slate-800">850 lux</div>
                  <span className="text-[9px] font-bold text-emerald-600">Good</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <CloudRain size={18} className="text-blue-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Rainfall (Today)</div>
                  <div className="text-sm font-bold text-slate-800">0 mm</div>
                  <span className="text-[9px] text-slate-400">No Rain</span>
                </div>
              </div>
            </div>

            {/* Suitable Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 mb-3">
              <Sprout size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-emerald-800">Soil conditions are suitable for crop growth.</h5>
                <p className="text-[11px] text-emerald-600 leading-snug mt-0.5">
                  Moisture, pH and nutrient levels are within optimal range.
                </p>
              </div>
            </div>

            {/* Suggestion Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 mb-4">
              <Lightbulb size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-amber-900">Suggestion</h5>
                <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                  Maintain current irrigation schedule. Monitor moisture regularly, especially if no rain is expected in the next 2 days.
                </p>
              </div>
            </div>
          </div>

          {/* Connected Irrigation Pump Relay Control */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Power size={15} className={pumpStatus ? "text-emerald-500" : "text-slate-400"} />
                <span className="text-xs font-bold text-slate-800">Irrigation Relay Motor</span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                  pumpStatus ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                }`}>
                  {pumpStatus ? "MOTOR RUNNING" : "MOTOR OFF"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isAutoMode ? "Auto Mode: Triggers when moisture < 40%" : "Manual Override Mode Active"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleControlUpdate({ isAutoMode: !isAutoMode })}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  isAutoMode 
                    ? "bg-emerald-600 text-white border-emerald-600" 
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                Auto: {isAutoMode ? "ON" : "OFF"}
              </button>
              <button
                disabled={isAutoMode}
                onClick={() => handleControlUpdate({ pumpIsOn: !pumpStatus, isManualOverride: true })}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  pumpStatus 
                    ? "bg-rose-600 text-white border-rose-600" 
                    : "bg-[#E8592A] text-white border-[#E8592A]"
                }`}
              >
                {pumpStatus ? "Turn OFF" : "Start Pump"}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 5. Bottom Section: IoT Connection Guide (5 Steps Workflow) */}
      <div className="bg-white rounded-3xl p-6 lg:p-7 border border-stone-200/70 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">IoT Connection Guide</h3>
              <p className="text-xs text-slate-500">
                Follow these steps to connect your ESP32 soil sensor with AgriPulse
              </p>
            </div>
          </div>

          <a 
            href="#guide" 
            onClick={(e) => { e.preventDefault(); alert("AgriPulse IoT Firmware and ESP8266/ESP32 Arduino code is available in the hardware/ directory."); }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View Detailed Guide</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* 5 Connected Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative">
          
          {/* Step 1: Prepare Hardware */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-800">Prepare Hardware</h4>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 pl-1 mb-3">
                <li className="flex items-center gap-1.5 text-emerald-700">✓ ESP32 board</li>
                <li className="flex items-center gap-1.5 text-emerald-700">✓ Soil moisture sensor</li>
                <li className="flex items-center gap-1.5 text-emerald-700">✓ pH sensor (optional)</li>
                <li className="flex items-center gap-1.5 text-emerald-700">✓ NPK sensor (optional)</li>
                <li className="flex items-center gap-1.5 text-emerald-700">✓ Power supply (5V)</li>
              </ul>
            </div>
            <div className="w-8 h-8 mx-auto mt-2 opacity-60">
              <Cpu size={28} className="text-blue-500" />
            </div>
          </div>

          {/* Step 2: Connect Sensors */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#E8592A] text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-800">Connect Sensors</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                Connect all sensors to ESP32 as per wiring diagram (Detailed diagram available in guide).
              </p>
            </div>
            <div className="w-8 h-8 mx-auto mt-2 opacity-60">
              <Layers size={28} className="text-orange-500" />
            </div>
          </div>

          {/* Step 3: Configure Wi-Fi */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-800">Configure Wi-Fi</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                Set your Wi-Fi credentials in the ESP32 firmware.
              </p>
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-[10px] text-slate-600 font-mono space-y-0.5">
                <div>SSID: Agripulse_Net</div>
                <div>Password: ********</div>
              </div>
            </div>
            <div className="w-8 h-8 mx-auto mt-2 opacity-60">
              <Wifi size={28} className="text-emerald-500" />
            </div>
          </div>

          {/* Step 4: Upload Firmware */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <h4 className="text-xs font-bold text-slate-800">Upload Firmware</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                Upload the provided firmware to ESP32 using Arduino IDE or PlatformIO.
              </p>
            </div>
            <div className="w-8 h-8 mx-auto mt-2 opacity-60">
              <Zap size={28} className="text-purple-500" />
            </div>
          </div>

          {/* Step 5: Verify Connection */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  5
                </span>
                <h4 className="text-xs font-bold text-slate-800">Verify Connection</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                After setup, check device status above. It should show "Device Online" and real-time data will appear automatically.
              </p>
            </div>
            <div className="w-8 h-8 mx-auto mt-2 text-amber-500">
              <CheckCircle2 size={32} />
            </div>
          </div>

        </div>

      </div>

      {/* Diagnostic Flow Confirmation Bar (Visible when in Diagnostic Mode /iot-sync) */}
      {isDiag && (
        <div className="bg-white rounded-3xl p-6 lg:p-7 border-2 border-emerald-500 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mt-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sprout size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  Diagnostic Flow: Step 3 of 4 (IoT Ground Truth Telemetry)
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-800">
                Confirm Live Soil Data for Your Affected Field?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Ground Truth: Moisture {moisture}%, Temp {temperature}°C, pH {phVal}. This telemetry will be cross-referenced with your 30-day weather and vision data.
              </p>
            </div>
          </div>

          <button
            onClick={handleDiagnosticConfirm}
            className="w-full md:w-auto px-8 py-3.5 rounded-full bg-[#E8592A] hover:bg-[#D44A1E] text-white font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95"
          >
            <CheckCircle2 size={18} />
            <span>Confirm Sensor Data & Proceed to AI Vision</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
