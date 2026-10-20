import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, CloudRain, CheckCircle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export default function Alerts() {
  const navigate = useNavigate();

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Soil Moisture Threshold Breached',
      time: 'Today, 10:30 AM',
      desc: 'Sensor in Field 1 reports moisture at 38% (below 40% threshold). Auto-irrigation pump standby.',
      actionText: 'Inspect Soil Sensors',
      actionLink: '/sensors'
    },
    {
      id: 2,
      type: 'info',
      title: 'Rain Expected in 2 Days (High Humidity Alert)',
      time: 'Today, 08:00 AM',
      desc: 'IMD forecast shows 80% chance of rain on Wednesday. Wet leaf canopy increases Yellow Rust spore germination.',
      actionText: 'View Weather Forecast',
      actionLink: '/weather'
    },
    {
      id: 3,
      type: 'success',
      title: 'Auto-Irrigation Pump Cycle Completed',
      time: 'Yesterday, 06:15 PM',
      desc: 'Field 1 pump ran for 25 minutes. Target moisture 62% restored successfully.',
      actionText: 'View Pump Logs',
      actionLink: '/sensors'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Alerts & Bulletins</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time IoT threshold warnings and agro-meteorological advisories</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
          <Bell size={13} className="text-rose-500 animate-bounce" />
          2 Active Warnings
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                alert.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                alert.type === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {alert.type === 'warning' ? <AlertTriangle size={22} /> :
                 alert.type === 'info' ? <CloudRain size={22} /> : <CheckCircle size={22} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{alert.title}</h3>
                  <span className="text-[11px] font-semibold text-slate-400">• {alert.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                  {alert.desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(alert.actionLink)}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-50 hover:bg-[#FDF0EB] hover:text-[#E8592A] text-slate-700 border border-slate-200/80 transition-all flex items-center gap-1.5 shrink-0 self-end sm:self-center"
            >
              <span>{alert.actionText}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
