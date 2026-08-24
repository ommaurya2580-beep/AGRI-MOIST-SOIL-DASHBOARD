import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudRain, Wind, Thermometer, Droplets, Sun, 
  Eye, Gauge, Cloud, Activity, CheckCircle2, ChevronRight,
  MapPin, Search, Navigation
} from 'lucide-react';

export default function WeatherSync() {
  const navigate = useNavigate();
  const [step, setStep] = useState('location'); // location -> syncing -> results
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState("");
  
  const startWeatherFetch = (loc) => {
    setStep('syncing');
    
    // Simulate API fetch for 30 days of weather data based on location
    setTimeout(() => {
      setWeatherData({
        location: loc,
        summary: "Heavy Rainfall in the past 15 days. High humidity.",
        metrics: {
          rain: "124 mm",
          temp: "24°C Avg",
          maxToday: "28°C",
          wind: "14 km/h",
          humidity: "88%",
          uvIndex: "6 (Moderate)",
          airQuality: "Good (42 AQI)",
          pressure: "1012 hPa",
          visibility: "8 km",
          dewPoint: "21°C",
          cloudCover: "75%"
        }
      });
      setStep('results');
    }, 2500);
  };

  const handleManualLocation = (e) => {
    e.preventDefault();
    if (locationName.trim()) {
      startWeatherFetch(locationName);
    }
  };

  const handleAutoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, reverse geocode coords to name
          startWeatherFetch(`Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`);
        },
        (error) => {
          alert("Location permission denied. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleConfirm = () => {
    // Save to local storage for the Engine
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    currentData.weather = weatherData;
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));
    
    // Move to next step (IoT Sync)
    navigate('/iot-sync');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Step 2 of 4</span>
            <span className="text-slate-400 text-sm font-medium">Root Cause Engine</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Live Weather Sync</h1>
          <p className="text-slate-500 mt-1">Fetching your farm's 30-day meteorological history</p>
        </div>
      </div>

      {step === 'location' && (
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Where is your farm located?</h2>
            <p className="text-slate-500 mt-2">We need your location to fetch the highly accurate 30-day weather history for your specific area.</p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleAutoLocation}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold transition-all shadow-md shadow-blue-600/20"
            >
              <Navigation size={20} /> Use My Current Location (GPS)
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OR ENTER MANUALLY</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleManualLocation} className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter Village, City, or Pincode..." 
                className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'syncing' && (
        <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center border border-slate-200 shadow-sm min-h-[400px]">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <CloudRain className="absolute inset-0 m-auto text-blue-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700">Syncing with Satellites...</h3>
          <p className="text-slate-400 mt-2">Retrieving 30 days of precipitation and temperature data</p>
        </div>
      )}
      
      {step === 'results' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <CloudRain size={120} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 text-blue-200 mb-2 font-medium">
                 <MapPin size={16} /> {weatherData.location}
               </div>
               <h2 className="text-xl font-medium text-blue-100 mb-1">30-Day Automated Summary</h2>
               <p className="text-3xl font-bold max-w-2xl leading-tight">
                 "{weatherData.summary}"
               </p>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <MetricCard icon={CloudRain} label="Total Rainfall" value={weatherData.metrics.rain} color="text-blue-500" bg="bg-blue-50" />
            <MetricCard icon={Thermometer} label="Avg Temperature" value={weatherData.metrics.temp} color="text-amber-500" bg="bg-amber-50" />
            <MetricCard icon={Thermometer} label="Max Temp (Today)" value={weatherData.metrics.maxToday} color="text-red-500" bg="bg-red-50" />
            <MetricCard icon={Droplets} label="Humidity" value={weatherData.metrics.humidity} color="text-teal-500" bg="bg-teal-50" />
            <MetricCard icon={Wind} label="Wind Speed" value={weatherData.metrics.wind} color="text-slate-500" bg="bg-slate-100" />
            <MetricCard icon={Sun} label="UV Index" value={weatherData.metrics.uvIndex} color="text-orange-500" bg="bg-orange-50" />
            <MetricCard icon={Cloud} label="Cloud Cover" value={weatherData.metrics.cloudCover} color="text-indigo-500" bg="bg-indigo-50" />
            <MetricCard icon={Activity} label="Air Quality" value={weatherData.metrics.airQuality} color="text-emerald-500" bg="bg-emerald-50" />
            <MetricCard icon={Gauge} label="Pressure" value={weatherData.metrics.pressure} color="text-purple-500" bg="bg-purple-50" />
            <MetricCard icon={Eye} label="Visibility" value={weatherData.metrics.visibility} color="text-cyan-500" bg="bg-cyan-50" />
            <MetricCard icon={Droplets} label="Dew Point" value={weatherData.metrics.dewPoint} color="text-sky-500" bg="bg-sky-50" />
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Does this weather data look correct to you?</h3>
              <p className="text-slate-500 text-sm">We use this to analyze root causes like waterlogging or heat stress.</p>
            </div>
            <button 
              onClick={handleConfirm}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30"
            >
              <CheckCircle2 size={20} /> Yes, Confirm & Continue <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
