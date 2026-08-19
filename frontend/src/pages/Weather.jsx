import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Wind, Droplets, Sun, Sunrise, Sunset, 
  ThermometerSun, Eye, Navigation, AlertTriangle, 
  Calendar, Clock, CheckCircle2, ChevronDown, RefreshCw, BarChart2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart 
} from 'recharts';

// --- Mock Data Service ---
const MOCK_WEATHER_DATA = {
  current: {
    temp: 28,
    condition: 'Partly Cloudy',
    feelsLike: 30,
    humidity: 65,
    windSpeed: 12,
    windDir: 'NE',
    rainProb: 20,
    pressure: 1012,
    visibility: 10,
    uvIndex: 6,
    cloudCover: 40,
    sunrise: '06:15 AM',
    sunset: '06:45 PM',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  hourly: Array.from({ length: 24 }).map((_, i) => ({
    time: `${(i + new Date().getHours()) % 24}:00`,
    temp: 25 + Math.floor(Math.random() * 8),
    rainProb: Math.floor(Math.random() * 40),
    wind: 5 + Math.floor(Math.random() * 15),
    condition: ['Sunny', 'Cloudy', 'Rain'][Math.floor(Math.random() * 3)]
  })),
  forecast: Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      min: 20 + Math.floor(Math.random() * 5),
      max: 28 + Math.floor(Math.random() * 8),
      rainProb: Math.floor(Math.random() * 80),
      wind: 10 + Math.floor(Math.random() * 10),
      condition: ['Sunny', 'Partly Cloudy', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)]
    };
  }),
  historical: Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 7 + i);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      min: 19 + Math.floor(Math.random() * 4),
      max: 26 + Math.floor(Math.random() * 6),
      rainfall: Math.floor(Math.random() * 15),
      humidity: 50 + Math.floor(Math.random() * 40),
      wind: 8 + Math.floor(Math.random() * 12),
      condition: ['Clear', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 3)]
    };
  })
};

// --- Components ---

const WeatherIcon = ({ condition, size = 24, className = "" }) => {
  if (condition.includes('Rain') || condition.includes('Thunderstorm')) return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
  if (condition.includes('Cloud')) return <CloudRain size={size} className={`text-slate-400 ${className}`} />;
  return <Sun size={size} className={`text-amber-500 ${className}`} />;
};

const CurrentWeatherHero = ({ data, onRefresh }) => (
  <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-10">
      <WeatherIcon condition={data.condition} size={200} />
    </div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <h2 className="text-emerald-100 font-medium mb-1 flex items-center gap-2">
          Current Weather
          <span className="text-xs bg-emerald-700/50 px-2 py-1 rounded-full backdrop-blur-sm">Farm Location</span>
        </h2>
        <div className="flex items-end gap-4 mt-4">
          <div className="text-7xl font-bold tracking-tighter">{data.temp}°<span className="text-4xl text-emerald-300">C</span></div>
          <div className="pb-2">
            <div className="text-xl font-medium">{data.condition}</div>
            <div className="text-emerald-200 text-sm">Feels like {data.feelsLike}°C</div>
          </div>
        </div>
      </div>
      <button onClick={onRefresh} className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm text-emerald-100">
        <RefreshCw size={16} /> Refresh
      </button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 relative z-10 border-t border-white/10 pt-8">
      <div className="flex items-center gap-3">
        <Droplets className="text-blue-300" size={24} />
        <div>
          <div className="text-xs text-emerald-200/80 uppercase tracking-wider font-semibold">Humidity</div>
          <div className="font-semibold text-lg">{data.humidity}%</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Wind className="text-slate-300" size={24} />
        <div>
          <div className="text-xs text-emerald-200/80 uppercase tracking-wider font-semibold">Wind</div>
          <div className="font-semibold text-lg">{data.windSpeed} km/h {data.windDir}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CloudRain className="text-blue-200" size={24} />
        <div>
          <div className="text-xs text-emerald-200/80 uppercase tracking-wider font-semibold">Rain Prob.</div>
          <div className="font-semibold text-lg">{data.rainProb}%</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThermometerSun className="text-amber-300" size={24} />
        <div>
          <div className="text-xs text-emerald-200/80 uppercase tracking-wider font-semibold">UV Index</div>
          <div className="font-semibold text-lg">{data.uvIndex}</div>
        </div>
      </div>
    </div>
  </div>
);

