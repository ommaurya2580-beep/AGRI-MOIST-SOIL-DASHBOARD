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
  ArrowRight,
  AlertTriangle,
  WifiOff,
  Copy,
  Check,
  Terminal,
  Sliders,
  X,
  HelpCircle,
  Send,
  Play,
  Activity
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

  // Live IoT States from Backend (null when hardware is offline)
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [moisture, setMoisture] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [phVal, setPhVal] = useState(null);
  const [nitrogen, setNitrogen] = useState(null);
  const [phosphorus, setPhosphorus] = useState(null);
  const [potassium, setPotassium] = useState(null);

  // Cached / Historical Ground Truth (from previous sessions)
  const [cachedData, setCachedData] = useState(null);
  const [showHistorical, setShowHistorical] = useState(false);
  
  // Field Environment Overview
  const [airTemp, setAirTemp] = useState(28.0);
  const [humidity, setHumidity] = useState(65);
  const [lightIntensity, setLightIntensity] = useState(850);
  const [rainfall, setRainfall] = useState(0);

  // Device Connectivity & Telemetry Tracking
  const [isOnline, setIsOnline] = useState(false);
  const [lastPacketTime, setLastPacketTime] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState({
    name: 'No Hardware Connected',
    mac: 'None',
    network: 'Disconnected',
    ip: '13.50.151.133',
    uptime: 'Offline',
    firmware: 'v1.0.6'
  });
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Hardware Setup & Debugger Modal State
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideTab, setGuideTab] = useState('esp32');
  const [customMoistureInput, setCustomMoistureInput] = useState(65);
  const [customTempInput, setCustomTempInput] = useState(24.5);
  const [customPhInput, setCustomPhInput] = useState(6.8);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [customSuccessMsg, setCustomSuccessMsg] = useState('');

  // Active Metric for Trends Chart
  const [selectedMetric, setSelectedMetric] = useState('Moisture');
  const [trendSeries, setTrendSeries] = useState(null);

  const handleDiagnosticConfirm = () => {
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    currentData.sensors = {
      moisture: moisture ?? cachedData?.moisture ?? 42,
      temperature: temperature ?? cachedData?.temperature ?? 24.0,
      pH: phVal ?? cachedData?.pH ?? 6.8,
      nitrogen: nitrogen ?? cachedData?.nitrogen ?? 42,
      phosphorus: phosphorus ?? cachedData?.phosphorus ?? 28,
      potassium: potassium ?? cachedData?.potassium ?? 35,
      pump_state: pumpStatus,
      is_online: isOnline
    };
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));
    navigate('/image-upload');
  };

  const fetchDeviceData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch live IoT state & readings from backend
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setIsOnline(Boolean(data.isOnline));
          if (data.device) setDeviceInfo(prev => ({ ...prev, ...data.device }));
          
          if (data.lastPacketTime) {
            const pDate = new Date(data.lastPacketTime);
            setLastPacketTime(`${pDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}, ${pDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
          }

          if (data.cachedReadings) {
            setCachedData(data.cachedReadings);
          }

          if (data.readings) {
            setMoisture(data.readings.moisture);
            setTemperature(data.readings.temperature);
            setPhVal(data.readings.pH);
            setNitrogen(data.readings.nitrogen);
            setPhosphorus(data.readings.phosphorus);
            setPotassium(data.readings.potassium);
            setAirTemp(data.readings.airTemperature ?? 28.0);
            setHumidity(data.readings.humidity ?? 65);
            setLightIntensity(data.readings.lightIntensity ?? 850);
            setRainfall(data.readings.rainfall ?? 0);
          }

          if (data.state) {
            setIsAutoMode(data.state.isAutoMode ?? true);
            setPumpStatus(data.state.pumpIsOn ?? false);
          }

          const now = new Date();
          setLastSyncTime(`${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
        }
      }

      // 2. Fetch 24-hour trends from backend
      const trendRes = await fetch('/api/trend');
      if (trendRes.ok) {
        const trendData = await trendRes.json();
        if (trendData && typeof trendData === 'object') {
          setTrendSeries(trendData);
        }
      }
    } catch (err) {
      console.warn("Could not fetch state from IoT server:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  // Simulate an incoming IoT sensor packet
  const handleSimulatePacket = async () => {
    setIsSimulating(true);
    try {
      const randomMoisture = Math.floor(Math.random() * 25 + 35);
      await fetch('/api/sensor/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moisture: randomMoisture })
      });
      await fetchDeviceData();
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setTimeout(() => setIsSimulating(false), 500);
    }
  };

  // Send a custom test packet to /api/sensor
  const handleSendCustomPacket = async () => {
    setIsSubmittingCustom(true);
    setCustomSuccessMsg('');
    try {
      const payload = {
        moistureLevel: Number(customMoistureInput),
        temperature: Number(customTempInput),
        pH: Number(customPhInput),
        nitrogen: 45,
        phosphorus: 28,
        potassium: 34
      };
      const res = await fetch('/api/sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setCustomSuccessMsg(`Packet accepted! Soil Moisture set to ${customMoistureInput}%. Hardware status is now LIVE!`);
        await fetchDeviceData();
        setTimeout(() => setCustomSuccessMsg(''), 6000);
      }
    } catch (err) {
      console.error("Custom packet error:", err);
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  useEffect(() => {
    fetchDeviceData();
    const interval = setInterval(fetchDeviceData, 5000);
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

  // Fallback trend dataset if server hasn't sent 24h series yet
  // Values to display: either live reading, or if showHistorical, cached reading, else null
  const displayMoisture = isOnline ? moisture : (showHistorical ? cachedData?.moisture : null);
  const displayTemp = isOnline ? temperature : (showHistorical ? cachedData?.temperature : null);
  const displayPh = isOnline ? phVal : (showHistorical ? cachedData?.pH : null);
  const displayN = isOnline ? nitrogen : (showHistorical ? cachedData?.nitrogen : null);
  const displayP = isOnline ? phosphorus : (showHistorical ? cachedData?.phosphorus : null);
  const displayK = isOnline ? potassium : (showHistorical ? cachedData?.potassium : null);

  // Fallback trend dataset if server hasn't sent 24h series yet
  const defaultTrendSeries = {
    'Moisture': [
      { time: '12 AM', value: 38 },
      { time: '4 AM', value: 36 },
      { time: '8 AM', value: 44 },
      { time: '12 PM', value: 46 },
      { time: '4 PM', value: 43 },
      { time: '8 PM', value: displayMoisture ?? cachedData?.moisture ?? 42 },
      { time: '10 PM', value: displayMoisture ?? cachedData?.moisture ?? 42 },
      { time: '12 AM', value: displayMoisture ?? cachedData?.moisture ?? 42 }
    ],
    'Temperature': [
      { time: '12 AM', value: 19 },
      { time: '4 AM', value: 17 },
      { time: '8 AM', value: 21 },
      { time: '12 PM', value: 27 },
      { time: '4 PM', value: 25 },
      { time: '8 PM', value: displayTemp ?? cachedData?.temperature ?? 24 },
      { time: '12 AM', value: displayTemp ?? cachedData?.temperature ?? 24 }
    ],
    'pH': [
      { time: '12 AM', value: 6.7 },
      { time: '4 AM', value: 6.7 },
      { time: '8 AM', value: 6.8 },
      { time: '12 PM', value: 6.9 },
      { time: '4 PM', value: displayPh ?? cachedData?.pH ?? 6.8 },
      { time: '8 PM', value: displayPh ?? cachedData?.pH ?? 6.8 },
      { time: '12 AM', value: displayPh ?? cachedData?.pH ?? 6.8 }
    ],
    'Nitrogen (N)': [
      { time: '12 AM', value: 40 },
      { time: '4 AM', value: 40 },
      { time: '8 AM', value: 42 },
      { time: '12 PM', value: 43 },
      { time: '4 PM', value: displayN ?? cachedData?.nitrogen ?? 42 },
      { time: '8 PM', value: displayN ?? cachedData?.nitrogen ?? 42 },
      { time: '12 AM', value: displayN ?? cachedData?.nitrogen ?? 42 }
    ],
    'Phosphorus (P)': [
      { time: '12 AM', value: 27 },
      { time: '4 AM', value: 27 },
      { time: '8 AM', value: 28 },
      { time: '12 PM', value: 29 },
      { time: '4 PM', value: displayP ?? cachedData?.phosphorus ?? 28 },
      { time: '8 PM', value: displayP ?? cachedData?.phosphorus ?? 28 },
      { time: '12 AM', value: displayP ?? cachedData?.phosphorus ?? 28 }
    ],
    'Potassium (K)': [
      { time: '12 AM', value: 34 },
      { time: '4 AM', value: 34 },
      { time: '8 AM', value: 35 },
      { time: '12 PM', value: 36 },
      { time: '4 PM', value: displayK ?? cachedData?.potassium ?? 35 },
      { time: '8 PM', value: displayK ?? cachedData?.potassium ?? 35 },
      { time: '12 AM', value: displayK ?? cachedData?.potassium ?? 35 }
    ]
  };

  const activeSeries = (trendSeries && trendSeries[selectedMetric]) 
    ? trendSeries[selectedMetric] 
    : (defaultTrendSeries[selectedMetric] || defaultTrendSeries['Moisture']);

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

      {/* 2. Device Status Bar with Live vs Offline Hardware State */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-stone-200/70 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Status */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
          <span className={`w-3.5 h-3.5 rounded-full ${
            isOnline ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-100' : 'bg-rose-500 ring-4 ring-rose-100'
          }`}></span>
          <div>
            <div className={`flex items-center gap-1.5 font-bold text-xs ${
              isOnline ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              <span>{isOnline ? 'ESP Hardware Online (Live Streaming)' : 'No Hardware Connected (Offline)'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isOnline 
                ? `Live Telemetry (Sync: ${lastSyncTime})` 
                : (lastPacketTime ? `Last Packet: ${lastPacketTime}` : 'No hardware packet recorded')}
            </p>
          </div>
        </div>

        {/* Device Status */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <Cpu size={17} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Node Hardware</span>
            <h4 className="text-xs font-bold text-slate-800">{isOnline ? 'ESP32 / ESP8266 (Active)' : 'Disconnected (No Board)'}</h4>
            <p className="text-[10px] text-slate-400">{isOnline ? 'Telemetry frequency: 5s' : 'Waiting for hardware connection'}</p>
          </div>
        </div>

        {/* Network & Endpoint */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isOnline ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <Wifi size={17} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Cloud Server IP</span>
            <h4 className="text-xs font-bold text-slate-800">13.50.151.133</h4>
            <p className="text-[10px] text-slate-400">Port 80 (HTTP REST)</p>
          </div>
        </div>

        {/* Uptime / Stream Mode */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock size={17} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Channel Mode</span>
            <h4 className="text-xs font-bold text-slate-800">{isOnline ? 'Live Hardware Stream' : 'Standby / Offline'}</h4>
            <p className="text-[10px] text-slate-400">{isOnline ? 'MongoDB Atlas Persistent' : 'No incoming packets'}</p>
          </div>
        </div>

        {/* Action Buttons: Hardware Guide, Test Packet, Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm transition-all active:scale-95"
            title="Open ESP32 / ESP8266 Hardware Guide & Wi-Fi Setup"
          >
            <Terminal size={13} className="text-emerald-600" />
            <span>Hardware Code</span>
          </button>

          <button
            onClick={fetchDeviceData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#EBF4FF] hover:bg-[#DDEBFF] text-[#2B7FFF] border border-blue-200/60 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

      </div>

      {/* Offline Alert Banner (Displays when physical device is not sending data) */}
      {!isOnline && (
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <WifiOff size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  No Hardware Device Connected — Live Telemetry Is Offline
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 rounded-full">
                  Offline
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Aapne abhi koi physical hardware connect nahi kiya hai, isliye sensor readings <strong>"--" (No Signal)</strong> dikhayi de rahi hain. Apna ESP32 / ESP8266 board connect karte hi yahan real-time live data shuru ho jayega.
              </p>
              {lastPacketTime && (
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  ⏱ Last saved session in database: <span className="font-bold">{lastPacketTime}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            {cachedData && (
              <button
                onClick={() => setShowHistorical(!showHistorical)}
                className="flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-stone-100 text-slate-700 border border-stone-300 shadow-2xs transition-all"
              >
                {showHistorical ? "Hide Stored Data" : "View Last Stored Telemetry"}
              </button>
            )}
            <button
              onClick={() => setShowGuideModal(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all active:scale-95"
            >
              <Terminal size={14} />
              <span>Connect Device (Code)</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Live Sensor Readings (6 Cards Row) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <Sprout size={14} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {isOnline ? 'Live Soil Sensor Readings' : (showHistorical ? 'Stored Soil Telemetry (Historical)' : 'Live Soil Sensor Feed')}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              {isOnline ? `Auto-refresh: 5s` : (showHistorical ? `Recorded: ${lastPacketTime}` : `Hardware Inactive`)}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isOnline 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : showHistorical
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : (showHistorical ? 'bg-amber-500' : 'bg-rose-500')
              }`}></span>
              {isOnline ? 'Live Hardware Stream' : (showHistorical ? 'Stored Telemetry' : 'Hardware Disconnected')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          {/* 1. Moisture */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                displayMoisture !== null ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'
              }`}>
                <Droplets size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Soil Moisture</span>
            </div>
            <div>
              <div className={`text-2xl font-black ${displayMoisture !== null ? 'text-slate-900' : 'text-slate-300'}`}>
                {displayMoisture !== null ? `${displayMoisture}%` : '-- %'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : showHistorical
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {isOnline ? 'Optimal' : (showHistorical ? 'Saved Data' : 'Offline')}
                </span>
                <span className="text-[10px] text-slate-400">Range: 20 - 60%</span>
              </div>
            </div>
          </div>

          {/* 2. Temperature */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                displayTemp !== null ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'
              }`}>
                <Thermometer size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Soil Temperature</span>
            </div>
            <div>
              <div className={`text-2xl font-black ${displayTemp !== null ? 'text-slate-900' : 'text-slate-300'}`}>
                {displayTemp !== null ? `${displayTemp}°C` : '-- °C'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : showHistorical
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {isOnline ? 'Normal' : (showHistorical ? 'Saved Data' : 'Offline')}
                </span>
                <span className="text-[10px] text-slate-400">Range: 10 - 35°C</span>
              </div>
            </div>
          </div>

          {/* 3. pH */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                displayPh !== null ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <FlaskConical size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Soil pH</span>
            </div>
            <div>
              <div className={`text-2xl font-black ${displayPh !== null ? 'text-slate-900' : 'text-slate-300'}`}>
                {displayPh !== null ? displayPh : '--'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : showHistorical
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {isOnline ? 'Good' : (showHistorical ? 'Saved Data' : 'Offline')}
                </span>
                <span className="text-[10px] text-slate-400">Range: 6.0 - 7.5</span>
              </div>
            </div>
          </div>

          {/* 4. Nitrogen (N) */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                displayN !== null ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <Sprout size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Nitrogen (N)</span>
            </div>
            <div>
              <div className={`text-2xl font-black ${displayN !== null ? 'text-slate-900' : 'text-slate-300'}`}>
                {displayN !== null ? `${displayN} kg/ha` : '-- kg/ha'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : showHistorical
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {isOnline ? 'Optimal' : (showHistorical ? 'Saved Data' : 'Offline')}
                </span>
                <span className="text-[10px] text-slate-400">Range: 20 - 60</span>
              </div>
            </div>
          </div>

          {/* 5. Phosphorus (P) */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                displayP !== null ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <Sprout size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Phosphorus (P)</span>
            </div>
            <div>
              <div className={`text-2xl font-black ${displayP !== null ? 'text-slate-900' : 'text-slate-300'}`}>
                {displayP !== null ? `${displayP} kg/ha` : '-- kg/ha'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : showHistorical
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {isOnline ? 'Optimal' : (showHistorical ? 'Saved Data' : 'Offline')}
                </span>
                <span className="text-[10px] text-slate-400">Range: 15 - 40</span>
              </div>
            </div>
          </div>

          {/* 6. Potassium (K) */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                displayK !== null ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <Layers size={17} />
              </div>
              <span className="text-xs font-bold text-slate-600">Potassium (K)</span>
            </div>
            <div>
              <div className={`text-2xl font-black ${displayK !== null ? 'text-slate-900' : 'text-slate-300'}`}>
                {displayK !== null ? `${displayK} kg/ha` : '-- kg/ha'}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : showHistorical
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {isOnline ? 'Optimal' : (showHistorical ? 'Saved Data' : 'Offline')}
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
                <AreaChart data={activeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <div className="text-sm font-bold text-slate-800">{airTemp}°C</div>
                  <span className="text-[9px] text-slate-400">Partly Cloudy</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Droplets size={18} className="text-blue-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Humidity</div>
                  <div className="text-sm font-bold text-slate-800">{humidity}%</div>
                  <span className="text-[9px] font-bold text-emerald-600">Normal</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Sun size={18} className="text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Light Intensity</div>
                  <div className="text-sm font-bold text-slate-800">{lightIntensity} lux</div>
                  <span className="text-[9px] font-bold text-emerald-600">Good</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <CloudRain size={18} className="text-blue-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400">Rainfall (Today)</div>
                  <div className="text-sm font-bold text-slate-800">{rainfall} mm</div>
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

      {/* Hardware Connection & Live Debugger Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Hardware Connection Guide & Live Debugger
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Connect your physical ESP32 or ESP8266 to AWS EC2 Cloud (<code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">13.50.151.133</code>)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="w-9 h-9 rounded-xl hover:bg-stone-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-stone-200 px-6 bg-white overflow-x-auto">
              <button
                onClick={() => setGuideTab('esp32')}
                className={`py-3 px-4 font-bold text-xs border-b-2 transition-all whitespace-nowrap ${
                  guideTab === 'esp32'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ESP32 Arduino Code (WiFi.h)
              </button>
              <button
                onClick={() => setGuideTab('esp8266')}
                className={`py-3 px-4 font-bold text-xs border-b-2 transition-all whitespace-nowrap ${
                  guideTab === 'esp8266'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ESP8266 Arduino Code (ESP8266WiFi.h)
              </button>
              <button
                onClick={() => setGuideTab('tester')}
                className={`py-3 px-4 font-bold text-xs border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  guideTab === 'tester'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders size={13} />
                <span>Live Packet Simulator</span>
              </button>
              <button
                onClick={() => setGuideTab('serial')}
                className={`py-3 px-4 font-bold text-xs border-b-2 transition-all whitespace-nowrap ${
                  guideTab === 'serial'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Troubleshooting Checklist
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 text-xs">
              
              {/* TAB 1: ESP32 Code */}
              {guideTab === 'esp32' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-900 leading-relaxed">
                    <p className="font-bold">Instructions for ESP32 (NodeMCU-32S / ESP-WROOM-32):</p>
                    <ol className="list-decimal list-inside mt-1.5 space-y-1 text-[11px] text-emerald-800">
                      <li>Copy the code below into <strong>Arduino IDE</strong>.</li>
                      <li>Replace <code className="bg-white px-1 py-0.5 rounded font-mono">YOUR_WIFI_NAME</code> and <code className="bg-white px-1 py-0.5 rounded font-mono">YOUR_WIFI_PASSWORD</code> with your mobile hotspot credentials.</li>
                      <li>Ensure your phone hotspot is set to <strong>2.4 GHz</strong> band.</li>
                      <li>Select your ESP32 board in Arduino IDE and click <strong>Upload</strong>.</li>
                    </ol>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => handleCopyCode(`#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_NAME";        // Phone Hotspot Name
const char* password = "YOUR_WIFI_PASSWORD"; // Hotspot Password
const char* serverUrl = "http://13.50.151.133/api/sensor";

const int MOISTURE_PIN = 34; // Connect Analog Moisture pin to GPIO 34
const int RELAY_PIN = 26;    // Relay pin for Water Pump

unsigned long previousMillis = 0;
const long interval = 5000;   // Send telemetry every 5 seconds

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\n[CONNECTED] IP: " + WiFi.localIP().toString());
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    if (WiFi.status() == WL_CONNECTED) {
      int rawAdc = analogRead(MOISTURE_PIN);
      // Calibration (adjust for your sensor: ~3500 dry air, ~1300 in water)
      int moisture = map(rawAdc, 3500, 1300, 0, 100);
      moisture = constrain(moisture, 0, 100);

      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      String payload = "{\\"moistureLevel\\":" + String(moisture) + 
                       ",\\"temperature\\":24.5,\\"pH\\":6.8,\\"nitrogen\\":45,\\"phosphorus\\":28,\\"potassium\\":34}";

      int httpResponseCode = http.POST(payload);
      Serial.print("[HTTP] Response code: ");
      Serial.println(httpResponseCode);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("[HTTP] Server Response: " + response);
      }
      http.end();
    }
  }
}`)}
                      className="absolute right-3 top-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                    >
                      {copySuccess ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copySuccess ? 'Copied!' : 'Copy Code'}</span>
                    </button>

                    <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_NAME";        // Phone Hotspot Name
const char* password = "YOUR_WIFI_PASSWORD"; // Hotspot Password
const char* serverUrl = "http://13.50.151.133/api/sensor";

const int MOISTURE_PIN = 34; // Connect Analog Moisture pin to GPIO 34
const int RELAY_PIN = 26;    // Relay pin for Water Pump

unsigned long previousMillis = 0;
const long interval = 5000;   // Send telemetry every 5 seconds

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\n[CONNECTED] IP: " + WiFi.localIP().toString());
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    if (WiFi.status() == WL_CONNECTED) {
      int rawAdc = analogRead(MOISTURE_PIN);
      // Calibration (adjust for your sensor: ~3500 dry air, ~1300 in water)
      int moisture = map(rawAdc, 3500, 1300, 0, 100);
      moisture = constrain(moisture, 0, 100);

      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      String payload = "{\\"moistureLevel\\":" + String(moisture) + 
                       ",\\"temperature\\":24.5,\\"pH\\":6.8,\\"nitrogen\\":45,\\"phosphorus\\":28,\\"potassium\\":34}";

      int httpResponseCode = http.POST(payload);
      Serial.print("[HTTP] Response code: ");
      Serial.println(httpResponseCode);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("[HTTP] Server Response: " + response);
      }
      http.end();
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 2: ESP8266 Code */}
              {guideTab === 'esp8266' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
                    <p className="font-bold">Instructions for ESP8266 (NodeMCU / Wemos D1 Mini):</p>
                    <ol className="list-decimal list-inside mt-1.5 space-y-1 text-[11px] text-blue-800">
                      <li>Copy the sketch below into <strong>Arduino IDE</strong>.</li>
                      <li>Set your Wi-Fi SSID and Password.</li>
                      <li>Pin A0 reads the analog moisture value (0-1023).</li>
                      <li>Target EC2 server: <code className="bg-white px-1 py-0.5 rounded font-mono">http://13.50.151.133/api/sensor</code>.</li>
                    </ol>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => handleCopyCode(`#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverName = "http://13.50.151.133/api/sensor";

const int MOISTURE_PIN = A0;  // Analog pin A0
const int RELAY_PIN = D1;     // Relay pin D1

unsigned long previousMillis = 0;
const long interval = 5000;   // 5 seconds

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConnected with IP: " + WiFi.localIP().toString());
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    if (WiFi.status() == WL_CONNECTED) {
      int sensorValue = analogRead(MOISTURE_PIN);
      int moisture = map(sensorValue, 1023, 300, 0, 100);
      moisture = constrain(moisture, 0, 100);

      WiFiClient client;
      HTTPClient http;
      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");

      String payload = "{\\"moistureLevel\\":" + String(moisture) + 
                       ",\\"temperature\\":24.0,\\"pH\\":6.8,\\"nitrogen\\":42,\\"phosphorus\\":28,\\"potassium\\":35}";

      int httpResponseCode = http.POST(payload);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Server Response: " + response);
      }
      http.end();
    }
  }
}`)}
                      className="absolute right-3 top-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                    >
                      {copySuccess ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copySuccess ? 'Copied!' : 'Copy Code'}</span>
                    </button>

                    <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverName = "http://13.50.151.133/api/sensor";

const int MOISTURE_PIN = A0;  // Analog pin A0
const int RELAY_PIN = D1;     // Relay pin D1

unsigned long previousMillis = 0;
const long interval = 5000;   // 5 seconds

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConnected with IP: " + WiFi.localIP().toString());
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    if (WiFi.status() == WL_CONNECTED) {
      int sensorValue = analogRead(MOISTURE_PIN);
      int moisture = map(sensorValue, 1023, 300, 0, 100);
      moisture = constrain(moisture, 0, 100);

      WiFiClient client;
      HTTPClient http;
      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");

      String payload = "{\\"moistureLevel\\":" + String(moisture) + 
                       ",\\"temperature\\":24.0,\\"pH\\":6.8,\\"nitrogen\\":42,\\"phosphorus\\":28,\\"potassium\\":35}";

      int httpResponseCode = http.POST(payload);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Server Response: " + response);
      }
      http.end();
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: Live Packet Simulator */}
              {guideTab === 'tester' && (
                <div className="space-y-5 p-2">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <h4 className="font-bold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                      <Zap size={16} className="text-amber-600" />
                      <span>Live Telemetry Packet Injector</span>
                    </h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      You can send an exact simulated packet directly to <code className="font-mono bg-white px-1 py-0.5 rounded">http://13.50.151.133/api/sensor</code> right from here. This will immediately update MongoDB and turn your status indicator to 🟢 <strong>Live Hardware Stream</strong> on the dashboard.
                    </p>
                  </div>

                  {customSuccessMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>{customSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Moisture Slider */}
                    <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="text-slate-700">Soil Moisture Level</span>
                        <span className="text-base text-blue-600 font-black">{customMoistureInput}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={customMoistureInput}
                        onChange={(e) => setCustomMoistureInput(e.target.value)}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>0% (Bone Dry)</span>
                        <span>50% (Optimal)</span>
                        <span>100% (Saturated)</span>
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                      <span className="block font-bold text-xs text-slate-700">Quick Test Presets</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Dry (22%)', val: 22 },
                          { label: 'Optimal (55%)', val: 55 },
                          { label: 'Wet (85%)', val: 85 }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCustomMoistureInput(preset.val);
                              handleSendCustomPacket();
                            }}
                            className="px-2.5 py-2 rounded-lg bg-white hover:bg-stone-100 text-slate-700 font-bold text-[11px] border border-stone-200 shadow-2xs transition-all active:scale-95"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  <button
                    onClick={handleSendCustomPacket}
                    disabled={isSubmittingCustom}
                    className="w-full py-3 rounded-xl bg-[#E8592A] hover:bg-[#D44A1E] text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{isSubmittingCustom ? "Transmitting to AWS EC2..." : `Transmit Custom Telemetry Packet (${customMoistureInput}% Moisture)`}</span>
                  </button>
                </div>
              )}

              {/* TAB 4: Troubleshooting */}
              {guideTab === 'serial' && (
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm">Step-by-Step Serial Monitor Debugging</h4>
                    
                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                        <p><strong>Hotspot 2.4 GHz Band:</strong> Open phone hotspot settings $\to$ ensure band is <strong>2.4 GHz</strong> (ESP boards cannot connect to 5 GHz Wi-Fi).</p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                        <p><strong>SSID & Password Match:</strong> Check that <code className="bg-white px-1 py-0.5 rounded font-mono">ssid</code> and <code className="bg-white px-1 py-0.5 rounded font-mono">password</code> in your code match your phone hotspot exactly with correct case.</p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                        <p><strong>Baud Rate:</strong> In Arduino IDE, open <strong>Tools &gt; Serial Monitor</strong> and change the dropdown at bottom right to <strong>115200 baud</strong>.</p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                        <p><strong>Expected Output:</strong> The Serial Monitor should print <code className="bg-white px-1 py-0.5 rounded font-mono">Connected with IP: 192.168.x.x</code> followed by <code className="bg-white px-1 py-0.5 rounded font-mono text-emerald-700">HTTP Response code: 200</code>.</p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">5</span>
                        <p><strong>Common Error Codes:</strong> If Serial Monitor shows <code className="font-mono text-red-600">-1</code>, the ESP is not connected to internet or cannot ping AWS. If it shows <code className="font-mono text-red-600">400</code>, JSON payload key is wrong.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                AWS EC2 Server Endpoint: <code className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded border border-stone-200">http://13.50.151.133/api/sensor</code>
              </span>
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
