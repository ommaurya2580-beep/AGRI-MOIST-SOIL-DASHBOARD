// Updated: 2026-10-25
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ScanLine, 
  CloudSun, 
  Radio, 
  Globe, 
  Clock, 
  Bell, 
  Settings, 
  MapPin, 
  ChevronDown, 
  Headphones, 
  ChevronRight,
  Sprout,
  Sparkles
} from 'lucide-react';
import AgriPulseBot from '../components/AgriPulseBot';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/crop-analysis', label: 'Analyse Crop', icon: ScanLine },
  { path: '/reports', label: 'Crop History', icon: Sprout },
  { path: '/weather', label: 'Weather', icon: CloudSun },
  { path: '/sensors', label: 'Sensors (IoT)', icon: Radio },
  { path: '/fertilizer-guide', label: 'Web Advisory', icon: Globe, badge: 'Optional' },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/alerts', label: 'Alerts', icon: Bell, alertCount: 3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isHindi, setIsHindi] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Greater Noida, UP');
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const toggleLanguage = () => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = isHindi ? 'en' : 'hi';
      select.dispatchEvent(new Event('change'));
      setIsHindi(!isHindi);
    } else {
      setIsHindi(!isHindi);
    }
  };

  const locationsList = [
    'Greater Noida, UP',
    'Ludhiana, Punjab',
    'Karnal, Haryana',
    'Meerut, UP',
    'Indore, MP'
  ];

  return (
    <div className="flex h-screen bg-[#FBFBF9] text-slate-800 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#EFECE6] flex flex-col justify-between shrink-0 h-screen select-none z-20">
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Brand Header */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="p-6 pb-5 flex items-center gap-3 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30">
              <Sprout size={24} className="stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                Agri<span className="text-emerald-600">Pulse</span>
              </h1>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">Smart Crop Health Assistant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-2 px-4 flex flex-col gap-1.5 overflow-y-auto scrollbar-none flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 group ${
                    isActive 
                      ? 'bg-[#FDF0EB] text-[#E8592A] font-bold shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon 
                      size={19} 
                      className={isActive ? 'text-[#E8592A] stroke-[2.4]' : 'text-slate-400 group-hover:text-slate-600'} 
                    />
                    <span className="text-sm tracking-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      {item.badge}
                    </span>
                  )}

                  {item.alertCount && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.alertCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Help Card */}
          <div className="p-4 shrink-0">
            <div 
              onClick={() => setIsBotOpen(true)}
              className="p-3.5 rounded-2xl bg-[#F8F7F4] hover:bg-[#F2F0EB] border border-stone-200/60 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 group-hover:text-[#E8592A] transition-colors">
                  <Headphones size={17} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Need Help?</h4>
                  <p className="text-[11px] text-slate-500">Get support or learn</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </div>

        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-[#FBFBF9] border-b border-[#EFECE6]/80 flex items-center justify-between px-8 shrink-0 z-10">
          <div>{/* Breadcrumb or empty for clean design */}</div>

          <div className="flex items-center gap-3">
            
            {/* Location Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/70 text-slate-700 text-xs font-bold shadow-sm hover:border-slate-300 transition-all"
              >
                <MapPin size={14} className="text-[#E8592A]" />
                <span>{selectedLocation}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {showLocationMenu && (
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
                  {locationsList.map(loc => (
                    <button
                      key={loc}
                      onClick={() => { setSelectedLocation(loc); setShowLocationMenu(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                        selectedLocation === loc ? 'text-[#E8592A] font-bold' : 'text-slate-600'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/70 text-slate-700 text-xs font-bold shadow-sm hover:border-slate-300 transition-all"
            >
              <Globe size={14} className="text-slate-500" />
              <span>{isHindi ? 'हिन्दी' : 'English'}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                JD
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">John Doe</span>
              <ChevronDown size={13} className="text-slate-400 hidden sm:inline" />
            </div>

          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <main className="flex-1 overflow-y-auto bg-[#FBFBF9] p-6 lg:p-8">
          <Outlet />
          
          {/* AI Assistant Overlay Drawer */}
          <AgriPulseBot isOpen={isBotOpen} onClose={() => setIsBotOpen(false)} />
        </main>

      </div>

    </div>
  );
}
