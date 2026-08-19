import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Wind, Droplets, Sun, Sunrise, Sunset, 
  ThermometerSun, Eye, AlertTriangle, RefreshCw,
  Navigation, Map as MapIcon, Info, CloudLightning,
  Cloud, CloudFog, ThermometerSnowflake, Activity, Leaf
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line, ReferenceLine
} from 'recharts';

// --- MOCK DATA ---
const MOCK_DATA = {
  current: {
    location: "Greater Noida",
    region: "Uttar Pradesh, India",
    temp: 33,
    condition: "Overcast",
    feelsLike: 41,
    windSpeed: 5,
    windDir: "NNW",
    windDeg: 340,
    humidity: 66,
    pressure: 982,
    visibility: 8.6,
    dewPoint: 25,
    clouds: 95,
  },
  hourly: [
    { time: '11:00', temp: 33 }, { time: '14:00', temp: 33 }, 
    { time: '17:00', temp: 29 }, { time: '20:00', temp: 27 },
    { time: '23:00', temp: 27 }, { time: '02:00', temp: 26 },
    { time: '05:00', temp: 26 }, { time: '08:00', temp: 29 },
    { time: '11:00', temp: 32 }, { time: '14:00', temp: 33 },
    { time: '17:00', temp: 32 }, { time: '20:00', temp: 28 },
    { time: '23:00', temp: 27 }, { time: '02:00', temp: 26 },
  ],
  forecast15: [
    { day: 'Today', date: '19 Aug', icon: 'storm', min: 27, max: 33, rain: 51, wind: 9 },
    { day: 'Thu', date: '20 Aug', icon: 'storm', min: 27, max: 33, rain: 73, wind: 7 },
    { day: 'Fri', date: '21 Aug', icon: 'storm', min: 25, max: 32, rain: 82, wind: 11 },
    { day: 'Sat', date: '22 Aug', icon: 'storm', min: 25, max: 33, rain: 78, wind: 13 },
    { day: 'Sun', date: '23 Aug', icon: 'storm', min: 25, max: 32, rain: 73, wind: 7 },
    { day: 'Mon', date: '24 Aug', icon: 'rain', min: 26, max: 32, rain: 47, wind: 5 },
    { day: 'Tue', date: '25 Aug', icon: 'rain', min: 27, max: 33, rain: 49, wind: 8 },
    { day: 'Wed', date: '26 Aug', icon: 'rain', min: 25, max: 32, rain: 39, wind: 7 },
    { day: 'Thu', date: '27 Aug', icon: 'storm', min: 26, max: 33, rain: 45, wind: 7 },
    { day: 'Fri', date: '28 Aug', icon: 'storm', min: 27, max: 30, rain: 39, wind: 9 },
    { day: 'Sat', date: '29 Aug', icon: 'rain', min: 26, max: 33, rain: 45, wind: 9 },
    { day: 'Sun', date: '30 Aug', icon: 'rain', min: 27, max: 31, rain: 47, wind: 7 },
    { day: 'Mon', date: '31 Aug', icon: 'storm', min: 25, max: 28, rain: 58, wind: 14 },
    { day: 'Tue', date: '1 Sept', icon: 'storm', min: 26, max: 30, rain: 78, wind: 20 },
    { day: 'Wed', date: '2 Sept', icon: 'storm', min: 26, max: 30, rain: 67, wind: 17 },
  ],
  sun: { rise: '05:51', set: '18:55', currentProgress: 60 },
  uv: { current: 7.0, max: 7.3, level: 'High' },
  aqi: { value: 97, level: 'Very Poor', pm25: 69.6, pm10: 185.8, o3: 200, no2: 10 },
  pollen: { grass: 'Low', birch: 'Low', alder: 'Low' },
  precipitation: { today: 4.3, chance: 51, tomorrow: 4.6, tomorrowChance: 73 },
  alerts: { status: 'All Clear', message: 'No active weather warnings for this location.' }
};

// --- HELPER COMPONENTS ---

const WeatherIcon = ({ type, size = 24, className = "" }) => {
  switch(type) {
    case 'storm': return <CloudLightning size={size} className={`text-slate-500 ${className}`} />;
    case 'rain': return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
    case 'cloudy': return <Cloud size={size} className={`text-slate-400 ${className}`} />;
    case 'fog': return <CloudFog size={size} className={`text-slate-300 ${className}`} />;
    default: return <Sun size={size} className={`text-amber-500 ${className}`} />;
  }
};

