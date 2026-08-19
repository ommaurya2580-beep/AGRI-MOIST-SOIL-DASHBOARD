import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Activity, 
  Cpu, 
  CloudRain, 
  FileText, 
  Lightbulb, 
  Bell, 
  Clock, 
  Settings,
  Search,
  Bot
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/sensors', label: 'Sensors', icon: Cpu },
  { path: '/soil-npk', label: 'Soil & NPK', icon: Activity },
  { path: '/fields', label: 'Field Map', icon: Map },
  { path: '/irrigation', label: 'Irrigation', icon: CloudRain }, // Using CloudRain or similar for now
  { path: '/fertilizer-guide', label: 'Fertilizer Guide', icon: Lightbulb },
  { path: '/weather', label: 'Weather', icon: CloudRain },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/esp32-connect', label: 'ESP32 Connect', icon: Cpu },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#064e3b] text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center gap-3">
            <LeafLogo />
            <div>
              <h1 className="font-bold text-xl tracking-tight">AgriPulse</h1>
              <p className="text-xs text-emerald-300">Smart Agriculture Assistant</p>
            </div>
          </div>

          <nav className="mt-4 px-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-600 text-white font-medium shadow-sm' 
                      : 'text-emerald-100 hover:bg-[#065f46] hover:text-white'
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              );
            })}
            
            {/* AI Analysis Sub-section */}
            <div className="mt-4 mb-2 px-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              AI Analysis
            </div>
            
            <NavLink
              to="/analysis/disease"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-emerald-600 text-white font-medium shadow-sm' : 'text-emerald-100 hover:bg-[#065f46] hover:text-white'
              }`}
            >
              <div className="w-5 flex justify-center"><LeafIcon size={18} /></div>
              <span className="text-sm">Crop Disease (Model-1)</span>
            </NavLink>
            
            <NavLink
              to="/analysis/pest"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-emerald-600 text-white font-medium shadow-sm' : 'text-emerald-100 hover:bg-[#065f46] hover:text-white'
              }`}
            >
              <div className="w-5 flex justify-center"><BugIcon size={18} /></div>
              <span className="text-sm">Pest Detection (Model-2)</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-4">
          <div className="bg-[#065f46] p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <Bot size={40} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-200 tracking-wider">AI ASSISTANT</span>
            </div>
            <p className="text-xs text-emerald-100 mb-3 relative z-10">
              Ask anything about your crops, pests, or weather...
            </p>
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-medium py-2 rounded-lg transition-colors relative z-10">
              Ask AgriPulse
            </button>
          </div>
          
          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold border-2 border-[#064e3b]">
              JD
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-emerald-300">Premium User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            {/* Page title handled by children or outlet context */}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 border border-slate-300 rounded px-1.5 py-0.5 font-mono">
                ⌘K
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-slate-500">
              <button className="relative hover:text-slate-700 transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  3
                </span>
              </button>
              <button className="hover:text-slate-700 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Simple icons to avoid too many imports
const LeafLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

const LeafIcon = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
  </svg>
);

const BugIcon = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 2 1.88 1.88"></path>
    <path d="M14.12 3.88 16 2"></path>
    <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path>
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path>
    <path d="M12 20v-9"></path>
    <path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path>
    <path d="M6 13H2"></path>
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path>
    <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path>
    <path d="M22 13h-4"></path>
    <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path>
  </svg>
);
