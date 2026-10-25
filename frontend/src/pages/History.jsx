// Updated: 2026-10-25
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, ShieldCheck, Bug, Sprout, Search } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();

  const historyItems = [
    {
      id: 'ANA-1792484400',
      crop: 'Wheat',
      diagnosis: 'Yellow Rust',
      category: 'Disease',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      confidence: 87,
      date: '20 Oct 2026',
      time: '11:45 AM',
      thumb: '/images/yellow_rust_thumb.jpg',
      treatment: 'Tilt 25 EC (Propiconazole @ 0.1%)'
    },
    {
      id: 'ANA-1792052400',
      crop: 'Wheat',
      diagnosis: 'Aphids',
      category: 'Pest',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      confidence: 78,
      date: '15 Oct 2026',
      time: '02:30 PM',
      thumb: '/images/problems/insects.jpg',
      treatment: 'Imidacloprid 17.8 SL @ 0.5ml/L'
    },
    {
      id: 'ANA-1791620400',
      crop: 'Wheat',
      diagnosis: 'Healthy Crop',
      category: 'Healthy',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      confidence: 92,
      date: '10 Oct 2026',
      time: '09:15 AM',
      thumb: '/images/problems/all_good.jpg',
      treatment: 'Optimal growth conditions. Maintain scheduled irrigation.'
    },
    {
      id: 'ANA-1791188400',
      crop: 'Wheat',
      diagnosis: 'Brown Rust',
      category: 'Disease',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      confidence: 64,
      date: '05 Oct 2026',
      time: '04:10 PM',
      thumb: '/images/problems/spots.jpg',
      treatment: 'Mancozeb 75 WP @ 2g/L'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Diagnostic Analysis History</h1>
          <p className="text-sm text-slate-500 mt-1">Past visual screenings, model predictions, and validated treatments</p>
        </div>

        <button
          onClick={() => navigate('/crop-analysis')}
          className="bg-[#E8592A] hover:bg-[#D44A1E] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>New Analysis</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-3.5">
        {historyItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate('/fertilizer-guide', { state: { rootCause: item.diagnosis } })}
            className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-sm hover:shadow-md hover:border-orange-200 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.thumb}
                alt={item.diagnosis}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#E8592A] transition-colors">
                    {item.crop} - {item.diagnosis}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Treatment: <span className="font-semibold text-slate-700">{item.treatment}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Scan ID: {item.id} • {item.date} at {item.time}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right">
                <span className="text-sm font-black text-slate-900">{item.confidence}%</span>
                <p className="text-[10px] text-slate-400 font-medium">Confidence Score</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#FFF0EB] group-hover:text-[#E8592A] text-slate-400 flex items-center justify-center transition-colors">
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
