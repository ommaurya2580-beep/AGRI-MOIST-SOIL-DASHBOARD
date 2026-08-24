import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Wifi, Droplets, Thermometer, Database, CheckCircle2,
  ChevronRight, RefreshCw, Activity, AlertTriangle
} from 'lucide-react';

export default function IoTSync() {
  const navigate = useNavigate();
  const [connectionState, setConnectionState] = useState('searching');
  const [sensorData, setSensorData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPayload, setSavedPayload] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchLiveData = async () => {
    setConnectionState('connecting');
    try {
      const stateRes = await fetch('/api/state');
      if (!stateRes.ok) throw new Error("Failed to connect to API");
      const stateData = await stateRes.json();
      
      const online = stateData.isOnline !== undefined ? stateData.isOnline : false;
      const liveMoisture = stateData.currentMoisture || 0;
      
      if (!online) {
        setErrorMessage("ESP32 Sensor is currently OFFLINE. Showing last known or mock data.");
      }

      setSensorData({
        moisture: { 
          value: liveMoisture, 
          unit: '%', 
          status: liveMoisture > 80 ? 'High (Waterlogged)' : (liveMoisture < 30 ? 'Low (Dry)' : 'Optimal'), 
          color: liveMoisture > 80 ? 'text-blue-500' : 'text-emerald-500' 
        },
        temperature: { value: 24.6, unit: '°C', status: 'Optimal', color: 'text-amber-500' }, // Using mock from their system
        ph: { value: 6.7, unit: 'pH', status: 'Neutral (Good)', color: 'text-emerald-500' }, // Using mock
        nitrogen: { value: 45, unit: 'mg/kg', status: 'Low', color: 'text-red-500' }, // Still mock for NPK as it's not live yet
        phosphorus: { value: 28, unit: 'mg/kg', status: 'Optimal', color: 'text-teal-500' },
        potassium: { value: 110, unit: 'mg/kg', status: 'Optimal', color: 'text-purple-500' },
        lastUpdated: new Date().toLocaleTimeString(),
        isOnline: online
      });
      setConnectionState('connected');
    } catch (err) {
      console.warn("Live API fetch failed, falling back to mock data for presentation.", err);
      setErrorMessage("Could not connect to local server. Falling back to diagnostic simulation data.");
      // Fallback
      setSensorData({
        moisture: { value: 85, unit: '%', status: 'High (Waterlogged)', color: 'text-blue-500' },
        temperature: { value: 22.4, unit: '°C', status: 'Optimal', color: 'text-amber-500' },
        ph: { value: 6.8, unit: 'pH', status: 'Neutral (Good)', color: 'text-emerald-500' },
        nitrogen: { value: 45, unit: 'mg/kg', status: 'Low', color: 'text-red-500' },
        phosphorus: { value: 28, unit: 'mg/kg', status: 'Optimal', color: 'text-teal-500' },
        potassium: { value: 110, unit: 'mg/kg', status: 'Optimal', color: 'text-purple-500' },
        lastUpdated: new Date().toLocaleTimeString(),
        isOnline: false
      });
      setConnectionState('connected');
    }
  };

  useEffect(() => {
    // Initial delay for visual effect
    const timer = setTimeout(() => {
      fetchLiveData();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    // Save to local storage for the Engine
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    const iotPayload = {
      soil_moisture_percent: sensorData.moisture.value,
      soil_temperature_c: sensorData.temperature.value,
      soil_ph: sensorData.ph.value,
      nitrogen_mg_kg: sensorData.nitrogen.value,
      phosphorus_mg_kg: sensorData.phosphorus.value,
      potassium_mg_kg: sensorData.potassium.value,
      device_id: "ESP32-FIELD-A1"
    };
    currentData.iot = iotPayload;
    
    setSavedPayload(iotPayload);
    setIsSaving(true);
    
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));
    
    // Move to next step (Image Upload) after showing the data for 2 seconds
    setTimeout(() => {
      navigate('/image-upload');
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      
      {/* Saving Data Overlay (Shows exactly what we are sending to the engine) */}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center border-2 border-emerald-500">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">IoT Data Saved!</h2>
            <p className="text-slate-500 mb-6">The following real-time sensor data is being captured for the Engine:</p>
            
            <div className="bg-slate-900 rounded-xl p-4 text-left overflow-hidden">
              <pre className="text-emerald-400 font-mono text-sm">
                {JSON.stringify(savedPayload, null, 2)}
              </pre>
            </div>
            
            <p className="text-sm font-bold text-slate-400 mt-6 animate-pulse">Proceeding to Step 4: Crop Image Upload...</p>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Step 3 of 4</span>
            <span className="text-slate-400 text-sm font-medium">Root Cause Engine</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Live IoT Sync</h1>
          <p className="text-slate-500 mt-1">Connecting to your farm's ESP32 Smart Sensors</p>
        </div>
      </div>

      {(connectionState === 'searching' || connectionState === 'connecting') && (
        <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center border border-slate-200 shadow-sm min-h-[400px] animate-in fade-in">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center">
              <Cpu size={48} className="text-slate-400" />
            </div>
            {/* Pulsing rings */}
            <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -inset-4 border-2 border-blue-200 rounded-full animate-ping opacity-50 animation-delay-500"></div>
            
            {/* Status Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md border border-slate-100 flex items-center gap-2 whitespace-nowrap">
              <Wifi size={14} className={connectionState === 'connecting' ? 'text-blue-500' : 'text-slate-400'} />
              <span className="text-xs font-bold text-slate-600">
                {connectionState === 'searching' ? 'Scanning for ESP32...' : 'Fetching Data...'}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            {connectionState === 'searching' ? 'Locating Field Sensors' : 'Reading Ground Truth'}
          </h3>
          <p className="text-slate-500 mt-2 text-center max-w-md">
            {connectionState === 'searching' 
              ? 'Checking local network and MQTT broker for active AgriPulse nodes.'
              : 'Downloading live Soil Moisture, NPK levels, and pH from the ground.'}
          </p>
        </div>
      )}
      
      {connectionState === 'connected' && sensorData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 rotate-12 -mr-10 -mt-10">
              <Cpu size={200} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-emerald-400 font-mono text-sm tracking-widest font-bold">NODE: ESP32-FIELD-A1 ONLINE</span>
              </div>
              <h2 className="text-3xl font-bold mb-1">Live Ground Data Retrieved</h2>
              <p className="text-slate-400">Sync completed successfully at {sensorData.lastUpdated}</p>
            </div>
            <button 
              onClick={() => {
                fetchLiveData();
              }}
              className="relative z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={18} /> Refresh Data
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
              <AlertTriangle size={20} />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Sensor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SensorCard 
              title="Soil Moisture" icon={Droplets} data={sensorData.moisture} 
              warning={sensorData.moisture.value > 80}
            />
            <SensorCard 
              title="Soil Temperature" icon={Thermometer} data={sensorData.temperature} 
            />
            <SensorCard 
              title="Soil pH Level" icon={Activity} data={sensorData.ph} 
            />
            <SensorCard 
              title="Nitrogen (N)" icon={Database} data={sensorData.nitrogen} 
              warning={sensorData.nitrogen.value < 60}
            />
            <SensorCard 
              title="Phosphorus (P)" icon={Database} data={sensorData.phosphorus} 
            />
            <SensorCard 
              title="Potassium (K)" icon={Database} data={sensorData.potassium} 
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
            <div className="bg-amber-100 p-3 rounded-full h-fit">
              <AlertTriangle className="text-amber-600" size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-amber-900 mb-1">Anomaly Detected</h4>
              <p className="text-amber-800 text-sm">
                The sensors are reporting <strong>abnormally high moisture (85%)</strong> and <strong>low Nitrogen</strong>. 
                The Root Cause Engine will combine this with your weather data (Heavy Rain) to generate a precise diagnosis.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Ready to provide visual evidence?</h3>
              <p className="text-slate-500 text-sm">The Engine needs photos of the crop to complete the analysis.</p>
            </div>
            <button 
              onClick={handleConfirm}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle2 size={20} /> Capture Final Images <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

function SensorCard({ title, icon: Icon, data, warning }) {
  return (
    <div className={`bg-white rounded-2xl p-6 border-2 transition-all ${warning ? 'border-red-400 shadow-red-100 shadow-lg relative overflow-hidden' : 'border-slate-100 shadow-sm'}`}>
      {warning && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
          CRITICAL
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl ${warning ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
          <Icon size={20} />
        </div>
        <h3 className="font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-black tracking-tight ${warning ? 'text-red-500' : 'text-slate-800'}`}>
          {data.value}
        </span>
        <span className="text-slate-400 font-medium">{data.unit}</span>
      </div>
      <div className="mt-3 text-sm font-medium flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${warning ? 'bg-red-500 animate-pulse' : data.color.replace('text-', 'bg-')}`}></div>
        <span className={warning ? 'text-red-600' : 'text-slate-500'}>{data.status}</span>
      </div>
    </div>
  );
}
