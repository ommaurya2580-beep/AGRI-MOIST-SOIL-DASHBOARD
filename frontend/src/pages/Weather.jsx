import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  MapPin, 
  Crosshair, 
  Clock, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  LocateFixed,
  Building2,
  X,
  Lightbulb,
  Sprout
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';

// ==========================================
// 1. 30-DAY WEATHER TREND DATA (Matches Mockup)
// ==========================================
const TEMP_TREND_DATA = [
  { date: 'Sep 11', max: 32.4, avg: 26.2, min: 17.5 },
  { date: 'Sep 13', max: 30.1, avg: 25.1, min: 16.8 },
  { date: 'Sep 15', max: 34.0, avg: 27.5, min: 18.2 },
  { date: 'Sep 17', max: 33.2, avg: 26.8, min: 17.9 },
  { date: 'Sep 19', max: 35.1, avg: 28.2, min: 19.1 },
  { date: 'Sep 21', max: 34.6, avg: 27.4, min: 18.5 },
  { date: 'Sep 23', max: 32.8, avg: 26.0, min: 16.9 },
  { date: 'Sep 25', max: 33.5, avg: 26.9, min: 17.8 },
  { date: 'Sep 27', max: 31.2, avg: 25.4, min: 16.4 },
  { date: 'Sep 29', max: 33.8, avg: 27.1, min: 18.0 },
  { date: 'Oct 01', max: 34.2, avg: 27.6, min: 18.4 },
  { date: 'Oct 03', max: 35.0, avg: 28.0, min: 18.9 },
  { date: 'Oct 05', max: 36.5, avg: 29.1, min: 19.5 },
  { date: 'Oct 07', max: 34.8, avg: 27.8, min: 18.2 },
  { date: 'Oct 09', max: 32.1, avg: 26.3, min: 17.1 },
];

const RAINFALL_DATA = [
  { date: 'Sep 11', rain: 0 },
  { date: 'Sep 13', rain: 5.2 },
  { date: 'Sep 15', rain: 0 },
  { date: 'Sep 16', rain: 18.4 },
  { date: 'Sep 19', rain: 0 },
  { date: 'Sep 20', rain: 3.8 },
  { date: 'Sep 23', rain: 11.5 },
  { date: 'Sep 27', rain: 0 },
  { date: 'Oct 01', rain: 5.1 },
  { date: 'Oct 05', rain: 6.8 },
  { date: 'Oct 09', rain: 0 },
];

// Available Locations for Modal
const FARM_LOCATIONS = [
  {
    name: 'Greater Noida, Uttar Pradesh, India',
    district: 'Gautam Buddha Nagar',
    coords: '28.4744° N, 77.5040° E',
    lat: 28.4744,
    lng: 77.5040,
    area: '2.5 Acre',
    field: 'Main Field - Wheat',
    tempAvg: '26.8°C',
    tempMax: '36.5°C',
    tempMin: '18.2°C',
    rainTotal: '42 mm',
    rainyDays: '6 Days',
    humidity: '68%',
    humidityMax: '92%',
    humidityMin: '35%',
    wind: '12.4 km/h'
  },
  {
    name: 'Ludhiana, Punjab, India',
    district: 'Ludhiana',
    coords: '30.9010° N, 75.8573° E',
    lat: 30.9010,
    lng: 75.8573,
    area: '4.0 Acre',
    field: 'Sector B - Wheat',
    tempAvg: '24.2°C',
    tempMax: '33.1°C',
    tempMin: '16.5°C',
    rainTotal: '38 mm',
    rainyDays: '5 Days',
    humidity: '62%',
    humidityMax: '88%',
    humidityMin: '30%',
    wind: '14.1 km/h'
  },
  {
    name: 'Karnal, Haryana, India',
    district: 'Karnal',
    coords: '29.6857° N, 76.9905° E',
    lat: 29.6857,
    lng: 76.9905,
    area: '3.2 Acre',
    field: 'North Field - Wheat',
    tempAvg: '25.5°C',
    tempMax: '34.8°C',
    tempMin: '17.0°C',
    rainTotal: '40 mm',
    rainyDays: '5 Days',
    humidity: '65%',
    humidityMax: '90%',
    humidityMin: '32%',
    wind: '11.8 km/h'
  },
  {
    name: 'Meerut, Uttar Pradesh, India',
    district: 'Meerut',
    coords: '28.9845° N, 77.7064° E',
    lat: 28.9845,
    lng: 77.7064,
    area: '2.8 Acre',
    field: 'Plot 3 - Wheat',
    tempAvg: '26.1°C',
    tempMax: '35.4°C',
    tempMin: '17.8°C',
    rainTotal: '45 mm',
    rainyDays: '7 Days',
    humidity: '70%',
    humidityMax: '93%',
    humidityMin: '38%',
    wind: '10.5 km/h'
  }
];