const HourlyForecast = ({ data }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
      <Clock size={18} className="text-emerald-600" /> Hourly Forecast
    </h3>
    <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-thin scrollbar-thumb-slate-200">
      {data.map((hour, i) => (
        <div key={i} className="flex flex-col items-center min-w-[80px] snap-center">
          <span className="text-sm font-medium text-slate-500 mb-3">{hour.time}</span>
          <WeatherIcon condition={hour.condition} size={28} className="mb-3" />
          <span className="text-lg font-bold text-slate-800">{hour.temp}°</span>
          <span className="text-xs text-blue-500 mt-2 flex items-center gap-1 font-semibold">
            <Droplets size={10} /> {hour.rainProb}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SevenDayForecast = ({ data }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
      <Calendar size={18} className="text-emerald-600" /> Next 7 Days Forecast
    </h3>
    <div className="space-y-4">
      {data.map((day, i) => (
        <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
          <div className="w-24 font-medium text-slate-700">{day.date}</div>
          <div className="flex items-center gap-3 w-32">
            <WeatherIcon condition={day.condition} size={24} />
            <span className="text-sm text-slate-500">{day.condition}</span>
          </div>
          <div className="w-16 text-right text-sm text-blue-500 font-semibold flex items-center justify-end gap-1">
             <Droplets size={12} /> {day.rainProb}%
          </div>
          <div className="flex items-center gap-2 w-32 justify-end">
            <span className="text-slate-500 font-medium">{day.min}°</span>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-blue-400 to-amber-400 w-full rounded-full"></div>
            </div>
            <span className="text-slate-800 font-bold">{day.max}°</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FarmWeatherInsights = ({ current, historical }) => {
  const avgTemp = historical.reduce((acc, curr) => acc + curr.max, 0) / historical.length;
  const totalRain = historical.reduce((acc, curr) => acc + curr.rainfall, 0);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 shadow-sm border border-emerald-100">
      <h3 className="font-bold text-emerald-800 mb-6 flex items-center gap-2">
        <Lightbulb size={18} className="text-amber-500" /> Farm Weather Insights
      </h3>
      <div className="space-y-4">
        {current.humidity > 60 && (
          <div className="flex gap-4 p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg h-fit"><Droplets size={20} /></div>
            <div>
              <h4 className="font-semibold text-slate-800">High humidity observed</h4>
              <p className="text-sm text-slate-600 mt-1">High moisture in the air <span className="font-semibold text-orange-600">may increase risk</span> of fungal diseases. Please monitor crops closely.</p>
            </div>
          </div>
        )}
        
        {totalRain > 20 ? (
          <div className="flex gap-4 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit"><CloudRain size={20} /></div>
            <div>
              <h4 className="font-semibold text-slate-800">Significant rainfall this week</h4>
              <p className="text-sm text-slate-600 mt-1">Total {totalRain}mm rain recorded. Soil moisture levels should be adequate, reducing immediate irrigation needs.</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg h-fit"><Sun size={20} /></div>
            <div>
              <h4 className="font-semibold text-slate-800">Low rainfall period</h4>
              <p className="text-sm text-slate-600 mt-1">Only {totalRain}mm rain over 7 days. This <span className="font-semibold text-amber-600">possible environmental stress</span> means you should check irrigation systems.</p>
            </div>
          </div>
        )}

        {avgTemp > 28 && (
          <div className="flex gap-4 p-4 bg-white rounded-xl border border-red-100 shadow-sm">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg h-fit"><ThermometerSun size={20} /></div>
            <div>
              <h4 className="font-semibold text-slate-800">High temperature conditions</h4>
              <p className="text-sm text-slate-600 mt-1">Sustained high temperatures may stress crops. Ensure adequate hydration.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Lightbulb = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path>
  </svg>
)

const PastWeatherAnalytics = ({ historical }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
      <BarChart2 size={18} className="text-emerald-600" /> Past 7 Days Historical Analytics
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Temp & Rain Trend */}
      <div>
        <h4 className="text-sm font-semibold text-slate-500 mb-4 text-center">Temperature & Rainfall Trend</h4>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historical} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar yAxisId="right" dataKey="rainfall" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
              <Line yAxisId="left" type="monotone" dataKey="max" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} name="Max Temp (°C)" />
              <Line yAxisId="left" type="monotone" dataKey="min" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} name="Min Temp (°C)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Humidity Trend */}
      <div>
         <h4 className="text-sm font-semibold text-slate-500 mb-4 text-center">Humidity Trend</h4>
         <div className="h-[250px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={historical} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
               <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
               <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
               <Area type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHumidity)" name="Humidity (%)" />
             </AreaChart>
           </ResponsiveContainer>
         </div>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

export default function Weather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = () => {
    setLoading(true);
    setError(null);
    // Simulate API Call
    setTimeout(() => {
      // Chance of simulating an error for robustness
      if (Math.random() > 0.95) {
        setError("Unable to connect to weather service. Please check your connection.");
      } else {
        setData(MOCK_WEATHER_DATA);
      }
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading weather intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-red-100 max-w-2xl mx-auto mt-12">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Weather Data Unavailable</h2>
        <p className="text-slate-500 mb-8">{error || "Failed to load weather data."}</p>
        <button onClick={fetchWeather} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors flex items-center gap-2 mx-auto">
          <RefreshCw size={20} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Weather Intelligence</h1>
        <p className="text-slate-500">Real-time forecasts and historical climate analytics for your farm</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Hero & Hourly) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <CurrentWeatherHero data={data.current} onRefresh={fetchWeather} />
          <HourlyForecast data={data.hourly} />
        </div>
        
        {/* Right Column (Insights) */}
        <div className="col-span-1 space-y-6">
          <FarmWeatherInsights current={data.current} historical={data.historical} />
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Navigation size={18} className="text-emerald-600" /> Advanced Details
             </h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-100">
                 <span className="text-slate-500 flex items-center gap-2"><Sunrise size={16} /> Sunrise</span>
                 <span className="font-semibold text-slate-800">{data.current.sunrise}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-100">
                 <span className="text-slate-500 flex items-center gap-2"><Sunset size={16} /> Sunset</span>
                 <span className="font-semibold text-slate-800">{data.current.sunset}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-100">
                 <span className="text-slate-500 flex items-center gap-2"><CloudRain size={16} /> Pressure</span>
                 <span className="font-semibold text-slate-800">{data.current.pressure} hPa</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-100">
                 <span className="text-slate-500 flex items-center gap-2"><Eye size={16} /> Visibility</span>
                 <span className="font-semibold text-slate-800">{data.current.visibility} km</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Forecast) */}
        <div className="col-span-1">
          <SevenDayForecast data={data.forecast} />
        </div>
        
        {/* Right Column (Historical Analytics) */}
        <div className="col-span-1 lg:col-span-2">
          <PastWeatherAnalytics historical={data.historical} />
        </div>
      </div>
    </div>
  );
}
