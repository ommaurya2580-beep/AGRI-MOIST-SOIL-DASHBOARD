import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, FlaskConical, Sprout, ShieldAlert, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { wheatProblemsDatabase } from '../data/wheatProblemsDatabase';

// Helper to flatten database and find the specific problem
function findProblem(id) {
  for (const catKey in wheatProblemsDatabase) {
    const category = wheatProblemsDatabase[catKey];
    for (const sub of category.subcategories) {
      for (const group of sub.groups) {
        for (const prob of group.problems) {
          if (prob.id === id) return prob;
        }
      }
    }
  }
  return null;
}

export default function ProblemDetail() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  
  const problem = findProblem(problemId);

  if (!problem) {
    return <div className="p-8 text-center text-xl text-slate-500">Problem not found.</div>;
  }

  // Determine status color
  const getStatusColor = (status) => {
    if (status === 'Recommended') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (status === 'Possible') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (status === 'Soil Test Required') return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-slate-100 text-slate-700 border-slate-300'; // Not Primary
  };

  const getStatusDot = (status) => {
    if (status === 'Recommended') return '🟢';
    if (status === 'Possible') return '🟡';
    if (status === 'Soil Test Required') return '🔵';
    return '⚪';
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Top Bar */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-semibold bg-white px-4 py-2 rounded-full shadow-sm w-fit"
      >
        <ChevronLeft size={20} /> Back
      </button>

      {/* Title Area */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">{problem.name}</h1>
            <p className="text-slate-500 font-medium">Wheat Problem Diagnostic & Guidance</p>
          </div>
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
            <Activity size={32} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Comparison: Healthy vs Affected */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Info className="text-blue-500" /> Compare Symptoms
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border-2 border-emerald-400 relative group">
            <img src={problem.healthyImage} alt="Healthy Wheat" className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex items-end p-4">
              <span className="text-white font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" /> Healthy Wheat
              </span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border-2 border-red-400 relative group">
            <img src={problem.image} alt={problem.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent flex items-end p-4">
              <span className="text-white font-bold text-lg flex items-center gap-2">
                <ShieldAlert className="text-red-400" /> Affected by {problem.name}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-bold text-slate-700 mb-3">👀 What you may see:</h3>
          <ul className="space-y-2">
            {problem.symptoms.map((symp, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-600">
                <ChevronRight size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{symp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Causes */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Why does this happen?</h2>
        <div className="flex flex-wrap gap-3">
          {problem.causes.map((cause, i) => (
            <span key={i} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200">
              {cause}
            </span>
          ))}
        </div>
      </div>

      {/* Immediate Treatment */}
      <div className="bg-emerald-50 rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-100 mb-6">
        <h2 className="text-xl font-bold text-emerald-800 mb-4">What should you do? (Treatment)</h2>
        <ul className="space-y-3">
          {problem.treatment.primary.map((t, i) => (
            <li key={i} className="flex items-start gap-3 text-emerald-900 bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
              <span className="bg-emerald-200 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0">{i+1}</span>
              <span className="font-medium">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chemical Options */}
      {problem.treatment.chemical && problem.treatment.chemical.length > 0 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FlaskConical className="text-purple-500" /> Chemical / Fungicide Options
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-600 ml-2">
            {problem.treatment.chemical.map((chem, i) => (
              <li key={i}>{chem}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Fertilizer Guidance (Core Logic) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-slate-200 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Sprout size={100} />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-6">FERTILIZER GUIDANCE</h2>
        
        <div className="mb-6">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2">Fertilizer Status</span>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold ${getStatusColor(problem.fertilizer.status)}`}>
            <span>{getStatusDot(problem.fertilizer.status)}</span>
            {problem.fertilizer.status}
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          {problem.fertilizer.recommendation.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={20} className="text-slate-400 shrink-0" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Management / Prevention */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Prevention & Management</h2>
        <ul className="space-y-2">
          {problem.management.map((mgt, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-600">
              <ChevronRight size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <span>{mgt}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
