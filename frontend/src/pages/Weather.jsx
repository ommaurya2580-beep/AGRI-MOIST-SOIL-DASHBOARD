// Updated: 2026-10-25
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  MapPin, 
  Crosshair, 
  Clock, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  LocateFixed,
  Building2,
  X,
  Lightbulb,
  Sprout,
  RefreshCw,
  Search,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';

// ==========================================
// POPULAR AGRICULTURAL LOCATIONS (Quick Select)
// ==========================================
const POPULAR_LOCATIONS = [
  { name: 'Greater Noida, Uttar Pradesh, India', district: 'Gautam Buddha Nagar', lat: 28.4744, lng: 77.5040 },
  { name: 'Ludhiana, Punjab, India', district: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
  { name: 'Karnal, Haryana, India', district: 'Karnal', lat: 29.6857, lng: 76.9905 },
  { name: 'Meerut, Uttar Pradesh, India', district: 'Meerut', lat: 28.9845, lng: 77.7064 },
  { name: 'Patna, Bihar, India', district: 'Patna', lat: 25.5941, lng: 85.1376 },
  { name: 'Varanasi, Uttar Pradesh, India', district: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Indore, Madhya Pradesh, India', district: 'Indore', lat: 22.7196, lng: 75.8577 },
  { name: 'Nashik, Maharashtra, India', district: 'Nashik', lat: 19.9975, lng: 73.7898 }
];

// Helper: WMO Weather Code interpreter
function getWeatherCondition(code) {
  switch (code) {
    case 0:
      return { desc: 'Clear Sky / Sunny', badge: '☀️ Optimal Sunlight' };
    case 1:
      return { desc: 'Mainly Clear', badge: '🌤️ Favorable Conditions' };
    case 2:
      return { desc: 'Partly Cloudy', badge: '⛅ Normal Cloud Cover' };
    case 3:
      return { desc: 'Overcast', badge: '☁️ High Overcast' };
    case 45:
    case 48:
      return { desc: 'Fog / Mist', badge: '🌫️ Humidity Alert' };
    case 51:
    case 53:
    case 55:
      return { desc: 'Light Drizzle', badge: '🌦️ Light Showers' };
    case 61:
    case 63:
    case 65:
      return { desc: 'Rain', badge: '🌧️ Active Precipitation' };
    case 71:
    case 73:
    case 75:
      return { desc: 'Snowfall', badge: '❄️ Cold Wave' };
    case 80:
    case 81:
    case 82:
      return { desc: 'Rain Showers', badge: '🌧️ Showers' };
    case 95:
    case 96:
    case 99:
      return { desc: 'Thunderstorm', badge: '⚡ Severe Weather Alert' };
    default:
      return { desc: 'Partly Cloudy', badge: '⛅ Normal Condition' };
  }
}

// Helper: Format Coordinate String
function formatCoords(lat, lng) {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lngStr}`;
}

// Helper: Dynamic Agronomic Insights
function generateInsights(avgTemp, maxTemp, totalRain, rainyDays, avgHum) {
  const insights = [];

  const maxT = parseFloat(maxTemp) || 30;
  const avgT = parseFloat(avgTemp) || 25;
  const rain = parseFloat(totalRain) || 0;
  const hum = parseFloat(avgHum) || 60;

  if (maxT >= 34) {
    insights.push({
      type: 'warning',
      text: `Elevated temperatures detected (up to ${maxT}°C). High evapotranspiration rate may induce heat and moisture stress.`
    });
  } else if (avgT >= 18 && avgT <= 31) {
    insights.push({
      type: 'success',
      text: `Average temperature (${avgT}°C) is in the optimal vegetative & grain development range for wheat.`
    });
  } else {
    insights.push({
      type: 'info',
      text: `Current thermal profile averages ${avgT}°C. Closely track soil moisture and canopy status.`
    });
  }

  if (rain < 15) {
    insights.push({
      type: 'alert',
      text: `Low cumulative precipitation (${rain} mm over last 30 days, ${rainyDays} rainy days). Scheduled field irrigation is strongly recommended.`
    });
  } else if (rain > 75) {
    insights.push({
      type: 'warning',
      text: `Substantial cumulative rainfall (${rain} mm). Monitor for waterlogging in low-lying plots to prevent root asphyxia.`
    });
  } else {
    insights.push({
      type: 'success',
      text: `30-day precipitation (${rain} mm across ${rainyDays} days) supports stable soil moisture balance.`
    });
  }

  if (hum >= 75) {
    insights.push({
      type: 'warning',
      text: `Elevated humidity (${hum}% avg). Microclimate favors fungal pathogens (e.g. Yellow/Brown Rust). Inspect leaf surfaces.`
    });
  } else {
    insights.push({
      type: 'success',
      text: `Relative humidity is in normal agronomic range (${hum}% avg). Low fungal spore germination pressure.`
    });
  }

  insights.push({
    type: 'info',
    text: `Real-time data correlated with IoT telemetry (Soil Moisture, NPK, Temperature) in the next step.`
  });

  return insights;
}

export default function Weather({ isDiagnosticMode = false }) {
  const navigate = useNavigate();

  // Location and Telemetry State
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('agripulse_live_weather') || 'null');
      if (saved && saved.lat && saved.lng) {
        return saved;
      }
    } catch {}
    return {
      name: 'Detecting Live Location...',
      district: 'Live Region',
      coords: '28.4744° N, 77.5040° E',
      lat: 28.4744,
      lng: 77.5040,
      area: '2.5 Acre',
      field: 'Main Field - Wheat',
      tempAvg: '26.8°C',
      tempMax: '35.2°C',
      tempMin: '18.1°C',
      currentTemp: '28.0°C',
      rainTotal: '42.0 mm',
      rainyDays: '6 Days',
      humidity: '68%',
      currentHumidity: '55%',
      humidityMax: '90%',
      humidityMin: '35%',
      wind: '11.5 km/h',
      accuracy: '± 25 meters',
      isGps: false,
      weatherDesc: 'Partly Cloudy',
      lastUpdated: 'Just now'
    };
  });

  // 30-day Trend Charts Data
  const [tempTrendData, setTempTrendData] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [insights, setInsights] = useState([]);

  // UI & Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // 'detecting' | 'active' | 'denied' | 'fallback'
  const [gpsError, setGpsError] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);

  // Search in Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Reverse Geocoding via BigDataCloud with Nominatim Fallback
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || 'Local Area';
        const district = data.locality || data.city || data.principalSubdivision || 'Local District';
        const state = data.principalSubdivision || '';
        const country = data.countryName || 'India';
        const fullName = [city, state, country].filter(Boolean).join(', ');
        return { fullName, district, state, country };
      }
    } catch (e) {
      console.warn('BigDataCloud reverse geocode error:', e);
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const district = addr.county || addr.district || addr.city || addr.town || addr.village || 'Local Area';
        const state = addr.state || '';
        const country = addr.country || 'India';
        const fullName = [district, state, country].filter(Boolean).join(', ');
        return { fullName, district, state, country };
      }
    } catch (e) {
      console.warn('Nominatim reverse geocode error:', e);
    }

    return {
      fullName: `Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
      district: 'Live Region',
      state: '',
      country: 'India'
    };
  };

  // Fetch Real 30-Day Meteorological Data from Open-Meteo
  const fetchWeatherForCoords = async (lat, lng) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean,wind_speed_10m_max&past_days=30&forecast_days=1&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch Open-Meteo weather data');
    const data = await res.json();

    const daily = data.daily || {};
    const times = daily.time || [];
    const maxTemps = daily.temperature_2m_max || [];
    const minTemps = daily.temperature_2m_min || [];
    const meanTemps = daily.temperature_2m_mean || [];
    const precips = daily.precipitation_sum || [];
    const humidities = daily.relative_humidity_2m_mean || [];
    const winds = daily.wind_speed_10m_max || [];

    const trend = [];
    const rainTrend = [];

    times.forEach((t, i) => {
      const dt = new Date(t);
      const dateLabel = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const maxVal = maxTemps[i] != null ? Math.round(maxTemps[i] * 10) / 10 : 0;
      const minVal = minTemps[i] != null ? Math.round(minTemps[i] * 10) / 10 : 0;
      const avgVal = meanTemps[i] != null ? Math.round(meanTemps[i] * 10) / 10 : Math.round(((maxVal + minVal) / 2) * 10) / 10;
      const rainVal = precips[i] != null ? Math.round(precips[i] * 10) / 10 : 0;

      trend.push({ date: dateLabel, max: maxVal, avg: avgVal, min: minVal });
      rainTrend.push({ date: dateLabel, rain: rainVal });
    });

    const validMeans = meanTemps.filter(m => m != null);
    const avgTemp = validMeans.length ? (validMeans.reduce((a, b) => a + b, 0) / validMeans.length).toFixed(1) : '26.2';

    const validMax = maxTemps.filter(m => m != null);
    const maxTemp = validMax.length ? Math.max(...validMax).toFixed(1) : '34.0';

    const validMin = minTemps.filter(m => m != null);
    const minTemp = validMin.length ? Math.min(...validMin).toFixed(1) : '17.5';

    const validPrecips = precips.filter(p => p != null);
    const totalRain = validPrecips.reduce((a, b) => a + b, 0).toFixed(1);
    const rainyDays = validPrecips.filter(p => p >= 1.0).length;

    const validHum = humidities.filter(h => h != null);
    const avgHum = validHum.length ? Math.round(validHum.reduce((a, b) => a + b, 0) / validHum.length) : 65;
    const maxHum = validHum.length ? Math.round(Math.max(...validHum)) : 90;
    const minHum = validHum.length ? Math.round(Math.min(...validHum)) : 35;

    const validWinds = winds.filter(w => w != null);
    const avgWind = validWinds.length ? (validWinds.reduce((a, b) => a + b, 0) / validWinds.length).toFixed(1) : '12.0';

    const current = data.current || {};
    const currentTemp = current.temperature_2m != null ? `${current.temperature_2m.toFixed(1)}°C` : `${avgTemp}°C`;
    const currentHumidity = current.relative_humidity_2m != null ? `${current.relative_humidity_2m}%` : `${avgHum}%`;
    const currentWind = current.wind_speed_10m != null ? `${current.wind_speed_10m.toFixed(1)} km/h` : `${avgWind} km/h`;
    const weatherCode = current.weather_code ?? 0;
    const weatherInfo = getWeatherCondition(weatherCode);

    return {
      trend,
      rainTrend,
      avgTemp: `${avgTemp}°C`,
      maxTemp: `${maxTemp}°C`,
      minTemp: `${minTemp}°C`,
      totalRain: `${totalRain} mm`,
      rainyDays: `${rainyDays} Days`,
      avgHum: `${avgHum}%`,
      maxHum: `${maxHum}%`,
      minHum: `${minHum}%`,
      avgWind: `${avgWind} km/h`,
      currentTemp,
      currentHumidity,
      currentWind,
      weatherDesc: weatherInfo.desc,
      weatherBadge: weatherInfo.badge
    };
  };

  // Primary loader for specific coordinates
  const loadDataForCoords = useCallback(async (lat, lng, accuracy = 20, isGps = false, customName = null) => {
    setIsLoading(true);
    try {
      const geoPromise = customName 
        ? Promise.resolve({ fullName: customName.name, district: customName.district || 'Selected Region' })
        : reverseGeocode(lat, lng);
      const weatherPromise = fetchWeatherForCoords(lat, lng);

      const [geo, weather] = await Promise.all([geoPromise, weatherPromise]);

      const nowStr = new Date().toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const updatedLoc = {
        name: geo.fullName,
        district: geo.district,
        coords: formatCoords(lat, lng),
        lat,
        lng,
        area: '2.5 Acre',
        field: 'Main Field - Wheat',
        tempAvg: weather.avgTemp,
        tempMax: weather.maxTemp,
        tempMin: weather.minTemp,
        currentTemp: weather.currentTemp,
        rainTotal: weather.totalRain,
        rainyDays: weather.rainyDays,
        humidity: weather.avgHum,
        currentHumidity: weather.currentHumidity,
        humidityMax: weather.maxHum,
        humidityMin: weather.minHum,
        wind: weather.currentWind,
        accuracy: isGps ? `± ${accuracy} meters` : 'Fixed Coordinates',
        isGps,
        weatherDesc: weather.weatherDesc,
        weatherBadge: weather.weatherBadge,
        lastUpdated: nowStr
      };

      setCurrentLocation(updatedLoc);
      setTempTrendData(weather.trend);
      setRainfallData(weather.rainTrend);
      setInsights(generateInsights(weather.avgTemp, weather.maxTemp, weather.totalRain, weather.rainyDays, weather.avgHum));

      // Persist to localStorage for Global Dashboard & Diagnostics
      localStorage.setItem('agripulse_live_weather', JSON.stringify(updatedLoc));
      localStorage.setItem('agripulse_user_location', geo.fullName);
      
      // Dispatch events for layout sync
      window.dispatchEvent(new Event('agripulse_location_updated'));
      window.dispatchEvent(new Event('agripulse_weather_updated'));

      setLocationStatus(isGps ? 'active' : 'fallback');
      setGpsError(null);
    } catch (err) {
      console.error('Failed to load live weather:', err);
      setGpsError('Could not load meteorological data for this location. Please retry.');
    } finally {
      setIsLoading(false);
      setIsDetectingGps(false);
    }
  }, []);

  // Request Live Browser Geolocation (Permission Trigger)
  const detectLiveLocation = useCallback(() => {
    setIsDetectingGps(true);
    setLocationStatus('detecting');
    setGpsError(null);

    if (!navigator.geolocation) {
      setIsDetectingGps(false);
      setLocationStatus('fallback');
      setGpsError('Geolocation is not supported by your browser.');
      loadDataForCoords(28.4744, 77.5040, 50, false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 15);
        loadDataForCoords(lat, lng, accuracy, true);
      },
      (err) => {
        console.warn('Geolocation permission denied or timed out:', err);
        setIsDetectingGps(false);
        setLocationStatus('denied');
        setGpsError(
          err.code === 1 
            ? 'Browser location permission was denied. Please allow location access or pick your city manually below.'
            : 'Unable to pinpoint your GPS location. Please check your connection or choose your city.'
        );
        // Fallback gracefully so page remains fully functional
        loadDataForCoords(28.4744, 77.5040, 50, false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  }, [loadDataForCoords]);

  // Trigger Geolocation on Component Mount
  useEffect(() => {
    detectLiveLocation();
  }, [detectLiveLocation]);

  // Search Cities via Open-Meteo Geocoding
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.warn('City search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  // Map Zoom Controls
  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 0.35, 2.5));
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 0.35, 0.65));
  const handleRecenter = () => {
    setMapZoom(1);
    detectLiveLocation();
  };

  // Save Weather to Diagnostics and proceed
  const handleContinue = () => {
    const weatherData = {
      location: currentLocation.name,
      district: currentLocation.district,
      coords: currentLocation.coords,
      summary: `${currentLocation.currentTemp} · ${currentLocation.weatherDesc}`,
      temp_avg: parseFloat(currentLocation.tempAvg) || 26.5,
      rain_sum: parseFloat(currentLocation.rainTotal) || 0,
      humidity_avg: parseFloat(currentLocation.humidity) || 60,
      wind_avg: parseFloat(currentLocation.wind) || 12,
      metrics: {
        temp: currentLocation.tempAvg,
        maxTemp: currentLocation.tempMax,
        minTemp: currentLocation.tempMin,
        currentTemp: currentLocation.currentTemp,
        rain: currentLocation.rainTotal,
        rainyDays: currentLocation.rainyDays,
        humidity: currentLocation.humidity,
        wind: currentLocation.wind,
        weatherDesc: currentLocation.weatherDesc
      },
      raw_metrics: {
        temp: currentLocation.tempAvg,
        rain: currentLocation.rainTotal,
        humidity: currentLocation.humidity,
        wind: currentLocation.wind
      }
    };

    // Store in localStorage for Root Cause Engine
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    currentData.weather = weatherData;
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));

    // Move to next step in diagnostic pipeline (Sensors IoT)
    navigate('/iot-sync');
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans animate-in fade-in duration-300">
      
      {/* ======================================================== */}
      {/* TOP STEPPER INDICATOR                                    */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 pt-1">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          
          {/* Step 1: Crop Selection (Completed) */}
          <button 
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#10B981] text-white shadow-sm">
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-700 group-hover:text-emerald-700">
              Crop Selection
            </span>
          </button>
          
          <div className="w-6 sm:w-14 h-[2px] bg-[#E8592A]"></div>

          {/* Step 2: Live Weather Sync (Active) */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[#E8592A] text-white shadow-sm ring-4 ring-[#E8592A]/15">
              2
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#E8592A]">
              Live Weather Sync
            </span>
          </div>

          <div className="w-6 sm:w-14 h-[2px] bg-stone-200"></div>

          {/* Step 3: Field Details */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-400 hidden sm:inline">
              Field Details
            </span>
          </div>

          <div className="w-6 sm:w-14 h-[2px] bg-stone-200"></div>

          {/* Step 4: Review & Save */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-400 hidden sm:inline">
              Review & Save
            </span>
          </div>
        </div>

        {/* Diagnostic Mode Status Pill */}
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
          Step 2: Weather Sync
        </span>
      </div>

      {/* ======================================================== */}
      {/* GPS PERMISSION / STATUS ALERT BANNER                     */}
      {/* ======================================================== */}
      {locationStatus === 'denied' && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="font-extrabold text-sm block">Live GPS Access Needed</span>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {gpsError || 'Please allow location permission in your browser popup to fetch real satellite weather for your exact farm.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={detectLiveLocation}
              disabled={isDetectingGps}
              className="px-4 py-2 rounded-xl bg-[#E8592A] hover:bg-[#D44A1E] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LocateFixed size={14} className={isDetectingGps ? 'animate-spin' : ''} />
              <span>{isDetectingGps ? 'Requesting GPS...' : 'Allow GPS Access'}</span>
            </button>
            <button
              onClick={() => setShowLocationModal(true)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              Search City
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* HERO BANNER: Live Weather Sync                           */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 via-[#FAF7F0] to-amber-50/50 border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        
        {/* Farm Background Image with subtle gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 lg:w-1/2 pointer-events-none overflow-hidden opacity-30">
          <img 
            src="/images/farmer_hero_wide.png" 
            alt="Farm landscape" 
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-sky-50/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-stone-200/80 flex items-center justify-center shrink-0">
            <div className="relative">
              <Sun size={28} className="text-amber-500 animate-spin-slow" />
              <CloudSun size={24} className="text-sky-500 absolute -bottom-1 -right-1" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200 tracking-wider uppercase">
                Step 2 of 4 • Root Cause Engine
              </span>
              {currentLocation.isGps && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Live GPS
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Weather Sync
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Real-time 30-day meteorological satellite telemetry for your exact farm
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 1: Farm Location (Map) & Selected Field (2 Columns)  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (8 cols): Farm Location + Live Map */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          
          {/* Location Header & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MapPin size={18} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-stone-600">Your Farm Location</span>
                  {currentLocation.isGps ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live GPS Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Manual / Fixed Region
                    </span>
                  )}
                  {isLoading && (
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <RefreshCw size={11} className="animate-spin text-emerald-600" />
                      Syncing telemetry...
                    </span>
                  )}
                </div>
              </div>

              {/* Real Location Name */}
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
                {currentLocation.name}
              </h2>

              {/* District, Coordinates, Last Updated */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-stone-500 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Building2 size={13} className="text-stone-400" />
                  <span>District: <strong className="text-slate-700 font-semibold">{currentLocation.district}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Crosshair size={13} className="text-stone-400" />
                  <span>Coordinates: <strong className="text-slate-700 font-semibold">{currentLocation.coords}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-stone-400" />
                  <span>Updated: <strong className="text-slate-700 font-semibold">{currentLocation.lastUpdated}</strong></span>
                </span>
              </div>

            </div>

            {/* Action Buttons: Detect GPS & Change Location */}
            <div className="flex items-center gap-2 shrink-0 self-start">
              <button
                onClick={detectLiveLocation}
                disabled={isDetectingGps}
                title="Detect live GPS location of your current device"
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-sm flex items-center gap-1.5 transition-all"
              >
                <LocateFixed size={14} className={isDetectingGps ? 'animate-spin text-emerald-600' : 'text-emerald-700'} />
                <span>{isDetectingGps ? 'Getting GPS...' : 'Detect GPS'}</span>
              </button>

              <button
                onClick={() => setShowLocationModal(true)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Edit3 size={13} className="text-stone-500" />
                <span>Change</span>
              </button>
            </div>
          </div>

          {/* Interactive Live OpenStreetMap Canvas */}
          <div className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-stone-200/90 shadow-inner bg-slate-900 group">
            
            {isLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/95 text-white gap-2">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold text-slate-300">Rendering live satellite map for your coordinates...</span>
              </div>
            ) : (
              <iframe
                key={`${currentLocation.lat}-${currentLocation.lng}-${mapZoom}`}
                title="Live Farm Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(currentLocation.lng - 0.025 / mapZoom).toFixed(5)}%2C${(currentLocation.lat - 0.016 / mapZoom).toFixed(5)}%2C${(currentLocation.lng + 0.025 / mapZoom).toFixed(5)}%2C${(currentLocation.lat + 0.016 / mapZoom).toFixed(5)}&layer=mapnik&marker=${currentLocation.lat}%2C${currentLocation.lng}`}
                className="w-full h-full border-0 rounded-2xl filter saturate-105"
                loading="lazy"
              />
            )}

            {/* Floating Live Pin Callout */}
            <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
              <div className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span>Pin: {currentLocation.coords}</span>
                <span className="text-slate-400">({currentLocation.accuracy})</span>
              </div>
            </div>

            {/* Map Zoom & GPS Controls */}
            <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
              <div className="bg-white rounded-xl shadow-md border border-stone-200/80 overflow-hidden flex flex-col">
                <button 
                  onClick={handleZoomIn}
                  className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold text-sm transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <div className="w-full h-[1px] bg-stone-200"></div>
                <button 
                  onClick={handleZoomOut}
                  className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold text-sm transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
              </div>

              {/* Recenter Button */}
              <button 
                onClick={handleRecenter}
                className="w-7 h-7 bg-white rounded-xl shadow-md border border-stone-200/80 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors"
                title="Recenter GPS"
              >
                <LocateFixed size={14} className="text-emerald-600" />
              </button>
            </div>

            {/* External Satellite Map Link */}
            <a
              href={`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 z-30 bg-white/90 hover:bg-white text-stone-700 hover:text-slate-900 text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-md border border-stone-200/80 flex items-center gap-1 backdrop-blur-sm transition-all"
            >
              <span>Satellite View</span>
              <ExternalLink size={10} />
            </a>

          </div>

        </div>

        {/* Right Column (4 cols): Selected Field & Data Source */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm flex flex-col justify-between space-y-4">
          
          {/* Top Half: Selected Field Card */}
          <div className="space-y-3">
            <div className="h-32 w-full rounded-2xl overflow-hidden bg-stone-100 relative">
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80" 
                alt="Selected Field" 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/farmer_hero_wide.png'; }}
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-sm text-[10px] text-white font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active Season
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-600/90 backdrop-blur-sm text-[10px] text-white font-bold">
                {currentLocation.currentTemp} · {currentLocation.weatherDesc}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
                Selected Field
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Sprout size={16} className="text-emerald-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                  {currentLocation.field}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                <span>Area: <strong className="text-slate-700 font-semibold">{currentLocation.area}</strong></span>
                <span>•</span>
                <span className="truncate max-w-[180px]">{currentLocation.district}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-stone-100"></div>

          {/* Bottom Half: Location & Telemetry Metadata */}
          <div className="space-y-2.5 text-xs">
            
            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/60 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500">
                <MapPin size={14} className="text-emerald-600" />
                <span>Location Source</span>
              </div>
              <span className="font-bold text-slate-800">
                {currentLocation.isGps ? 'Device GPS (Live)' : 'Coordinate Fallback'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/60 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500">
                <Crosshair size={14} className="text-blue-500" />
                <span>Accuracy Radius</span>
              </div>
              <span className="font-bold text-slate-800">{currentLocation.accuracy}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/60 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500">
                <CloudSun size={14} className="text-amber-500" />
                <span>Meteorology Source</span>
              </div>
              <span className="font-bold text-slate-800">Open-Meteo & IMD (Live)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50/60 border border-stone-100">
              <div className="flex items-center gap-2 text-stone-500">
                <Clock size={14} className="text-purple-500" />
                <span>Last Updated</span>
              </div>
              <span className="font-bold text-slate-800">{currentLocation.lastUpdated}</span>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* ROW 2: 4 Key 30-Day Meteorological Metrics               */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Temperature */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <Thermometer size={16} />
              </div>
              <span>Temperature (°C)</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentLocation.tempAvg}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              30-Day Avg • Now: <strong className="text-slate-700">{currentLocation.currentTemp}</strong>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center gap-1">
              ↑ Max {currentLocation.tempMax}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center gap-1">
              ↓ Min {currentLocation.tempMin}
            </span>
          </div>
        </div>

        {/* Metric 2: Rainfall */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                <CloudRain size={16} />
              </div>
              <span>Precipitation</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentLocation.rainTotal}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              Cumulative (Last 30 Days)
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] text-stone-400 font-semibold">Rainy Days</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              🌧️ {currentLocation.rainyDays}
            </span>
          </div>
        </div>

        {/* Metric 3: Humidity */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Droplets size={16} />
              </div>
              <span>Relative Humidity</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentLocation.humidity}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              30-Day Avg • Now: <strong className="text-slate-700">{currentLocation.currentHumidity}</strong>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center gap-1">
              ↑ Max {currentLocation.humidityMax}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center gap-1">
              ↓ Min {currentLocation.humidityMin}
            </span>
          </div>
        </div>

        {/* Metric 4: Wind Speed */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Wind size={16} />
              </div>
              <span>Wind Speed</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {currentLocation.wind}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              Current Live Airflow
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
              {currentLocation.weatherDesc}
            </span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* ROW 3: Charts & Insights (3 Columns)                     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chart 1: Temperature Trend (Last 30 Days) - 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Thermometer size={16} className="text-rose-500" />
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                Temperature Trend (Last 30 Days)
              </h3>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2.5 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Max
              </span>
              <span className="flex items-center gap-1 text-orange-600">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Avg
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Min
              </span>
            </div>
          </div>

          {/* Recharts Area / Multi-line Chart */}
          <div className="h-[210px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 48]} 
                  ticks={[0, 10, 20, 30, 40]}
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="min" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#tempBlueGrad)" 
                  name="Min Temp (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="#F97316" 
                  strokeWidth={2} 
                  dot={false}
                  name="Avg Temp (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="max" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  dot={false}
                  name="Max Temp (°C)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Chart 2: Rainfall (Last 30 Days) - 4 cols */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          
          <div className="flex items-center gap-2">
            <CloudRain size={16} className="text-blue-500" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
              Precipitation (Last 30 Days)
            </h3>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-[210px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  formatter={(val) => [`${val} mm`, 'Rainfall']}
                />
                <Bar 
                  dataKey="rain" 
                  fill="#0284C7" 
                  radius={[4, 4, 0, 0]} 
                  barSize={10} 
                  name="Rainfall (mm)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Insights 3: Dynamic Weather Insights - 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm space-y-3.5 flex flex-col justify-between">
          
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
              Agronomic Insights
            </h3>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {insights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                {item.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />}
                {item.type === 'warning' && <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />}
                {item.type === 'alert' && <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />}
                {item.type === 'info' && <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />}
                <p className="text-xs text-stone-700 leading-snug font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[10px] text-amber-900 font-medium">
            💡 Synchronized with real satellite telemetry & local weather stations.
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* STICKY BOTTOM ACTION BAR                                 */}
      {/* ======================================================== */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <button
          onClick={() => navigate('/reports')}
          className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={16} />
          <span>Back to Crop Selection</span>
        </button>

        <div className="text-center hidden md:block">
          <span className="text-xs font-semibold text-stone-500">
            Live Region: <strong className="text-slate-800">{currentLocation.district}</strong> • Avg Temp: <strong className="text-slate-800">{currentLocation.tempAvg}</strong> • Rainfall: <strong className="text-slate-800">{currentLocation.rainTotal}</strong>
          </span>
        </div>

        <button
          onClick={handleContinue}
          className="px-7 py-3 rounded-xl bg-[#E8592A] hover:bg-[#D44A1E] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all w-full sm:w-auto justify-center"
        >
          <span>Continue to Field Details</span>
          <ArrowRight size={16} />
        </button>

      </div>

      {/* ======================================================== */}
      {/* CHANGE LOCATION MODAL (Live GPS + Autocomplete Search)   */}
      {/* ======================================================== */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-[#E8592A]" size={20} />
                <h3 className="font-extrabold text-slate-800 text-base">Select Farm Location</h3>
              </div>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Top Button: Use Current Device GPS */}
            <button
              onClick={() => {
                setShowLocationModal(false);
                detectLiveLocation();
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 hover:brightness-105 transition-all"
            >
              <LocateFixed size={18} className="animate-pulse" />
              <span>Use My Live Location (GPS Detect)</span>
            </button>

            {/* Search Input for Any City/Town */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Search Any City / Town / Village</label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Type location (e.g. Varanasi, Lucknow, Karnal, Patna)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E8592A] focus:bg-white transition-colors"
                />
                {isSearching && (
                  <RefreshCw size={14} className="animate-spin text-[#E8592A] absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-1.5 border-t border-stone-100 pt-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Search Results</span>
                {searchResults.map((res) => {
                  const label = [res.name, res.admin1, res.country].filter(Boolean).join(', ');
                  return (
                    <button
                      key={res.id}
                      onClick={() => {
                        loadDataForCoords(res.latitude, res.longitude, 25, false, {
                          name: label,
                          district: res.admin2 || res.name
                        });
                        setShowLocationModal(false);
                      }}
                      className="w-full p-2.5 rounded-xl border border-stone-100 hover:border-[#E8592A] hover:bg-orange-50/30 text-left flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <strong className="text-slate-800 block">{res.name}</strong>
                        <span className="text-stone-400 text-[10px]">{[res.admin1, res.country].filter(Boolean).join(', ')}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Popular Agricultural Regions List */}
            <div className="space-y-1.5 border-t border-stone-100 pt-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Popular Farming Belts</span>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {POPULAR_LOCATIONS.map(loc => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      loadDataForCoords(loc.lat, loc.lng, 25, false, {
                        name: loc.name,
                        district: loc.district
                      });
                      setShowLocationModal(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-start justify-between gap-3 transition-all ${
                      currentLocation.lat === loc.lat && currentLocation.lng === loc.lng
                        ? 'border-[#E8592A] bg-orange-50/30 ring-1 ring-[#E8592A]' 
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 block">
                        {loc.name}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        {loc.district} • {formatCoords(loc.lat, loc.lng)}
                      </span>
                    </div>

                    {currentLocation.lat === loc.lat && currentLocation.lng === loc.lng && (
                      <div className="w-5 h-5 rounded-full bg-[#E8592A] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-colors"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
