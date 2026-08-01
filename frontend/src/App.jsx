import React, { useState, useEffect } from 'react';
import { Leaf, Droplet, Activity, ToggleLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './index.css';

const API_URL = '/api';

const gaugeData = [
  { name: 'Dry', value: 33.33, color: '#d97743' },
  { name: 'Optimal', value: 33.33, color: '#3b8b66' },
  { name: 'Wet', value: 33.33, color: '#275d44' },
];

function App() {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [duration, setDuration] = useState('1 Hr');
  
  const [moisture, setMoisture] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [pumpStatus, setPumpStatus] = useState(false);

  // Fetch initial state and trend
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

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
      fetchData(); // Refresh UI
    } catch (error) {
      console.error("Error updating controls:", error);
    }
  };

  const handleAutoToggle = () => {
    const newVal = !isAutoMode;
    setIsAutoMode(newVal);
    updateControl({ isAutoMode: newVal });
  };

  const handleManualToggle = () => {
    const newVal = !isManualOverride;
    setIsManualOverride(newVal);
    let updates = { isManualOverride: newVal };
    
    if (newVal) {
      // If manual is turned ON, turn auto OFF and pump ON
      setIsAutoMode(false);
      setPumpStatus(true);
      updates.isAutoMode = false;
      updates.pumpIsOn = true;
    } else {
      // If manual turned OFF, turn pump OFF
      setPumpStatus(false);
      updates.pumpIsOn = false;
    }
    updateControl(updates);
  };

  const handleDurationChange = (e) => {
    const val = e.target.value;
    setDuration(val);
    updateControl({ overrideDurationHours: parseInt(val) });
  };

  const RADIAN = Math.PI / 180;
  const cx = 150;
  const cy = 130;
  const iR = 90;
  const oR = 110;

  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    data.forEach((v) => { total += v.value; });
    const ang = 180.0 * (1 - value / 100);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
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

  return (
    <div>
      <nav className="topbar">
        <div className="brand">
          <Leaf color="var(--green-primary)" size={24} />
          AGRI-MOIST SOIL DASHBOARD
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="nav-links">
            <span style={{ color: 'var(--green-primary)' }}>Overview</span>
            <span>Fields</span>
            <span>Sensors</span>
            <span>Settings</span>
          </div>
          <div className="user-profile">
            <div className="avatar">JD</div>
            John Doe
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="welcome-text">
          <b>Welcome back, John!</b> | <span>Live System Status</span>
        </div>

        <div className="dashboard-grid">
          <div>
            <div className="card" style={{ height: '320px' }}>
              <div className="card-header">
                <Droplet color="var(--green-dark)" size={18} fill="var(--green-dark)" />
                Soil Moisture Overview
              </div>
              
              <div className="gauge-wrapper">
                <div style={{ width: '100%', height: '150px' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={gaugeData}
                        cx={cx}
                        cy={cy}
                        innerRadius={iR}
                        outerRadius={oR}
                        fill="#8884d8"
                        stroke="none"
                      >
                        {gaugeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      {needle(moisture, gaugeData, cx, cy, iR, oR, '#333')}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="gauge-labels">
                  <span>Dry</span>
                  <span className="optimal">Optimal</span>
                  <span>Wet</span>
                </div>
                
                <div className="moisture-value">{moisture}%</div>
                <div className="moisture-status">
                  {moisture < 40 ? 'DRY' : moisture > 60 ? 'WET' : 'OPTIMAL'}
                </div>
                
                <div className="gauge-footer">
                  Current Moisture
                  <span>Field 1 - South Plot</span>
                </div>
              </div>
            </div>

            <div className="small-card">
              <div className="small-card-left">
                <div className="icon-box yellow">
                  <Droplet size={18} />
                </div>
                <div>
                  <div className="small-card-title">Field 2</div>
                  <div className="small-card-subtitle">Field 1</div>
                </div>
              </div>
              <div className="small-card-value">45% - Needs Attention</div>
            </div>

            <div className="small-card">
              <div className="small-card-left">
                <div className="icon-box green">
                  <Droplet size={18} fill="var(--green-primary)" />
                </div>
                <div>
                  <div className="small-card-title">Field 3</div>
                  <div className="small-card-subtitle">Field 3</div>
                </div>
              </div>
              <div className="small-card-value">72% - Wet</div>
            </div>
          </div>

          <div className="card" style={{ height: '516px' }}>
            <div className="card-header">
              <Activity color="var(--green-primary)" size={18} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                Moisture Trend - Live Updates - Field 1
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>Field 1</span>
              </div>
            </div>
            
            <div style={{ width: '100%', height: '400px', marginTop: '1rem' }}>
              <ResponsiveContainer>
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#666'}} axisLine={false} tickLine={false} />
                  <YAxis 
                    domain={[0, 100]} 
                    tickCount={11} 
                    tick={{fontSize: 12, fill: '#666'}} 
                    axisLine={false} 
                    tickLine={false} 
                    label={{ value: 'Moisture % (0-100)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#666' }}
                  />
                  <Tooltip />
                  <Area 
                    type="linear" 
                    dataKey="moisture" 
                    stroke="var(--green-dark)" 
                    strokeWidth={2}
                    fill="var(--green-light)" 
                    fillOpacity={0.6}
                    dot={{ r: 4, fill: 'var(--green-dark)', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ height: 'fit-content' }}>
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <ToggleLeft color="var(--green-dark)" size={18} fill="var(--green-dark)" />
              PUMP CONTROL - Field 1
            </div>

            <div className="pump-status-text" style={{ color: pumpStatus ? 'var(--green-primary)' : 'var(--text-muted)' }}>
              Status: Water Pump is {pumpStatus ? 'ON (Running)' : 'OFF'}
            </div>

            <div className="switch-container">
              <span className="switch-label">AUTOMATIC IRRIGATION</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isAutoMode} 
                  onChange={handleAutoToggle} 
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="switch-container">
              <span className="switch-label">PUMP MANUAL OVERRIDE</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isManualOverride} 
                  onChange={handleManualToggle} 
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="override-row">
              <div>
                Override Duration: 
                <select 
                  value={duration} 
                  onChange={handleDurationChange}
                  style={{ marginLeft: '5px', padding: '2px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option>1 Hr</option>
                  <option>2 Hr</option>
                  <option>3 Hr</option>
                </select>
              </div>
              <span className="start-btn" onClick={() => !pumpStatus && handleManualToggle()}>
                {pumpStatus ? '[PUMP RUNNING]' : '[START PUMP]'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
