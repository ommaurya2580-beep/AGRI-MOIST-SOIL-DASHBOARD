import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, X, CheckCircle2, ChevronRight, Activity, Bug, Brain, AlertTriangle, 
  Camera, Zap, Layers, RefreshCw, CloudRain
} from 'lucide-react';

const CONFIDENCE_THRESHOLD = 0.25;

function BoundingBoxImage({ src, detections }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded && detections && detections.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (!img || !canvas) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      detections.forEach(det => {
        if (det.confidence >= CONFIDENCE_THRESHOLD) {
          const { x1, y1, x2, y2 } = det.bbox;
          const width = x2 - x1;
          const height = y2 - y1;

          ctx.strokeStyle = '#3b82f6'; // Blue for Pest Radar
          ctx.lineWidth = Math.max(3, canvas.width / 200);
          ctx.strokeRect(x1, y1, width, height);

          const text = `${det.class_name} ${(det.confidence * 100).toFixed(1)}%`;
          ctx.font = `bold ${Math.max(16, canvas.width / 40)}px Arial`;
          const textWidth = ctx.measureText(text).width;
          
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(x1, y1 - 30, textWidth + 10, 30);
          
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x1 + 5, y1 - 8);
        }
      });
    }
  }, [loaded, detections, src]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-3 bg-slate-50">
      <img 
        ref={imageRef} 
        src={src} 
        alt="Original" 
        style={{ display: loaded && (!detections || detections.length === 0) ? 'block' : 'none', width: '100%', height: 'auto' }} 
        onLoad={() => setLoaded(true)} 
        className="w-full h-auto object-cover"
      />
      <canvas 
        ref={canvasRef} 
        style={{ display: loaded && detections && detections.length > 0 ? 'block' : 'none', width: '100%', height: 'auto' }} 
        className="w-full h-auto object-cover"
      />
      {!loaded && <div className="h-48 w-full animate-pulse bg-slate-200"></div>}
    </div>
  );
}

