import React, { useState } from 'react';
import { Search, ChevronRight, Bug, Activity, Droplets, ThermometerSun, Sprout, Map, ShieldAlert, FlaskConical, Leaf, TrendingUp, Tractor, Pill, ShieldCheck, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TREATMENT_DB } from '../engine/TreatmentDatabase';

const CATEGORY_CARDS = [
  { id: 'disease', label: 'Diseases', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'pests', label: 'Insect Pests', icon: Bug, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'nutrient', label: 'Nutrient Deficiency', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'water', label: 'Water Problems', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'weather', label: 'Weather Stress', icon: ThermometerSun, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'soil', label: 'Soil Problems', icon: Map, color: 'text-stone-500', bg: 'bg-stone-50' }
];

export default function FertilizerGuide() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // If navigated from EngineCompute, this will hold the diagnosis string
  const rootCause = location.state?.rootCause;
  const recommendedTreatment = rootCause ? TREATMENT_DB[rootCause] : null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 pb-16 animate-in fade-in">
      
      {/* Dynamic Header based on whether a root cause was passed */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-64 flex items-center justify-center bg-slate-900 group">
        <img 
          src="/images/stages/maturity.jpg" 
          alt="Wheat Field" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
        
        <div className="relative z-10 text-center px-6 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2">
            {rootCause ? 'Engine Recommendation' : 'Treatment & Fertilizer Guide'}
          </h1>
          <p className="text-lg text-slate-300 font-medium drop-shadow-md">
            {rootCause ? `Targeted treatment for: ${rootCause}` : 'Find the right guidance and treatment for your crop'}
          </p>
        </div>
      </div>

      {/* Auto-Loaded Treatment Card (if coming from Engine) */}
      {rootCause && recommendedTreatment && (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-indigo-200 overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-indigo-50 border-b border-indigo-100 p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-indigo-600 uppercase">Diagnosed Issue</span>
              <h2 className="text-2xl font-black text-slate-800">{rootCause}</h2>
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
                  <Activity className="text-red-500" /> Immediate Action Required
                </h3>
                <p className="text-slate-600 text-lg bg-red-50 p-4 rounded-xl border border-red-100 font-medium">
                  {recommendedTreatment.action}
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
                  <Pill className="text-purple-500" /> Treatment Details
                </h3>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {recommendedTreatment.details}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
                  <FlaskConical className="text-blue-500" /> Recommended Chemical / Product
                </h3>
                <p className="text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-100 font-semibold text-blue-900">
                  {recommendedTreatment.chemical || 'No chemical intervention needed.'}
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-2">
                  <Info className="text-emerald-500" /> Preventive Measure
                </h3>
                <p className="text-slate-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  {recommendedTreatment.preventive}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Search */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Search Manual Library</h2>
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Search symptoms (e.g., yellow leaves, rust)..." 
            className="w-full pl-12 pr-6 py-4 rounded-xl text-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORY_CARDS.map(cat => (
            <div 
              key={cat.id}
              onClick={() => navigate(`/fertilizer-guide/category/${cat.id}`)}
              className="cursor-pointer group flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${cat.bg} group-hover:scale-110 transition-transform`}>
                <cat.icon size={24} className={cat.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-700">{cat.label}</h3>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-500" size={20} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