export default function Weather({ isDiagnosticMode = false }) {
  const navigate = useNavigate();

  // Location State
  const [currentLocation, setCurrentLocation] = useState(FARM_LOCATIONS[0]);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Map Zoom State
  const [mapZoom, setMapZoom] = useState(1);

  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleRecenter = () => setMapZoom(1);

  // Save Weather to Diagnostics and proceed
  const handleContinue = () => {
    const weatherData = {
      location: currentLocation.name,
      district: currentLocation.district,
      coords: currentLocation.coords,
      temp_avg: parseFloat(currentLocation.tempAvg),
      rain_sum: parseFloat(currentLocation.rainTotal),
      humidity_avg: parseFloat(currentLocation.humidity),
      wind_avg: parseFloat(currentLocation.wind),
      metrics: {
        temp: currentLocation.tempAvg,
        maxTemp: currentLocation.tempMax,
        minTemp: currentLocation.tempMin,
        rain: currentLocation.rainTotal,
        rainyDays: currentLocation.rainyDays,
        humidity: currentLocation.humidity,
        wind: currentLocation.wind
      },
      raw_metrics: {
        temp: currentLocation.tempAvg,
        rain: currentLocation.rainTotal,
        humidity: currentLocation.humidity,
        wind: currentLocation.wind
      }
    };

    // Store in localStorage for Root Cause Engine
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    currentData.weather = weatherData;
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));

    // Move to next step in diagnostic pipeline (Sensors IoT)
    navigate('/iot-sync');
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans">
      
      {/* ======================================================== */}
      {/* TOP STEPPER INDICATOR (Matches Image Exactly)            */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 pt-1">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          
          {/* Step 1: Crop Selection (Completed) */}
          <button 
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#10B981] text-white shadow-sm">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-700 group-hover:text-emerald-700">
              Crop Selection
            </span>
          </button>
          
          <div className="w-6 sm:w-14 h-[2px] bg-[#E8592A]"></div>

          {/* Step 2: Live Weather Sync (Active) */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#E8592A] text-white shadow-sm ring-4 ring-[#E8592A]/15">
              2
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#E8592A]">
              Live Weather Sync
            </span>
          </div>

          <div className="w-6 sm:w-14 h-[2px] bg-stone-200"></div>

          {/* Step 3: Field Details */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-400 hidden sm:inline">
              Field Details
            </span>
          </div>

          <div className="w-6 sm:w-14 h-[2px] bg-stone-200"></div>

          {/* Step 4: Review & Save */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-400 hidden sm:inline">
              Review & Save
            </span>
          </div>
        </div>

        {/* Diagnostic Mode Status Pill */}
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
          Step 2: Weather Sync
        </span>
      </div>

      {/* ======================================================== */}
      {/* HERO BANNER: Live Weather Sync                           */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 via-[#FAF7F0] to-amber-50/50 border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        
        {/* Farm Background Image with subtle gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 lg:w-1/2 pointer-events-none overflow-hidden opacity-30">
          <img 
            src="/images/farmer_hero_wide.png" 
            alt="Farm landscape" 
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-sky-50/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          {/* Weather Sun Behind Cloud Icon */}
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-stone-200/80 flex items-center justify-center shrink-0">
            <div className="relative">
              <Sun size={28} className="text-amber-500 animate-spin-slow" />
              <CloudSun size={24} className="text-sky-500 absolute -bottom-1 -right-1" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200 tracking-wider uppercase">
                Step 2 of 4 • Root Cause Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Weather Sync
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Fetching your farm's 30-day meteorological history
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 1: Farm Location (Map) & Selected Field (2 Columns)  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (8 cols): Farm Location + Map */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          
          {/* Location Header & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MapPin size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">Your Farm Location</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Using GPS Location
                  </span>
                </div>
              </div>

              {/* Big Location Name */}
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {currentLocation.name}
              </h2>

              {/* District, Coordinates, Last Updated */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-stone-500 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Building2 size={13} className="text-stone-400" />
                  <span>District: <strong className="text-slate-700 font-semibold">{currentLocation.district}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Crosshair size={13} className="text-stone-400" />
                  <span>Coordinates: <strong className="text-slate-700 font-semibold">{currentLocation.coords}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-stone-400" />
                  <span>Last Updated: <strong className="text-slate-700 font-semibold">10 Oct 2026, 11:32 PM</strong></span>
                </span>
              </div>

            </div>

            {/* Change Location Button */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 shadow-sm flex items-center gap-1.5 self-start shrink-0 transition-colors"
            >
              <Edit3 size={13} className="text-stone-500" />
              <span>Change Location</span>
            </button>
          </div>

          {/* Interactive Satellite / Aerial Map Canvas */}
          <div className="relative w-full h-[230px] rounded-2xl overflow-hidden border border-stone-200/90 shadow-inner bg-slate-900 group">
            
            {/* Map Container with Zoom Transform */}
            <div 
              className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
              style={{ transform: `scale(${mapZoom})` }}
            >
              {/* Satellite / Terrain Basemap Image */}
              <img 
                src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/10/384/732"
                alt="Farm satellite view"
                className="w-full h-full object-cover filter brightness-95 contrast-105"
              />

              {/* Styled Vector Highways & River Simulation Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85">
                {/* Yamuna River Curve */}
                <path 
                  d="M 50,0 Q 80,120 180,240" 
                  fill="none" 
                  stroke="#38BDF8" 
                  strokeWidth="7" 
                  strokeLinecap="round"
                  className="opacity-75"
                />
                <text x="75" y="110" fill="#BAE6FD" fontSize="10" fontWeight="bold" transform="rotate(45, 75, 110)">
                  Yamuna River
                </text>

                {/* Major Highways */}
                <path d="M 0,90 Q 220,110 500,70" fill="none" stroke="#FBBF24" strokeWidth="3" className="opacity-80" />
                <path d="M 120,0 Q 260,140 450,240" fill="none" stroke="#FBBF24" strokeWidth="2.5" className="opacity-80" />
                <path d="M 300,0 L 320,240" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 2" className="opacity-70" />

                {/* Road Shields */}
                <rect x="230" y="98" width="22" height="12" rx="3" fill="#D97706" />
                <text x="241" y="107" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">NE3</text>
                
                <rect x="360" y="160" width="22" height="12" rx="3" fill="#D97706" />
                <text x="371" y="169" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">NE4</text>

                {/* Nearby City Labels */}
                <text x="180" y="55" fill="#E2E8F0" fontSize="11" fontWeight="extrabold">Noida</text>
                <text x="260" y="35" fill="#E2E8F0" fontSize="11" fontWeight="bold">Ghaziabad</text>
                <text x="380" y="100" fill="#E2E8F0" fontSize="10" fontWeight="bold">Dadri</text>
                <text x="390" y="170" fill="#E2E8F0" fontSize="10" fontWeight="bold">Pari Chowk</text>
              </svg>

              {/* Exact Center Marker: Red Pin with Callout Tooltip */}
              <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center pointer-events-none">
                
                {/* Callout Tooltip Card */}
                <div className="bg-[#FFF9F5] border border-[#FED7AA] shadow-lg rounded-xl px-3 py-1.5 mb-1.5 text-center whitespace-nowrap animate-bounce-subtle">
                  <div className="text-[11px] font-extrabold text-slate-800 leading-tight">
                    {currentLocation.district === 'Gautam Buddha Nagar' ? 'Greater Noida' : currentLocation.district}
                  </div>
                  <div className="text-[9px] font-semibold text-stone-500 leading-tight">
                    {currentLocation.name.split(',')[1]?.trim() || 'Uttar Pradesh, India'}
                  </div>
                </div>

                {/* Red Teardrop Marker Pin */}
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="w-2 h-2 bg-rose-600 rotate-45 mx-auto -mt-1 shadow-sm"></div>
                </div>

                {/* Pulsing Target Ring */}
                <div className="w-6 h-3 rounded-full bg-rose-500/30 blur-[2px] -mt-1 animate-ping"></div>
              </div>

            </div>

            {/* Map Controls (Top Left) */}
            <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
              <div className="bg-white rounded-xl shadow-md border border-stone-200/80 overflow-hidden flex flex-col">
                <button 
                  onClick={handleZoomIn}
                  className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold text-sm transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <div className="w-full h-[1px] bg-stone-200"></div>
                <button 
                  onClick={handleZoomOut}
                  className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold text-sm transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
              </div>

              {/* Recenter Button */}
              <button 
                onClick={handleRecenter}
                className="w-7 h-7 bg-white rounded-xl shadow-md border border-stone-200/80 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors"
                title="Recenter GPS"
              >
                <LocateFixed size={14} className="text-emerald-600" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Column (4 cols): Selected Field & Data Source */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4">
          
          {/* Top Half: Selected Field Card */}
          <div className="space-y-3">
            {/* Field Thumbnail Image */}
            <div className="h-32 w-full rounded-2xl overflow-hidden bg-stone-100 relative">
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80" 
                alt="Selected Field" 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/farmer_hero_wide.png'; }}
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-sm text-[10px] text-white font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active Season
              </div>
            </div>

            {/* Field Title & Info */}
            <div>
              <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                Selected Field
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Sprout size={16} className="text-emerald-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                  {currentLocation.field}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                <span>Area: <strong className="text-slate-700 font-semibold">{currentLocation.area}</strong></span>
                <span>•</span>
                <span>{currentLocation.district}, UP</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-stone-100"></div>

          {/* Bottom Half: Location & Telemetry Metadata */}
          <div className="space-y-2.5 text-xs">
            
            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/60 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500">
                <MapPin size={14} className="text-emerald-600" />
                <span>Location Source</span>
              </div>
              <span className="font-bold text-slate-800">GPS (Current Location)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/60 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500">
                <Crosshair size={14} className="text-blue-500" />
                <span>Accuracy</span>
              </div>
              <span className="font-bold text-slate-800">± 50 meters</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/60 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500">
                <CloudSun size={14} className="text-amber-500" />
                <span>Data Source</span>
              </div>
              <span className="font-bold text-slate-800">OpenWeather API</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/60 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500">
                <Clock size={14} className="text-purple-500" />
                <span>Last Updated</span>
              </div>
              <span className="font-bold text-slate-800">10 Oct 2026, 11:32 PM</span>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* ROW 2: 4 Key 30-Day Meteorological Metrics               */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Temperature */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <Thermometer size={16} />
              </div>
              <span>Temperature (°C)</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentLocation.tempAvg}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              Average (Last 30 Days)
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center gap-1">
              ↑ Max {currentLocation.tempMax}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center gap-1">
              ↓ Min {currentLocation.tempMin}
            </span>
          </div>
        </div>

        {/* Metric 2: Rainfall */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <CloudRain size={16} />
              </div>
              <span>Rainfall</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentLocation.rainTotal}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              Total (Last 30 Days)
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] text-stone-400 font-semibold">Rainy Days</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              🌧️ {currentLocation.rainyDays}
            </span>
          </div>
        </div>

        {/* Metric 3: Humidity */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Droplets size={16} />
              </div>
              <span>Humidity</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentLocation.humidity}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              Average (Last 30 Days)
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center gap-1">
              ↑ Max {currentLocation.humidityMax}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center gap-1">
              ↓ Min {currentLocation.humidityMin}
            </span>
          </div>
        </div>

        {/* Metric 4: Wind Speed */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Wind size={16} />
              </div>
              <span>Wind Speed</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentLocation.wind}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              Average (Last 30 Days)
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
              Max 28.6 km/h
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center gap-1">
              Min 3.2 km/h
            </span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* ROW 3: Charts & Insights (3 Columns)                     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chart 1: Temperature Trend (Last 30 Days) - 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Thermometer size={16} className="text-rose-500" />
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                Temperature Trend (Last 30 Days)
              </h3>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2.5 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Max
              </span>
              <span className="flex items-center gap-1 text-orange-600">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Avg
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Min
              </span>
            </div>
          </div>

          {/* Recharts Area / Multi-line Chart */}
          <div className="h-[210px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TEMP_TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 50]} 
                  ticks={[0, 10, 20, 30, 40, 50]}
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                {/* Min Temp Area with fill */}
                <Area 
                  type="monotone" 
                  dataKey="min" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#tempBlueGrad)" 
                  name="Min Temp (°C)"
                />
                {/* Avg Temp Line */}
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="#F97316" 
                  strokeWidth={2} 
                  dot={false}
                  name="Avg Temp (°C)"
                />
                {/* Max Temp Line */}
                <Line 
                  type="monotone" 
                  dataKey="max" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  dot={false}
                  name="Max Temp (°C)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Chart 2: Rainfall (Last 30 Days) - 4 cols */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          
          <div className="flex items-center gap-2">
            <CloudRain size={16} className="text-blue-500" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
              Rainfall (Last 30 Days)
            </h3>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-[210px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RAINFALL_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 20]} 
                  ticks={[0, 5, 10, 15, 20]}
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  formatter={(val) => [`${val} mm`, 'Rainfall']}
                />
                <Bar 
                  dataKey="rain" 
                  fill="#0284C7" 
                  radius={[4, 4, 0, 0]} 
                  barSize={14} 
                  name="Rainfall (mm)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Insights 3: Weather Insights - 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
              Weather Insights
            </h3>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-700 leading-snug font-medium">
                Weather conditions are generally suitable for wheat.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-700 leading-snug font-medium">
                High temperature detected in last week. May cause water stress.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-700 leading-snug font-medium">
                Rainfall is low. Consider irrigation if soil moisture is low.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-700 leading-snug font-medium">
                Humidity is in normal range.
              </p>
            </div>

          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-[10px] text-amber-800 font-medium">
            💡 Correlated with live IoT sensor telemetry in next step.
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* STICKY BOTTOM ACTION BAR                                 */}
      {/* ======================================================== */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <button
          onClick={() => navigate('/reports')}
          className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={16} />
          <span>Back to Crop Selection</span>
        </button>

        <div className="text-center hidden md:block">
          <span className="text-xs font-semibold text-stone-500">
            Location: <strong className="text-slate-800">{currentLocation.district}</strong> • Avg Temp: <strong className="text-slate-800">{currentLocation.tempAvg}</strong> • Rainfall: <strong className="text-slate-800">{currentLocation.rainTotal}</strong>
          </span>
        </div>

        <button
          onClick={handleContinue}
          className="px-7 py-3 rounded-xl bg-[#E8592A] hover:bg-[#D44A1E] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all w-full sm:w-auto justify-center"
        >
          <span>Continue to Field Details</span>
          <ArrowRight size={16} />
        </button>

      </div>

      {/* ======================================================== */}
      {/* CHANGE LOCATION MODAL                                    */}
      {/* ======================================================== */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-[#E8592A]" size={20} />
                <h3 className="font-extrabold text-slate-800 text-base">Select Farm Location</h3>
              </div>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {FARM_LOCATIONS.map(loc => (
                <button
                  key={loc.name}
                  onClick={() => {
                    setCurrentLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                    currentLocation.name === loc.name 
                      ? 'border-[#E8592A] bg-orange-50/30 ring-1 ring-[#E8592A]' 
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      {loc.name}
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      {loc.district} • {loc.coords}
                    </span>
                  </div>

                  {currentLocation.name === loc.name && (
                    <div className="w-5 h-5 rounded-full bg-[#E8592A] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-colors"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
