import React, { useState, useEffect } from 'react';
import { Leaf, Droplet, Activity, Settings, Cpu, Map, Power, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './index.css';

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

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [duration, setDuration] = useState('1 Hr');
  
  const [moisture, setMoisture] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [timeAgoStr, setTimeAgoStr] = useState('Waiting for data...');

  // Fetch initial state and trend
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update "Time ago" string every second
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

  const renderOverview = () => (
    <div className="dashboard-grid">
      <div>
        <div className="card" style={{ height: '360px', marginBottom: '1.5rem' }}>
          <div className="card-header">
            <div className="card-icon"><Droplet size={20} /></div>
            Soil Moisture Overview
          </div>
          
          <div className="gauge-wrapper">
            <div style={{ width: '100%', height: '150px' }}>
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
                  {needle(moisture, gaugeData, cx, cy, iR, oR, isOnline ? '#0f172a' : '#94a3b8')}
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="moisture-value" style={{ color: isOnline ? 'var(--text-main)' : 'var(--text-light)' }}>
              {isOnline ? `${moisture}%` : '--'}
            </div>
            <div className={`moisture-status ${!isOnline ? 'offline' : moisture < 40 ? 'dry' : moisture > 60 ? 'wet' : 'active'}`}>
              {!isOnline ? 'SENSOR DISCONNECTED' : moisture < 40 ? 'DRY' : moisture > 60 ? 'WET' : 'OPTIMAL'}
            </div>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Monitoring: <b>Field 1 (South Plot)</b>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div className={`pulse-dot ${!isOnline ? 'offline' : ''}`}></div>
             <div>
               <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>System Status</div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{timeAgoStr}</div>
             </div>
           </div>
        </div>
      </div>

      <div>
        <div className="card" style={{ height: 'fit-content', marginBottom: '1.5rem' }}>
          <div className="card-header">
            <div className="card-icon" style={{ background: pumpStatus ? 'var(--primary-light)' : '#f1f5f9', color: pumpStatus ? 'var(--primary)' : 'var(--text-muted)' }}>
              <Power size={20} />
            </div>
            Premium Motor Control
          </div>

          <div className="control-group">
            <div className="control-info">
              <span className="control-title">Smart Auto-Irrigation</span>
              <span className="control-desc">AI-driven watering based on moisture thresholds.</span>
            </div>
            <label className="premium-switch">
              <input type="checkbox" checked={isAutoMode} onChange={handleAutoToggle} />
              <span className="premium-slider"></span>
            </label>
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Manual Override</span>
               <span className={`status-badge ${pumpStatus ? 'active' : 'inactive'}`}>
                  {pumpStatus ? 'PUMP RUNNING' : 'PUMP OFF'}
               </span>
            </div>
            
            <button 
              className={`motor-btn ${pumpStatus ? 'on' : 'off'}`} 
              onClick={handleManualToggle}
            >
              <Power size={22} />
              {pumpStatus ? 'TAP TO TURN OFF MOTOR' : 'TAP TO START MOTOR'}
            </button>
          </div>
        </div>

        <div className="card" style={{ height: '360px' }}>
          <div className="card-header">
            <div className="card-icon"><Activity size={20} /></div>
            Live Moisture Trend
          </div>
          
          <div style={{ width: '100%', height: '260px', marginTop: '1rem' }}>
            <ResponsiveContainer>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Area type="monotone" dataKey="moisture" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFields = () => (
    <div className="grid-view">
      <div className="card">
         <div className="card-header"><Map size={18}/> Field 1 (South Plot)</div>
         <div className="moisture-value" style={{ fontSize: '2rem' }}>{moisture}%</div>
         <p style={{marginTop:'0.5rem', fontSize:'0.85rem'}}>Crop: Tomatoes <br/> Status: {isOnline ? 'Active' : 'Offline'}</p>
      </div>
      <div className="card" style={{ opacity: 0.7 }}>
         <div className="card-header"><Map size={18}/> Field 2 (North Plot)</div>
         <div className="moisture-value" style={{ fontSize: '2rem' }}>45%</div>
         <p style={{marginTop:'0.5rem', fontSize:'0.85rem'}}>Crop: Corn <br/> Status: Scheduled</p>
      </div>
      <div className="card" style={{ opacity: 0.7 }}>
         <div className="card-header"><Map size={18}/> Field 3 (Greenhouse)</div>
         <div className="moisture-value" style={{ fontSize: '2rem' }}>72%</div>
         <p style={{marginTop:'0.5rem', fontSize:'0.85rem'}}>Crop: Bell Peppers <br/> Status: Optimal</p>
      </div>
    </div>
  );

  const renderSensors = () => (
    <div className="card">
       <div className="card-header"><Cpu size={20}/> Connected Hardware (IoT Nodes)</div>
       <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
         <table className="premium-table">
           <thead>
             <tr>
               <th>Sensor ID</th>
               <th>Location</th>
               <th>Status</th>
               <th>Battery</th>
               <th>Action (Frontend Toggle)</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td><strong>ESP-8266-A1</strong><br/><span style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>MAC: 84:F3:EB:X3</span></td>
               <td>Field 1</td>
               <td><span className={`status-badge ${isOnline ? 'active' : 'inactive'}`}><CheckCircle2 size={12}/> {isOnline ? 'Online' : 'Offline'}</span></td>
               <td>98% 🔋</td>
               <td>
                 <label className="premium-switch">
                    <input type="checkbox" checked={true} readOnly />
                    <span className="premium-slider"></span>
                 </label>
               </td>
             </tr>
             <tr>
               <td><strong>ESP-8266-B2</strong><br/><span style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>MAC: 2C:F4:32:11</span></td>
               <td>Field 2</td>
               <td><span className="status-badge inactive"><AlertCircle size={12}/> Standby</span></td>
               <td>45% 🔋</td>
               <td>
                 <label className="premium-switch">
                    <input type="checkbox" checked={false} readOnly />
                    <span className="premium-slider"></span>
                 </label>
               </td>
             </tr>
           </tbody>
         </table>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="card" style={{ maxWidth: '600px' }}>
       <div className="card-header"><Settings size={20}/> System Preferences</div>
       <div style={{ marginTop: '1.5rem' }}>
          <div className="control-group">
            <div className="control-info">
              <span className="control-title">Push Notifications</span>
              <span className="control-desc">Receive alerts when moisture drops below 30%</span>
            </div>
            <label className="premium-switch">
              <input type="checkbox" defaultChecked />
              <span className="premium-slider"></span>
            </label>
          </div>
          <div className="control-group">
            <div className="control-info">
              <span className="control-title">Daily Reports</span>
              <span className="control-desc">Send irrigation summary to email</span>
            </div>
            <label className="premium-switch">
              <input type="checkbox" />
              <span className="premium-slider"></span>
            </label>
          </div>
          <div className="control-group">
            <div className="control-info">
              <span className="control-title">Dark Mode</span>
              <span className="control-desc">Coming soon in next update</span>
            </div>
            <label className="premium-switch">
              <input type="checkbox" disabled />
              <span className="premium-slider"></span>
            </label>
          </div>
       </div>
    </div>
  );

  return (
    <div>
      <nav className="topbar">
        <div className="brand">
          <Leaf className="brand-icon" size={28} />
          <span>AGRI-MOIST</span>
        </div>
        
        <div className="nav-links">
          <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</div>
          <div className={`nav-item ${activeTab === 'fields' ? 'active' : ''}`} onClick={() => setActiveTab('fields')}>Fields</div>
          <div className={`nav-item ${activeTab === 'sensors' ? 'active' : ''}`} onClick={() => setActiveTab('sensors')}>Sensors</div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</div>
        </div>

        <div className="user-profile">
          <div className="avatar">JD</div>
          John Doe
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'fields' && 'Field Management'}
              {activeTab === 'sensors' && 'Hardware Sensors'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="page-subtitle">Monitor and control your smart agriculture system</p>
          </div>
          {activeTab === 'overview' && (
            <div className="live-indicator">
               <RefreshCw size={14} className={isOnline ? 'pulse-dot' : ''} style={{ background: 'none' }} color={isOnline ? 'var(--success)' : 'var(--danger)'} />
               {isOnline ? 'System Live' : 'Disconnected'}
            </div>
          )}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'fields' && renderFields()}
        {activeTab === 'sensors' && renderSensors()}
        {activeTab === 'settings' && renderSettings()}
        
      </main>
    </div>
  );
}

export default App;
