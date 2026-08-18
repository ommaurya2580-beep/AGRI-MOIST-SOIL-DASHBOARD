import React, { useState, useRef, useEffect } from 'react';
import { Upload, Bug, Leaf, AlertCircle, CheckCircle, ChevronRight, Activity, X } from 'lucide-react';
import PestResultCard from '../../components/analysis/PestResultCard';

export default function UnifiedAnalysisFlow() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  
  // Results
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [pestResult, setPestResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setDiseaseResult(null);
      setPestResult(null);
      setError(null);
      setActiveStep(1);
      setProgress(0);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setDiseaseResult(null);
    setPestResult(null);
    setActiveStep(1);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setActiveStep(2);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('crop', 'wheat'); // Defaulting to wheat for now
    formData.append('plantPart', 'leaf');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 5;
      });
    }, 500);

    try {
      // Create controllers with increased timeout (60 seconds)
      const diseaseController = new AbortController();
      const pestController = new AbortController();
      const timeoutId = setTimeout(() => {
        diseaseController.abort();
        pestController.abort();
      }, 60000);

      // Run both API calls concurrently
      const [diseaseResponse, pestResponse] = await Promise.allSettled([
        fetch('/api/v1/disease/predict', { method: 'POST', body: formData, signal: diseaseController.signal }),
        fetch('/api/pest/predict', { method: 'POST', body: formData, signal: pestController.signal })
      ]);

      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setProgress(100);

      // Handle Disease (Model-1)
      if (diseaseResponse.status === 'fulfilled' && diseaseResponse.value.ok) {
        const dData = await diseaseResponse.value.json();
        setDiseaseResult(dData);
      } else {
        setDiseaseResult({ error: 'Disease detection unavailable' });
      }

      // Handle Pest (Model-2)
      if (pestResponse.status === 'fulfilled' && pestResponse.value.ok) {
        const pData = await pestResponse.value.json();
        setPestResult(pData);
      } else {
        setPestResult({ error: 'Pest detection unavailable' });
      }

      setTimeout(() => setActiveStep(3), 500);

    } catch (err) {
      clearInterval(progressInterval);
      setError('An error occurred during unified analysis. Make sure both ML services are running.');
      setActiveStep(1);
    } finally {
      setLoading(false);
    }
  };

  const getOverallHealth = () => {
    if (!diseaseResult && !pestResult) return null;
    
    let isHealthy = true;
    let issues = [];

    if (diseaseResult && diseaseResult.prediction && diseaseResult.prediction !== 'Healthy') {
      isHealthy = false;
      issues.push('Disease detected');
    }

    if (pestResult && pestResult.detections && pestResult.detections.length > 0) {
      isHealthy = false;
      issues.push('Pests detected');
    }

    if (isHealthy) {
      return { status: 'Healthy', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    }
    
    return { status: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-50', desc: issues.join(' & ') };
  };

  const health = getOverallHealth();

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Unified Crop Analysis</h1>
        <p className="text-slate-500">Simultaneously scan for diseases and pests using AgriPulse AI</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 px-8">
        {[
          { num: 1, label: 'Upload Photo' },
          { num: 2, label: 'AI Scanning' },
          { num: 3, label: 'Results' }
        ].map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                activeStep >= step.num ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-200 text-slate-500'
              }`}>
                {step.num}
              </div>
              <span className={`text-xs font-semibold ${activeStep >= step.num ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {idx < 2 && (
              <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${activeStep > step.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {activeStep === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-3xl mx-auto">
          {!preview ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('unified-upload').click()}
            >
              <input 
                id="unified-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Crop Image</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                Take a clear, well-lit photo of the affected crop leaf. Our AI will scan it for both diseases and pests simultaneously.
              </p>
              
              <div className="flex justify-center gap-6 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500"/> Clear lighting</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500"/> Good focus</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500"/> Single leaf preferred</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative inline-block mb-6">
                <img src={preview} alt="Crop Preview" className="max-h-80 rounded-xl shadow-md border border-slate-200" />
                <button 
                  onClick={clearFile}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 hover:border-red-200"
                >
                  <X size={16} />
                </button>
              </div>
              <button 
                onClick={handleAnalyze}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-12 rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-lg flex items-center gap-2"
              >
                Run AI Analysis <ChevronRight size={20} />
              </button>
              {error && <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>}
            </div>
          )}
        </div>
      )}

      {activeStep === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
              <Activity size={32} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Crop Image...</h3>
          <p className="text-slate-500 text-sm mb-8">Running Model-1 (Disease) and Model-2 (Pest YOLO11s)</p>
          
          <div className="w-full max-w-md bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="text-xs font-bold text-slate-400">{progress}% Complete</div>
        </div>
      )}

      {activeStep === 3 && health && (
        <div className="space-y-6">
          {/* Overall Health Banner */}
          <div className={`rounded-2xl p-6 border flex items-center justify-between ${health.bg} border-${health.color.split('-')[1]}-200`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-white shadow-sm ${health.color}`}>
                {health.status === 'Healthy' ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${health.color}`}>Overall Status: {health.status}</h2>
                {health.desc && <p className="text-slate-600 text-sm mt-1">{health.desc}</p>}
              </div>
            </div>
            <button onClick={clearFile} className="bg-white px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              New Analysis
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model 1 Results */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Leaf size={18} /></div>
                <h3 className="font-bold text-slate-800">Model-1: Crop Disease</h3>
              </div>
              <div className="p-6">
                {diseaseResult?.error ? (
                  <div className="text-slate-500 text-sm">{diseaseResult.error}</div>
                ) : diseaseResult?.prediction ? (
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="text-sm text-slate-500">Detected Condition</div>
                      <div className="text-2xl font-bold text-slate-800">{diseaseResult.prediction}</div>
                    </div>
                    {diseaseResult.confidence && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500">AI Confidence</span>
                          <span className="text-emerald-600">{diseaseResult.confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${diseaseResult.confidence}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm">No disease detected.</div>
                )}
              </div>
            </div>

            {/* Model 2 Results */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg"><Bug size={18} /></div>
                <h3 className="font-bold text-slate-800">Model-2: Wheat Pest</h3>
              </div>
              <div className="p-6">
                {pestResult?.error ? (
                  <div className="text-slate-500 text-sm">{pestResult.error}</div>
                ) : (
                  <PestResultCard result={pestResult} previewUrl={preview} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
