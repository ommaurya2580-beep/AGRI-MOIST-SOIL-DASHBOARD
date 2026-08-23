import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { wheatProblemsDatabase } from '../data/wheatProblemsDatabase';

export default function ProblemCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // For now, if the user picks 'disease', we load it. 
  // If they pick something else that isn't fully implemented, we show a placeholder.
  const categoryData = wheatProblemsDatabase[categoryId];

  if (!categoryData) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center animate-in fade-in">
        <button onClick={() => navigate('/fertilizer-guide')} className="flex items-center gap-2 text-emerald-600 mb-6 font-semibold">
          <ChevronLeft size={20} /> Back to Guide
        </button>
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
          <ShieldAlert size={64} className="mx-auto text-amber-500 mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Under Construction</h1>
          <p className="text-slate-500">We are still adding data for this category. Please check Diseases for a full preview!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/fertilizer-guide')}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-slate-600"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            {categoryData.title}
          </h1>
          <p className="text-slate-500 font-medium mt-1">{categoryData.description}</p>
        </div>
      </div>

      {/* Subcategories */}
      <div className="space-y-12">
        {categoryData.subcategories.map(sub => (
          <div key={sub.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center gap-3 border-b border-emerald-100 pb-4">
              <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">🦠</span>
              {sub.title}
            </h2>
            
            <div className="space-y-8">
              {sub.groups.map(group => (
                <div key={group.id}>
                  <h3 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wider">{group.title}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.problems.map(prob => (
                      <div 
                        key={prob.id}
                        onClick={() => navigate(`/fertilizer-guide/problem/${prob.id}`)}
                        className="group cursor-pointer rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all bg-slate-50 flex flex-col"
                      >
                        <div className="h-40 overflow-hidden relative">
                          <img src={prob.image} alt={prob.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                          <h4 className="absolute bottom-3 left-4 text-white font-bold text-lg drop-shadow-md pr-4">{prob.name}</h4>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                            {prob.symptoms[0]}
                          </p>
                          <div className="flex items-center justify-between text-emerald-600 font-semibold text-sm">
                            <span>View Guide</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
