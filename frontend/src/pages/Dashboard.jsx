import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ArrowRight, 
  ChevronRight, 
  Sun, 
  CloudSun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  FlaskConical, 
  Sprout, 
  Bell, 
  AlertTriangle, 
  Info, 
  BookOpen, 
  FileText, 
  Newspaper, 
  GraduationCap, 
  Clock, 
  Wifi, 
  Globe, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sensorState, setSensorState] = useState({
    moisture: 42,
    isOnline: false,
    pumpIsOn: false
  });

  // Fetch live moisture from AgriPulse Backend Server 1
  useEffect(() => {
    let isMounted = true;
    const fetchState = () => {
      fetch('/api/state')
        .then(res => res.json())
        .then(data => {
          if (isMounted && data) {
            setSensorState({
              moisture: data.currentMoisture ?? data.cachedReadings?.moisture ?? 42,
              isOnline: Boolean(data.isOnline),
              pumpIsOn: data.state?.pumpIsOn || false
            });
          }
        })
        .catch(() => {
          if (isMounted) {
            setSensorState(prev => ({ ...prev, isOnline: false }));
          }
        });
    };

    fetchState();
    const interval = setInterval(fetchState, 2500);
    return () => { 
      isMounted = false; 
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      
      {/* 1. Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FAF1EA] border border-[#EADBCE] shadow-sm min-h-[220px] flex items-center justify-between p-7 lg:p-10 group">
        
        {/* Background Image on Right */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 lg:w-[60%] pointer-events-none overflow-hidden">
          <img 
            src="/images/farmer_hero_wide.png" 
            alt="Farmer in wheat field at golden hour" 
            className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-1000"
          />
          {/* Subtle gradient blend to left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF1EA] via-[#FAF1EA]/80 sm:via-[#FAF1EA]/40 to-transparent"></div>
        </div>

        {/* Left Text Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Namaste, Farmer!
          </h1>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mt-1">
            Check your crop health in seconds
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed max-w-md">
            Upload a crop image to detect possible diseases, pests or nutrient issues and get simple, actionable advice.
          </p>

          <button
            onClick={() => navigate('/crop-analysis')}
            className="mt-6 bg-[#E8592A] hover:bg-[#D44A1E] active:scale-95 text-white font-bold px-6 py-3 rounded-full inline-flex items-center gap-2.5 shadow-md shadow-orange-500/25 text-sm transition-all"
          >
            <Camera size={18} />
            <span>Analyse Crop Image</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Handwritten Tagline Quote (Top Right) */}
        <div className="absolute top-5 right-8 lg:right-12 z-10 hidden md:block text-right pointer-events-none">
          <p className="font-handwriting text-2xl lg:text-3xl text-[#2F241C] font-bold leading-tight drop-shadow-sm rotate-[-2deg]">
            “Healthy Crops<br />Stronger Farmers<br />Brighter Tomorrows”
          </p>
        </div>
      </div>

      {/* Smart Diagnostics & Root Cause Engine Banner (Core Feature) */}
      <div 
        onClick={() => navigate('/reports')}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173026] via-[#1E4334] to-[#12271F] p-6 lg:p-7 text-white shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.006] transition-all group border border-emerald-900/60"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-widest">
                Comprehensive 4-Tier Diagnostics
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <Sparkles size={13} />
                Multi-Modal AI Engine
              </span>
            </div>

            <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Smart Diagnostics & Root Cause Engine</span>
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
              Cross-reference <span className="text-emerald-300 font-semibold">Crop History</span>, <span className="text-emerald-300 font-semibold">30-Day Weather</span>, <span className="text-emerald-300 font-semibold">Live IoT Sensors</span>, and <span className="text-emerald-300 font-semibold">AI Vision</span> to find the exact root cause of any crop problem and get expert recommendations.
            </p>

            {/* 4 Steps Visual Flow */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-emerald-200/90">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-900 font-bold text-[10px] flex items-center justify-center">1</span>
                Crop History
              </span>
              <span className="text-emerald-400">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-900 font-bold text-[10px] flex items-center justify-center">2</span>
                30-Day Weather
              </span>
              <span className="text-emerald-400">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-900 font-bold text-[10px] flex items-center justify-center">3</span>
                IoT Soil Telemetry
              </span>
              <span className="text-emerald-400">→</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-900 font-bold text-[10px] flex items-center justify-center">4</span>
                Root Cause Synthesis
              </span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/reports')}
            className="px-6 py-3 rounded-full bg-[#E8592A] hover:bg-[#D44A1E] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/30 flex items-center gap-2 shrink-0 group-hover:translate-x-1 transition-all cursor-pointer"
          >
            <span>Start Full Diagnosis</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Top Metric / Status Cards (Row 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Last Analysis */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sprout size={20} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Last Analysis</span>
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">Wheat - Yellow Rust</h4>
                </div>
              </div>
              <img 
                src="/images/yellow_rust_thumb.jpg" 
                alt="Leaf thumbnail" 
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2">
              20 Oct 2026 | Confidence: <span className="font-bold text-slate-600">87%</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => navigate('/fertilizer-guide', { state: { rootCause: 'Yellow Rust' } })}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 w-fit"
            >
              <span>View Details</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Card 2: Weather Today */}
        <div 
          onClick={() => navigate('/weather')}
          className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <CloudSun size={22} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Weather Today</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">28°C</span>
                  <span className="text-xs font-semibold text-slate-500">Partly Cloudy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <Droplets size={12} className="text-blue-500" /> 65%
              </span>
              <span className="text-[10px] text-slate-400">Humidity</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <Wind size={12} className="text-teal-500" /> 12 km/h
              </span>
              <span className="text-[10px] text-slate-400">Wind</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <CloudRain size={12} className="text-blue-500" /> 0 mm
              </span>
              <span className="text-[10px] text-slate-400">Rain</span>
            </div>
          </div>
        </div>

        {/* Card 3: Soil Sensors */}
        <div 
          onClick={() => navigate('/sensors')}
          className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Sprout size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Soil Sensors</h4>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              sensorState.isOnline 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                sensorState.isOnline 
                  ? 'bg-emerald-500 animate-pulse' 
                  : 'bg-rose-500'
              }`}></span>
              {sensorState.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center pt-2">
            <div>
              <Droplets size={15} className="mx-auto text-blue-500 mb-1" />
              <div className="text-xs font-bold text-slate-800">{sensorState.moisture}%</div>
              <div className="text-[9px] text-slate-400">Moisture</div>
            </div>
            <div>
              <Thermometer size={15} className="mx-auto text-orange-500 mb-1" />
              <div className="text-xs font-bold text-slate-800">24°C</div>
              <div className="text-[9px] text-slate-400">Temperature</div>
            </div>
            <div>
              <FlaskConical size={15} className="mx-auto text-purple-500 mb-1" />
              <div className="text-xs font-bold text-slate-800">6.8</div>
              <div className="text-[9px] text-slate-400">pH</div>
            </div>
            <div>
              <Sprout size={15} className="mx-auto text-emerald-500 mb-1" />
              <div className="text-xs font-bold text-slate-800">42 kg</div>
              <div className="text-[9px] text-slate-400">NPK (N)</div>
            </div>
          </div>
        </div>

        {/* Card 4: Active Alerts */}
        <div 
          onClick={() => navigate('/alerts')}
          className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Active Alerts</h4>
            </div>
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
              2
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                <div>
                  <h5 className="text-[11px] font-bold text-slate-800 leading-tight">Low Soil Moisture</h5>
                  <p className="text-[10px] text-slate-400">Today, 10:30 AM</p>
                </div>
              </div>
              <ChevronRight size={13} className="text-slate-300" />
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-blue-500 shrink-0" />
                <div>
                  <h5 className="text-[11px] font-bold text-slate-800 leading-tight">Rain expected in 2 days</h5>
                  <p className="text-[10px] text-slate-400">Check for disease risk</p>
                </div>
              </div>
              <ChevronRight size={13} className="text-slate-300" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. Middle Section: 3 Feature Columns (Row 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Col 1: Recent Crop Analyses (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-900">Recent Crop Analyses</h3>
              <button 
                onClick={() => navigate('/history')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              
              {/* Item 1 */}
              <div 
                onClick={() => navigate('/fertilizer-guide', { state: { rootCause: 'Yellow Rust' } })}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/yellow_rust_thumb.jpg" 
                    alt="Yellow Rust" 
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#E8592A] transition-colors">
                      Wheat - Yellow Rust
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        Disease
                      </span>
                      <span className="text-[10px] text-slate-400">20 Oct 2026</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800">87%</span>
                    <p className="text-[9px] text-slate-400">Confidence</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" />
                </div>
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => navigate('/fertilizer-guide', { state: { rootCause: 'Aphids' } })}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/problems/insects.jpg" 
                    alt="Aphids" 
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#E8592A] transition-colors">
                      Wheat - Aphids
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                        Pest
                      </span>
                      <span className="text-[10px] text-slate-400">15 Oct 2026</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800">78%</span>
                    <p className="text-[9px] text-slate-400">Confidence</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" />
                </div>
              </div>

              {/* Item 3 */}
              <div 
                onClick={() => navigate('/crop-analysis')}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/problems/all_good.jpg" 
                    alt="Healthy" 
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      Wheat - Healthy
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Healthy
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800">92%</span>
                    <p className="text-[9px] text-slate-400">Confidence</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" />
                </div>
              </div>

              {/* Item 4 */}
              <div 
                onClick={() => navigate('/fertilizer-guide', { state: { rootCause: 'Brown Rust' } })}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/problems/spots.jpg" 
                    alt="Brown Rust" 
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#E8592A] transition-colors">
                      Wheat - Brown Rust
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        Disease
                      </span>
                      <span className="text-[10px] text-slate-400">5 Oct 2026</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800">64%</span>
                    <p className="text-[9px] text-slate-400">Confidence</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Col 2: Agricultural Web Intelligence (TinyFish) (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles size={14} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Agricultural Web Intelligence <span className="text-purple-600">(TinyFish)</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ml-auto">
                Optional
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Get latest information from trusted agricultural sources
            </p>

            {/* Central Book Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 shadow-inner">
              <BookOpen size={30} className="stroke-[2.2]" />
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3.5 mb-6 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText size={13} />
                </div>
                <span>Treatment methods and preventive measures</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Newspaper size={13} />
                </div>
                <span>Research articles and government advisories</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap size={13} />
                </div>
                <span>Mandi prices, schemes and expert recommendations</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/fertilizer-guide')}
            className="w-full bg-[#ECEBFE] hover:bg-[#E2E0FD] text-[#5B50E6] font-bold py-2.5 px-4 rounded-xl text-center text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Find Agricultural Advisories</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Col 3: 7-Day Weather Forecast (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <h3 className="font-extrabold text-base text-slate-900">7-Day Weather Forecast</h3>
              </div>
              <button 
                onClick={() => navigate('/weather')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                <span>View Full</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* 7 Day Horizontal Strip */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 mb-4">
              {[
                { day: 'Mon', date: '20 Oct', icon: Sun, color: 'text-amber-500', high: '28°', low: '18°' },
                { day: 'Tue', date: '21 Oct', icon: Sun, color: 'text-amber-500', high: '29°', low: '19°' },
                { day: 'Wed', date: '22 Oct', icon: CloudRain, color: 'text-blue-500', high: '27°', low: '18°' },
                { day: 'Thu', date: '23 Oct', icon: CloudRain, color: 'text-blue-500', high: '26°', low: '17°' },
                { day: 'Fri', date: '24 Oct', icon: Sun, color: 'text-amber-500', high: '28°', low: '18°' },
                { day: 'Sat', date: '25 Oct', icon: Sun, color: 'text-amber-500', high: '29°', low: '19°' },
                { day: 'Sun', date: '26 Oct', icon: CloudSun, color: 'text-blue-500', high: '27°', low: '18°' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-700">{item.day}</span>
                  <span className="text-[9px] text-slate-400 mb-1.5">{item.date.split(' ')[0]}</span>
                  <item.icon size={18} className={`${item.color} mb-1.5`} />
                  <span className="text-[11px] font-bold text-slate-800">{item.high}</span>
                  <span className="text-[9px] text-slate-400">{item.low}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Advisory Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
              <CloudRain size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800">Weather Advisory</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Light rain likely on Wednesday and Thursday. Monitor your wheat crop for fungal diseases.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Row: Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-900">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Analyse Crop Image */}
          <div
            onClick={() => navigate('/crop-analysis')}
            className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm hover:shadow-md hover:border-orange-200 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FFF0EB] text-[#E8592A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Camera size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#E8592A] transition-colors">
                  Analyse Crop Image
                </h4>
                <p className="text-[10px] text-slate-400 leading-snug">
                  Detect disease, pests or nutrient issues
                </p>
              </div>
            </div>
            <ArrowRight size={15} className="text-slate-300 group-hover:text-[#E8592A] transition-colors shrink-0 ml-2" />
          </div>

          {/* Action 2: Check Weather */}
          <div
            onClick={() => navigate('/weather')}
            className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#EBF4FF] text-[#2B7FFF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CloudSun size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#2B7FFF] transition-colors">
                  Check Weather
                </h4>
                <p className="text-[10px] text-slate-400 leading-snug">
                  View current and forecast conditions
                </p>
              </div>
            </div>
            <ArrowRight size={15} className="text-slate-300 group-hover:text-[#2B7FFF] transition-colors shrink-0 ml-2" />
          </div>

          {/* Action 3: View Sensor Data */}
          <div
            onClick={() => navigate('/sensors')}
            className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm hover:shadow-md hover:border-amber-200 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FFF8EB] text-[#D97706] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Wifi size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#D97706] transition-colors">
                  View Sensor Data
                </h4>
                <p className="text-[10px] text-slate-400 leading-snug">
                  Check soil moisture, pH, NPK (if available)
                </p>
              </div>
            </div>
            <ArrowRight size={15} className="text-slate-300 group-hover:text-[#D97706] transition-colors shrink-0 ml-2" />
          </div>

          {/* Action 4: Get Web Advisory */}
          <div
            onClick={() => navigate('/fertilizer-guide')}
            className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-sm hover:shadow-md hover:border-purple-200 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#F5F0FF] text-[#7E22CE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#7E22CE] transition-colors">
                  Get Web Advisory
                </h4>
                <p className="text-[10px] text-slate-400 leading-snug">
                  Search latest agricultural information
                </p>
              </div>
            </div>
            <ArrowRight size={15} className="text-slate-300 group-hover:text-[#7E22CE] transition-colors shrink-0 ml-2" />
          </div>

        </div>
      </div>

    </div>
  );
}
