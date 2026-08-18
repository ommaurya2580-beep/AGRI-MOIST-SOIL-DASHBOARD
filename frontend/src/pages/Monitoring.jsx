import React, { useState, useEffect } from 'react';
import { Droplet, Activity, Power, Map, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = '/api';

const gaugeData = [
  { name: 'Dry', value: 33.33, color: '#f59e0b' },
  { name: 'Optimal', value: 33.33, color: '#10b981' },
  { name: 'Wet', value: 33.33, color: '#3b82f6' },
];

const cx = 150;
const cy = 130;
const iR = 80;
const oR = 110;

const needle = (value, data, cx, cy, iR, oR, color) => {
  let total = 100;
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-ang * Math.PI / 180);
  const cos = Math.cos(-ang * Math.PI / 180);
  const r = 5;
  const x0 = cx;
  const y0 = cy;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <g>
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
      <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill={color} />
    </g>
  );
};

export default function Monitoring() {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [duration, setDuration] = useState('1 Hr');
  
  const [moisture, setMoisture] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [timeAgoStr, setTimeAgoStr] = useState('Waiting for data...');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isOnline) {
        setTimeAgoStr('Sensor Offline');
        return;
      }
      if (lastUpdateTime) {
        const seconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
        if (seconds < 2) setTimeAgoStr('Just now');
        else if (seconds < 60) setTimeAgoStr(`${seconds} seconds ago`);
        else setTimeAgoStr(`${Math.floor(seconds/60)} mins ago`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdateTime, isOnline]);

  const fetchData = async () => {
    try {
      const stateRes = await fetch(`${API_URL}/state`);
      const stateData = await stateRes.json();
      if (stateData.state) {
        setIsAutoMode(stateData.state.isAutoMode);
        setIsManualOverride(stateData.state.isManualOverride);
        setDuration(`${stateData.state.overrideDurationHours} Hr`);
        setPumpStatus(stateData.state.pumpIsOn);
      }
      setMoisture(stateData.currentMoisture || 0);
      
      const online = stateData.isOnline !== undefined ? stateData.isOnline : false;
      setIsOnline(online);
      
      if (online) {
        setLastUpdateTime(Date.now());
      }

      const trendRes = await fetch(`${API_URL}/trend`);
      const trendJson = await trendRes.json();
      
      const formattedTrend = trendJson.map(item => ({
        date: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        moisture: item.moistureLevel
      }));
      setTrendData(formattedTrend);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateControl = async (updates) => {
    try {
      await fetch(`${API_URL}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      fetchData();
    } catch (error) {
      console.error("Error updating control:", error);
    }
  };

  const handleAutoToggle = (e) => {
    const newVal = e.target.checked;
    setIsAutoMode(newVal);
    updateControl({ isAutoMode: newVal });
  };

  const handleManualToggle = () => {
    const newVal = !pumpStatus;
    setPumpStatus(newVal);
    updateControl({ pumpIsOn: newVal, isManualOverride: true });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Field Monitoring</h1>
        <p className="text-slate-500">Live IoT sensor data and automated irrigation control</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-3 font-semibold text-slate-800 mb-6 text-lg">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Droplet size={20} /></div>
              Soil Moisture Overview
            </div>
            
            <div className="relative flex flex-col items-center">
              <div className="w-full h-40">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      dataKey="value" startAngle={180} endAngle={0}
                      data={gaugeData} cx={cx} cy={cy} innerRadius={iR} outerRadius={oR}
                      stroke="none"
                    >
                      {gaugeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    {needle(moisture, gaugeData, cx, cy, iR, oR, isOnline ? '#1e293b' : '#94a3b8')}
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className={`text-5xl font-bold -mt-8 tracking-tighter ${isOnline ? 'text-slate-800' : 'text-slate-400'}`}>
                {isOnline ? `${moisture}%` : '--'}
              </div>
              <div className={`mt-2 px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase ${
                !isOnline ? 'bg-red-100 text-red-600' : 
                moisture < 40 ? 'bg-orange-100 text-orange-600' : 
                moisture > 60 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {!isOnline ? 'DISCONNECTED' : moisture < 40 ? 'DRY' : moisture > 60 ? 'WET' : 'OPTIMAL'}
              </div>
              
              <div className="mt-6 text-center text-sm text-slate-500">
                Monitoring: <b className="text-slate-700">Field 1 (South Plot)</b>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center gap-4">
             <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
             <div>
               <div className="text-sm font-semibold text-slate-800">System Status</div>
               <div className="text-xs text-slate-500">{timeAgoStr}</div>
             </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-3 font-semibold text-slate-800 mb-6 text-lg">
              <div className={`p-2 rounded-lg ${pumpStatus ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                <Power size={20} />
              </div>
              Premium Motor Control
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
              <div>
                <div className="font-semibold text-slate-800">Smart Auto-Irrigation</div>
                <div className="text-sm text-slate-500">AI-driven watering based on moisture thresholds.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isAutoMode} onChange={handleAutoToggle} />
                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <div className="flex justify-between items-center mb-4">
                 <span className="font-semibold text-slate-800">Manual Override</span>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${pumpStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {pumpStatus ? 'PUMP RUNNING' : 'PUMP OFF'}
                 </span>
              </div>
              
              <button 
                className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition-all ${
                  pumpStatus 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg shadow-slate-500/20'
                }`}
                onClick={handleManualToggle}
              >
                <Power size={22} />
                {pumpStatus ? 'TAP TO TURN OFF MOTOR' : 'TAP TO START MOTOR'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 font-semibold text-slate-800 mb-6 text-lg">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity size={20} /></div>
              Live Moisture Trend
            </div>
            
            <div className="w-full h-[260px]">
              <ResponsiveContainer>
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="moisture" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
