import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, X, CheckCircle2, ChevronRight, Activity, Bug, Brain, AlertTriangle, 
  Camera, Zap, Layers, RefreshCw
} from 'lucide-react';

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

    // Process each image in parallel across available models
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
        }), 2000);
      });

      try {
        // Parallel execution of real models
        const [diseaseRes, pestRes, model3Res] = await Promise.allSettled([
          fetch('/api/v1/disease/predict', { method: 'POST', body: formData }).then(res => res.json()),
          fetch('/api/pest/predict', { method: 'POST', body: formData }).then(res => res.json()),
          mockModel3
        ]);

        resultsArray.push({
          imageId: imageObj.id,
          preview: imageObj.preview,
          models: [
            {
              id: 'model1',
              name: 'Disease Engine (M1)',
              icon: Activity,
              data: diseaseRes.status === 'fulfilled' ? diseaseRes.value : { error: 'Failed' },
              color: 'emerald'
            },
            {
              id: 'model2',
              name: 'Pest Radar (M2)',
              icon: Bug,
              data: pestRes.status === 'fulfilled' ? pestRes.value : { error: 'Failed' },
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
        console.error("Error running models", err);
      }
    }

    setAnalysisResults(resultsArray);
    
    // Slight delay for animation completion before showing results
    setTimeout(() => {
      setAppState('results');
    }, 1500);
  };

  const handleConfirmAndProceed = () => {
    setAppState('saving');
    
    // Save to local storage for the Engine
    const currentData = JSON.parse(localStorage.getItem('agripulse_diagnostic') || '{}');
    
    // We pass the aggregated vision data to the engine
    const visionPayload = analysisResults.map(res => ({
      disease: res.models[0].data,
      pest: res.models[1].data
    }));
    
    currentData.vision = visionPayload;
    localStorage.setItem('agripulse_diagnostic', JSON.stringify(currentData));
    
    // Finally, go to the Engine computing page
    setTimeout(() => {
      navigate('/engine-compute'); // <--- The next step after vision
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative pb-20">
      
      {/* Saving Overlay */}
      {appState === 'saving' && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center border-2 border-indigo-500">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Vision Data Finalized!</h2>
            <p className="text-slate-500 mb-6">Aggregated multi-model results are ready for the Engine.</p>
            
            <div className="bg-slate-900 rounded-xl p-4 text-left overflow-hidden h-40 overflow-y-auto">
              <pre className="text-indigo-400 font-mono text-xs">
                {JSON.stringify(analysisResults.map(r => ({
                  model1: r.models[0].data.disease || r.models[0].data.error,
                  model2: r.models[1].data.pest || r.models[1].data.error
                })), null, 2)}
              </pre>
            </div>
            
            <p className="text-sm font-bold text-slate-400 mt-6 animate-pulse">Initializing Root Cause Engine...</p>
          </div>
        </div>
      )}

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

          <div className="space-y-6">
            {analysisResults.map((result, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8">
                
                {/* Image Thumbnail */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-2">
                    <img src={result.preview} alt="Analyzed Crop" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image {idx + 1}</span>
                </div>

                {/* Model Results Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.models.map((model) => (
                    <div key={model.id} className={`rounded-2xl p-4 border ${model.isOffline ? 'bg-slate-50 border-slate-200 border-dashed opacity-70' : `bg-${model.color}-50 border-${model.color}-200`}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1.5 rounded-lg bg-${model.color}-100 text-${model.color}-600`}>
                          <model.icon size={16} />
                        </div>
                        <span className={`text-xs font-bold text-${model.color}-700`}>{model.name}</span>
                      </div>
                      
                      {model.isOffline ? (
                        <div className="text-sm text-slate-500 font-medium">Pending future update</div>
                      ) : model.data.error ? (
                        <div className="text-sm text-red-600 font-medium flex items-center gap-1">
                          <AlertTriangle size={14}/> Error analyzing
                        </div>
                      ) : (
                        <div>
                          <div className="text-lg font-bold text-slate-800 leading-tight mb-1">
                            {model.data.disease || model.data.pest || "Healthy"}
                          </div>
                          {model.data.confidence && (
                            <div className="text-xs font-medium text-slate-500">
                              Confidence: {model.data.confidence}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-slate-600 bg-white/60 p-2 rounded-lg">
                            {model.data.recommendation ? model.data.recommendation[0] : "Visual features extracted successfully."}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