const Card = ({ children, className = "", title, icon: Icon }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 ${className}`}>
    {title && (
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {title}
      </h3>
    )}
    {children}
  </div>
);

// --- MAIN COMPONENTS ---

export default function Weather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading weather intelligence...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Weather Intelligence</h1>
          <p className="text-slate-500">Professional agricultural forecast & analytics</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: 15-Day Forecast */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="15-Day Forecast" icon={Calendar} className="h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            <div className="space-y-4">
              {data.forecast15.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="w-16">
                    <div className="font-bold text-slate-800 text-sm">{day.day}</div>
                    <div className="text-xs text-slate-500">{day.date}</div>
                  </div>
                  <WeatherIcon type={day.icon} size={20} />
                  <div className="flex flex-col items-end w-12">
                    <span className="text-xs font-bold text-blue-500 flex items-center gap-1"><Droplets size={10}/> {day.rain}%</span>
                    <span className="text-xs text-slate-400">{day.wind} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 w-32 justify-end">
                    <span className="text-sm font-medium text-slate-500">{day.min}°</span>
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                       {/* Mock temperature bar visualization */}
                       <div className="absolute top-0 bottom-0 left-[10%] right-[20%] bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{day.max}°</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Widget */}
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-20 -top-20 opacity-40">
               <Cloud size={300} className="text-slate-300 drop-shadow-2xl" />
            </div>
            
            <div className="relative z-10">
              <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Now</div>
              <h2 className="text-3xl font-bold">{data.current.location}</h2>
              <p className="text-slate-400 text-sm mb-8">{data.current.region}</p>
              
              <div className="absolute top-0 right-0 text-right">
                <div className="text-7xl font-bold tracking-tighter text-blue-300 drop-shadow-lg">
                  {data.current.temp}°<span className="text-4xl text-slate-400">C</span>
                </div>
                <div className="text-lg font-medium mt-2">{data.current.condition}</div>
                <div className="text-sm text-slate-400">Feels like {data.current.feelsLike}°C</div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-12">
                {[
                  { icon: Wind, label: 'Wind', value: `${data.current.windSpeed} km/h`, sub: data.current.windDir },
                  { icon: Droplets, label: 'Humidity', value: `${data.current.humidity}%` },
                  { icon: Activity, label: 'Pressure', value: `${data.current.pressure} hPa` },
                  { icon: Eye, label: 'Visibility', value: `${data.current.visibility} km` },
                  { icon: ThermometerSnowflake, label: 'Dew Point', value: `${data.current.dewPoint}°C` },
                  { icon: Cloud, label: 'Clouds', value: `${data.current.clouds}%` },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-2">
                      <item.icon size={12} /> {item.label}
                    </div>
                    <div className="font-bold text-sm">
                      {item.value} <span className="text-xs font-normal text-slate-400">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next 48 Hours Chart & Wind */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Next 48 Hours" className="md:col-span-2">
              <div className="h-[200px] w-full mt-4">
                <ResponsiveContainer>
                  <AreaChart data={data.hourly} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                      itemStyle={{ color: '#60a5fa' }} 
                    />
                    <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Wind" icon={Navigation} className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center">
                <div className="absolute top-1 text-xs font-bold text-slate-400">N</div>
                <div className="absolute bottom-1 text-xs font-bold text-slate-400">S</div>
                <div className="absolute left-1 text-xs font-bold text-slate-400">W</div>
                <div className="absolute right-1 text-xs font-bold text-slate-400">E</div>
                
                {/* Wind direction indicator */}
                <div 
                  className="absolute w-1 h-14 bg-blue-500 rounded-full origin-bottom"
                  style={{ transform: `rotate(${data.current.windDeg}deg) translateY(-50%)` }}
                ></div>
                
                <div className="bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center z-10 shadow-sm border border-slate-100">
                  <span className="font-bold text-xl leading-none">{data.current.windSpeed}</span>
                  <span className="text-[10px] text-slate-500 uppercase">km/h</span>
                </div>
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-600">
                From <span className="text-slate-800">{data.current.windDir}</span> · {data.current.windDeg}°
              </div>
            </Card>
          </div>

          {/* Grid of 6 smaller widgets */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            
            <Card title="Sun Cycle" icon={Sun}>
              <div className="relative h-24 mt-4 flex items-end justify-between px-2">
                {/* Arc path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path d="M 10 50 Q 50 -10 90 50" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 10 50 Q 50 -10 90 50" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="100 100" strokeDashoffset="40" />
                  <circle cx="50" cy="10" r="4" fill="#f59e0b" />
                </svg>
                <div className="text-xs font-bold text-slate-600 flex items-center gap-1 z-10 bg-white"><Sunrise size={14}/> {data.sun.rise}</div>
                <div className="text-xs font-bold text-slate-600 flex items-center gap-1 z-10 bg-white"><Sunset size={14}/> {data.sun.set}</div>
              </div>
            </Card>

            <Card title="UV Index" icon={ThermometerSun}>
              <div className="mt-2">
                <div className="text-3xl font-bold text-slate-800">{data.uv.current} <span className="text-lg text-amber-500">{data.uv.level}</span></div>
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 mt-4 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-4 bg-white border-2 border-slate-800 rounded-sm" style={{ left: `${(data.uv.current / 11) * 100}%` }}></div>
                </div>
                <div className="text-xs text-slate-500 mt-3 font-medium">Max today: {data.uv.max}</div>
              </div>
            </Card>

            <Card title="Air Quality" icon={Wind}>
              <div className="mt-2">
                <div className="text-3xl font-bold text-slate-800">{data.aqi.value} <span className="text-lg text-red-500">{data.aqi.level}</span></div>
                <p className="text-xs text-slate-500 mt-1 mb-4">Avoid outdoor activity.</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">PM2.5</span> <span className="font-bold">{data.aqi.pm25}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">PM10</span> <span className="font-bold">{data.aqi.pm10}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">O₃</span> <span className="font-bold">{data.aqi.o3}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">NO₂</span> <span className="font-bold">{data.aqi.no2}</span></div>
                </div>
              </div>
            </Card>

            <Card title="Pollen" icon={Leaf}>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-sm font-semibold text-slate-700">Grass</span>
                  <span className="text-slate-400">—</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-sm font-semibold text-slate-700">Birch</span>
                  <span className="text-slate-400">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700">Alder</span>
                  <span className="text-slate-400">—</span>
                </div>
              </div>
            </Card>

            <Card title="Precipitation" icon={Droplets}>
              <div className="mt-2">
                <div className="text-3xl font-bold text-slate-800">{data.precipitation.today} <span className="text-sm font-medium text-slate-500">mm today</span></div>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-slate-600">Chance of rain: <span className="font-bold text-slate-800">{data.precipitation.chance}%</span></p>
                  <p className="text-xs text-slate-400">Tomorrow: {data.precipitation.tomorrow} mm · {data.precipitation.tomorrowChance}%</p>
                </div>
              </div>
            </Card>

            <Card title="Severe Alerts" icon={AlertTriangle} className="border-emerald-200 bg-emerald-50/30">
              <div className="mt-2">
                <div className="text-2xl font-bold text-emerald-600 mb-2">{data.alerts.status}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{data.alerts.message}</p>
              </div>
            </Card>

          </div>

          {/* Interactive Map Placeholder */}
          <Card className="p-0 overflow-hidden relative h-[400px]">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 text-white p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-xl max-w-sm">
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><MapIcon size={18}/> Interactive Weather Map</h3>
              <p className="text-xs text-slate-300">Live radar, satellite & atmospheric layers powered by AgriPulse Insights.</p>
              
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button className="whitespace-nowrap px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold">Radar</button>
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors">Satellite</button>
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors">Wind</button>
                <button className="whitespace-nowrap px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors">Temp</button>
              </div>
            </div>
            
            {/* Map Placeholder Image/Gradient */}
            <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-white rounded-full relative z-10 border-2 border-blue-500"></div>
                <div className="mt-2 bg-slate-900/80 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  Greater Noida • {data.precipitation.today} mm
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-4">
               <button className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-slate-200 shrink-0">
                 <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-slate-900 border-b-4 border-b-transparent ml-1"></div>
               </button>
               <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                 <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
               </div>
            </div>
          </Card>

        </div>
      </div>
      
      <div className="text-center text-xs text-slate-400 mt-8">
        Weather data adapted for AgriPulse Precision Farming
      </div>
    </div>
  );
}