export default function MultiModelVision() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  
  // States: 'idle' | 'uploading' | 'analyzing' | 'results' | 'saving'
  const [appState, setAppState] = useState('idle');
  const [analysisResults, setAnalysisResults] = useState([]);
  
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const startAnalysis = async () => {
    if (images.length === 0) return;
    setAppState('analyzing');

    const resultsArray = [];

    // Process each image sequentially to prevent overloading the backend server,
    // but run models in parallel for each individual image.
    for (const imageObj of images) {
      const formData = new FormData();
      formData.append('file', imageObj.file);

      // Model 3 is mock (Future-proof)
      const mockModel3 = new Promise(resolve => {
        setTimeout(() => resolve({ 
          model: 'Nutrient & Stress (Model 3)', 
          icon: Brain,
          status: 'Offline',
          result: 'Pending Future Update'
        }), 800);
      });

      try {
        const controller1 = new AbortController();
        const controller2 = new AbortController();
        const timeout1 = setTimeout(() => controller1.abort(), 35000); // 35s timeout
        const timeout2 = setTimeout(() => controller2.abort(), 35000);

        // Parallel execution of real models for THIS image ONLY
        const [diseaseRes, pestRes, model3Res] = await Promise.allSettled([
          fetch('/api/v1/disease/predict', { 
            method: 'POST', body: formData, signal: controller1.signal 
          }).then(res => res.json()),
          
          fetch('/api/pest/predict', { 
            method: 'POST', body: formData, signal: controller2.signal 
          }).then(res => res.json()),
          
          mockModel3
        ]);

        clearTimeout(timeout1);
        clearTimeout(timeout2);

        resultsArray.push({
          imageId: imageObj.id,
          preview: imageObj.preview,
          models: [
            {
              id: 'model1',
              name: 'Disease Engine (M1)',
              icon: Activity,
              data: diseaseRes.status === 'fulfilled' 
                ? { label: diseaseRes.value.prediction || "Unknown", confidence: diseaseRes.value.confidence || 0 } 
                : { error: 'Failed or Timeout' },
              color: 'emerald'
            },
            {
              id: 'model2',
              name: 'Pest Radar (M2)',
              icon: Bug,
              data: pestRes.status === 'fulfilled' 
                ? { 
                    label: pestRes.value.detections && pestRes.value.detections.length > 0 
                      ? pestRes.value.detections.map(d => d.class_name).join(", ") 
                      : "No pests detected", 
                    confidence: pestRes.value.detections && pestRes.value.detections.length > 0
                      ? Math.max(...pestRes.value.detections.map(d => d.confidence))
                      : 1.0,
                    detections: pestRes.value.detections || []
                  } 
                : { error: 'Failed or Timeout' },
              color: 'blue'
            },
            {
              id: 'model3',
              name: 'Stress Net (M3)',
              icon: Brain,
              data: model3Res.status === 'fulfilled' ? model3Res.value : { error: 'Failed' },
              color: 'purple',
              isOffline: true
            }
          ]
        });
      } catch (err) {
        console.error("Error running models for image", err);
      }
    }

    setAnalysisResults(resultsArray);
    
    // Slight delay for animation completion before showing results
    setTimeout(() => {
      setAppState('results');
    }, 1500);
  };

  const handleConfirmAndProceed = () => {
    const handleFeedToEngine = () => {
      setAppState('saving');
      
      const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
      
      const visionPayload = analysisResults.map(r => ({
        disease: {
          label: r.models[0].data.label || r.models[0].data.error || 'Unknown',
          confidence: r.models[0].data.confidence || 0
        },
        pest: {
          label: r.models[1].data.label || r.models[1].data.error || 'Unknown',
          confidence: r.models[1].data.confidence || 0,
          detections: r.models[1].data.detections || []
        }
      }));

      currentData.vision = visionPayload;
      localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));
    };
    handleFeedToEngine();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative pb-20">
      
      {/* Saving Overlay: MASTER SUMMARY BEFORE ENGINE */}
      {appState === 'saving' && (() => {
        const fullData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
        
        return (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-indigo-500 overflow-hidden my-8">
            <div className="bg-indigo-600 p-6 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain size={32} />
              </div>
              <h2 className="text-3xl font-black mb-1">Final Data Review</h2>
              <p className="text-indigo-100">Review all captured data before running the Root Cause Engine</p>
            </div>
            
            <div className="p-8 space-y-8 bg-slate-50">
              
              {/* History Row */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Activity className="text-emerald-500"/> Step 1: Crop History</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">Stage</span><span className="font-medium">{fullData.history?.stage || 'N/A'}</span></div>
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">Irrigation</span><span className="font-medium">{fullData.history?.irrigation_date || 'N/A'}</span></div>
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">Fertilizer</span><span className="font-medium block">{fullData.history?.fertilizer || 'N/A'}</span><span className="text-xs text-slate-500">{fullData.history?.fertilizer_date}</span></div>
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">Spray</span><span className="font-medium block">{fullData.history?.spray || 'N/A'}</span><span className="text-xs text-slate-500">{fullData.history?.spray_date}</span></div>
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">Weather Exp.</span><span className="font-medium block">{fullData.history?.weather_experience || 'N/A'}</span></div>
                  <div className="col-span-2"><span className="block text-xs text-slate-400 uppercase font-bold">Observed Problem</span><span className="font-medium block">{fullData.history?.observed_problem || 'N/A'}</span><span className="text-xs text-slate-500">{fullData.history?.problem_date}</span></div>
                </div>
              </div>

              {/* Weather Row */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><CloudRain className="text-blue-500"/> Step 2: Weather (30 Days)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Object.entries(fullData.weather?.raw_metrics || {}).map(([key, val]) => (
                    <div key={key}>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium text-sm">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensors Row */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Zap className="text-amber-500"/> Step 3: IoT Sensors</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">Moisture</span><span className="font-medium">{fullData.sensors?.moisture}</span></div>
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">Temp</span><span className="font-medium">{fullData.sensors?.temperature}°C</span></div>
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">pH</span><span className="font-medium">{fullData.sensors?.pH}</span></div>
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">Pump</span><span className="font-medium">{fullData.sensors?.pump_state ? 'ON' : 'OFF'}</span></div>
                  <div><span className="block text-xs text-slate-400 uppercase font-bold">NPK (N/P/K)</span><span className="font-medium">{fullData.sensors?.nitrogen}/{fullData.sensors?.phosphorus}/{fullData.sensors?.potassium}</span></div>
                </div>
              </div>

              {/* Vision Row */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Camera className="text-purple-500"/> Step 4: AI Vision</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fullData.vision && fullData.vision.map((imgData, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="block text-xs text-slate-600 font-bold mb-1 border-b pb-1">Image {idx + 1}</span>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-emerald-600 font-semibold">Disease:</span>
                        <span className="text-slate-800 font-bold">{imgData.disease?.label || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-600 font-semibold">Pests:</span>
                        <span className="text-slate-800 font-bold">{imgData.pest?.label || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                  {(!fullData.vision || fullData.vision.length === 0) && (
                    <div className="text-slate-500 text-sm">No images analyzed.</div>
                  )}
                </div>
              </div>

            </div>
            
            <div className="p-6 bg-white border-t border-slate-100">
              <button onClick={() => navigate('/engine-compute')} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-indigo-500/30">
                Run Root Cause Engine <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Step 4 of 4</span>
            <span className="text-slate-400 text-sm font-medium">Root Cause Engine</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Multi-Model AI Vision</h1>
          <p className="text-slate-500 mt-1">Upload multiple crop photos. All models will analyze them simultaneously.</p>
        </div>
      </div>

      {/* IDLE / UPLOAD STATE */}
      {appState === 'idle' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-3 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all bg-white shadow-sm group"
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Tap to Select Images</h3>
            <p className="text-slate-500 max-w-sm">
              Take photos of leaves, stems, or the overall field. You can select multiple images at once.
            </p>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
          </div>

          {images.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                Selected Images ({images.length})
              </h4>
              <div className="flex flex-wrap gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group">
                    <img src={img.preview} alt="crop preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-500 hover:border-indigo-300 transition-colors"
                >
                  <Upload size={24} className="mb-1" />
                  <span className="text-xs font-semibold">Add More</span>
                </button>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={startAnalysis}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 text-lg"
                >
                  <Zap size={20} /> Run Multi-Model Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ANALYZING (FLOW ANIMATION) STATE */}
      {appState === 'analyzing' && (
        <div className="bg-slate-900 rounded-3xl p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in">
          
          <h2 className="text-white text-2xl font-bold mb-12 z-10">Running Parallel AI Analysis...</h2>
          
          <div className="flex items-center justify-between w-full max-w-4xl relative z-10">
            {/* Source Images Node */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-500/20 border-2 border-indigo-400 rounded-2xl flex items-center justify-center mb-3 p-2 relative">
                {images[0] && <img src={images[0].preview} className="w-full h-full object-cover rounded-xl" />}
                {images.length > 1 && (
                  <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    +{images.length - 1}
                  </div>
                )}
              </div>
              <span className="text-indigo-300 font-medium text-sm">Input Data</span>
            </div>

            {/* Connecting Lines (Animated) */}
            <div className="flex-1 flex flex-col justify-center px-8 relative h-48">
              {/* Branch 1 */}
              <div className="absolute left-8 right-8 top-1/4 h-[2px] bg-slate-700 overflow-hidden">
                <div className="h-full w-1/3 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-[slide_1s_ease-in-out_infinite]"></div>
              </div>
              {/* Branch 2 */}
              <div className="absolute left-8 right-8 top-1/2 h-[2px] bg-slate-700 overflow-hidden">
                <div className="h-full w-1/3 bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-[slide_1.2s_ease-in-out_infinite]"></div>
              </div>
              {/* Branch 3 */}
              <div className="absolute left-8 right-8 top-3/4 h-[2px] bg-slate-700 overflow-hidden">
                <div className="h-full w-1/3 bg-purple-500 shadow-[0_0_10px_#a855f7] animate-[slide_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>

            {/* Model Nodes */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 animate-pulse">
                  <Activity size={24} />
                </div>
                <div className="text-left">
                  <div className="text-emerald-400 font-bold">Model 1</div>
                  <div className="text-slate-400 text-xs">Disease Detection</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-400 animate-pulse animation-delay-300">
                  <Bug size={24} />
                </div>
                <div className="text-left">
                  <div className="text-blue-400 font-bold">Model 2</div>
                  <div className="text-slate-400 text-xs">Pest Analysis</div>
                </div>
              </div>

              <div className="flex items-center gap-4 opacity-50">
                <div className="w-12 h-12 bg-purple-500/20 border-2 border-purple-500 border-dashed rounded-full flex items-center justify-center text-purple-400">
                  <Brain size={24} />
                </div>
                <div className="text-left">
                  <div className="text-purple-400 font-bold">Model 3</div>
                  <div className="text-slate-400 text-xs">Offline / Standby</div>
                </div>
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(300%); }
            }
          `}} />
        </div>
      )}

      {/* RESULTS STATE */}
      {appState === 'results' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
            <div className="bg-emerald-100 p-2 rounded-full mt-1">
              <CheckCircle2 className="text-emerald-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-900">Analysis Complete</h3>
              <p className="text-emerald-700 text-sm mt-1">
                All models have independently analyzed your images. Review the aggregated results below before submitting to the Root Cause Engine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Model 1 (Disease) */}
            <div className="space-y-6">
              <div className="bg-emerald-600 rounded-t-2xl p-4 text-white text-center shadow-md">
                <Activity className="mx-auto mb-2" size={32} />
                <h3 className="font-bold text-lg">Model 1: Disease</h3>
                <p className="text-emerald-200 text-xs mt-1">Classification Output</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-b-2xl p-4 shadow-sm space-y-6">
                {analysisResults.map((result, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image {idx + 1}</span>
                    <div className="w-full rounded-xl overflow-hidden mb-3 border border-slate-200">
                      <img src={result.preview} alt="Crop" className="w-full h-auto object-cover" />
                    </div>
                    {result.models[0].data.error ? (
                      <div className="text-red-500 font-bold text-sm flex items-center gap-1"><AlertTriangle size={16}/> Error</div>
                    ) : (
                      <>
                        <div className="text-lg font-bold text-emerald-800 leading-tight mb-1">{result.models[0].data.label}</div>
                        <div className="text-xs font-medium text-slate-500">
                          Confidence: {typeof result.models[0].data.confidence === 'number' ? (result.models[0].data.confidence * 1).toFixed(1) + '%' : result.models[0].data.confidence}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Model 2 (Pest Radar YOLO) */}
            <div className="space-y-6">
              <div className="bg-blue-600 rounded-t-2xl p-4 text-white text-center shadow-md">
                <Bug className="mx-auto mb-2" size={32} />
                <h3 className="font-bold text-lg">Model 2: Pest Radar</h3>
                <p className="text-blue-200 text-xs mt-1">YOLO Object Detection</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-b-2xl p-4 shadow-sm space-y-6">
                {analysisResults.map((result, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image {idx + 1}</span>
                    
                    <BoundingBoxImage 
                      src={result.preview} 
                      detections={result.models[1].data.detections} 
                    />

                    {result.models[1].data.error ? (
                      <div className="text-red-500 font-bold text-sm flex items-center gap-1"><AlertTriangle size={16}/> Error</div>
                    ) : (
                      <>
                        <div className="text-lg font-bold text-blue-800 leading-tight mb-1">{result.models[1].data.label}</div>
                        <div className="text-xs font-medium text-slate-500">
                          Max Confidence: {typeof result.models[1].data.confidence === 'number' ? (result.models[1].data.confidence * 100).toFixed(1) + '%' : result.models[1].data.confidence}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Model 3 (Future) */}
            <div className="space-y-6">
              <div className="bg-purple-600 rounded-t-2xl p-4 text-white text-center shadow-md opacity-80">
                <Brain className="mx-auto mb-2" size={32} />
                <h3 className="font-bold text-lg">Model 3: Stress</h3>
                <p className="text-purple-200 text-xs mt-1">Future Integration</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-b-2xl p-4 space-y-6">
                {analysisResults.map((result, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 border-dashed flex flex-col items-center text-center opacity-70">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image {idx + 1}</span>
                    <div className="w-full rounded-xl overflow-hidden mb-3 border border-slate-200 grayscale">
                      <img src={result.preview} alt="Crop" className="w-full h-auto object-cover" />
                    </div>
                    <div className="text-sm font-bold text-slate-500 leading-tight mb-1">Offline</div>
                    <div className="text-xs font-medium text-slate-400">Pending future update</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 sticky bottom-4 z-40">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Ready to compute Final Diagnosis?</h3>
              <p className="text-slate-500 text-sm mt-1">We have History, Weather, IoT, and AI Vision data.</p>
            </div>
            <button 
              onClick={handleConfirmAndProceed}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-indigo-600/30 text-lg"
            >
              Feed to Root Cause Engine <ChevronRight size={24} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
