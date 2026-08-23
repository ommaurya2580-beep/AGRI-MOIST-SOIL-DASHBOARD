import React, { useState } from 'react';
import { Search, ChevronRight, Bug, Activity, Droplets, ThermometerSun, Sprout, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SYMPTOM_CARDS = [
  { id: 'yellow', label: 'Yellow Leaves', emoji: '🟡', color: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400' },
  { id: 'spots', label: 'Brown / Black Spots', emoji: '🟤', color: 'bg-orange-900/10 border-orange-900/30 hover:border-orange-800' },
  { id: 'insects', label: 'Insects on Crop', emoji: '🐛', color: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400' },
  { id: 'water', label: 'Water Problem', emoji: '💧', color: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-400' },
  { id: 'growth', label: 'Poor Growth', emoji: '🌱', color: 'bg-green-600/10 border-green-600/30 hover:border-green-500' },
  { id: 'burn', label: 'Burned / Damaged', emoji: '🔥', color: 'bg-red-500/10 border-red-500/30 hover:border-red-400' },
  { id: 'grain', label: 'Grain / Head Problem', emoji: '🌾', color: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400' },
  { id: 'other', label: 'Other Problem', emoji: '❓', color: 'bg-slate-500/10 border-slate-500/30 hover:border-slate-400' },
];

const CATEGORY_CARDS = [
  { id: 'disease', label: 'Diseases', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'pests', label: 'Insect Pests', icon: Bug, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'nutrient', label: 'Nutrient Deficiency', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'water', label: 'Water Problems', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'weather', label: 'Weather Stress', icon: ThermometerSun, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'soil', label: 'Soil Problems', icon: Map, color: 'text-stone-500', bg: 'bg-stone-50' },
];

export default function FertilizerGuide() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-16 animate-in fade-in">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 flex items-center justify-center bg-slate-900 group">
        <img 
          src="/images/stages/maturity.jpg" 
          alt="Wheat Field" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
        
        <div className="relative z-10 text-center px-6 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🌾</span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              Fertilizer Guide
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-200 mb-8 font-medium drop-shadow-md">
            Find the right guidance and treatment for your wheat crop
          </p>
          
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text" 
              placeholder="Search your problem (e.g., yellow leaves, rust)..." 
              className="w-full pl-12 pr-6 py-4 rounded-full text-lg shadow-xl border-0 focus:ring-4 focus:ring-emerald-500/50 bg-white/95 backdrop-blur outline-none text-slate-800 placeholder-slate-400 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Symptom Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span className="text-2xl">👀</span> What problem do you see?
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SYMPTOM_CARDS.map(symp => (
            <div 
              key={symp.id}
              onClick={() => navigate(`/fertilizer-guide`)}
              className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all transform hover:-translate-y-1 bg-white shadow-sm hover:shadow-md ${symp.color}`}
            >
              <span className="text-5xl mb-4 drop-shadow-sm">{symp.emoji}</span>
              <span className="font-bold text-slate-700 text-center">{symp.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Browse by Category */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Browse by Category
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORY_CARDS.map(cat => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/fertilizer-guide/category/${cat.id}`)}
              className="cursor-pointer group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${cat.bg} group-hover:scale-110 transition-transform`}>
                <cat.icon size={28} className={cat.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800">{cat.label}</h3>
                <p className="text-sm text-slate-500">View related issues</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
