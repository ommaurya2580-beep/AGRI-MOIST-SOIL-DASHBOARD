// Updated: 2026-10-25
import React, { useState } from 'react';
import { Settings, User, MapPin, Bell, Globe, Sparkles, Check, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [farmerName, setFarmerName] = useState('John Doe');
  const [farmLocation, setFarmLocation] = useState(() => {
    return localStorage.getItem('agripulse_user_location') || 'Your Farm Location';
  });
  const [soilType, setSoilType] = useState('Alluvial Clay Loam');
  const [autoPump, setAutoPump] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('agripulse_user_location', farmLocation);
    window.dispatchEvent(new Event('agripulse_location_updated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Farm & System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your field profiles, irrigation rules, and AI module integrations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-7 border border-stone-200/70 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Farmer & Farm Profile</h3>
              <p className="text-xs text-slate-400">Basic details for localized weather and mandi advisories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Farmer Name</label>
              <input 
                type="text" 
                value={farmerName} 
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#E8592A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Location</label>
              <input 
                type="text" 
                value={farmLocation} 
                onChange={(e) => setFarmLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#E8592A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Soil Classification</label>
              <input 
                type="text" 
                value={soilType} 
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#E8592A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Crop Cultivated</label>
              <input 
                type="text" 
                defaultValue="Wheat (Triticum aestivum)" 
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Integration Status Card */}
        <div className="bg-white rounded-3xl p-7 border border-stone-200/70 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">AI & Web Intelligence Integrations</h3>
              <p className="text-xs text-slate-400">Microservice connectivity and autonomous search engines</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">TinyFish Web Intelligence Engine</h4>
                  <p className="text-[11px] text-slate-500">Autonomous agricultural extension scraper & KVK advisory validator</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connected & Active
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Model 1 (TerraLeaf Disease CNN)</h4>
                  <p className="text-[11px] text-slate-500">AWS EC2 Server 2 (16.192.162.67:8000) • 5 Pathology classes</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Healthy
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Model 2 (Wheat Pest YOLO11s)</h4>
                  <p className="text-[11px] text-slate-500">AWS EC2 Server 3 (13.50.81.200:8000) • 9 Insect pest classes</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Healthy
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
              <Check size={14} /> Settings Saved Successfully
            </span>
          )}
          <button
            type="submit"
            className="bg-[#E8592A] hover:bg-[#D44A1E] text-white font-bold text-xs px-6 py-3 rounded-full shadow-md shadow-orange-500/20 transition-all"
          >
            Save Configuration
          </button>
        </div>

      </form>
    </div>
  );
}
