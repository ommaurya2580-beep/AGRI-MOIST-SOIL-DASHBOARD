import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, Leaf, Activity, Beaker, ShieldAlert, ThermometerSun } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = '/api/v1/disease/predict';

const DISEASE_INFO = {
  BrownRust: {
    color: '#d97706', // amber-600
    severity: 'High',
    description: 'Fungal disease causing brown, rusty pustules on leaves. Spreads rapidly in warm, humid conditions.',
    recommendation: 'Apply fungicides containing triazoles or strobilurins immediately. Ensure good field drainage and avoid over-fertilization with nitrogen.'
  },
  Healthy: {
    color: '#10b981', // emerald-500
    severity: 'None',
    description: 'The leaf appears healthy with no visible signs of major diseases.',
    recommendation: 'Continue regular monitoring and maintain optimal irrigation schedules.'
  },
  Mildew: {
    color: '#64748b', // slate-500
    severity: 'Medium',
    description: 'Powdery mildew appears as white, powdery spots on leaves and stems.',
    recommendation: 'Improve air circulation. Apply sulfur-based fungicides or appropriate systemic fungicides early in the infection cycle.'
  },
  Septoria: {
    color: '#b91c1c', // red-700
    severity: 'High',
    description: 'Septoria leaf blotch causes irregular brown spots with yellow halos, leading to severe yield loss.',
    recommendation: 'Apply fungicides early. Practice crop rotation and bury infected crop residue to reduce inoculum.'
  },
  YellowRust: {
    color: '#eab308', // yellow-500
    severity: 'Critical',
    description: 'Stripe rust causing yellow pustules aligned in stripes along the leaf veins.',
    recommendation: 'Requires immediate systemic fungicide application. Spreads very rapidly in cool, wet weather.'
  }
};

export default function TerraLeafPro() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze image (Status: ${response.status})`);
      }

      const data = await response.json();
      
      // Data format expected: { success: true, prediction: "Healthy", confidence: 98.45, probabilities: {...} }
      if (data.success) {
        // Prepare chart data
        const chartData = Object.keys(data.probabilities).map(key => ({
          name: key,
          confidence: data.probabilities[key]
        }));
        
        // Sort chart data by confidence descending
        chartData.sort((a, b) => b.confidence - a.confidence);
        
        setResult({
          ...data,
          chartData
        });
      } else {
        throw new Error('API returned an unsuccessful response.');
      }
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis. Make sure the ML service is running and accessible.');
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="dashboard-grid" style={{ gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
        
        {/* Left Column: Upload & Actions */}
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderTop: '4px solid var(--primary)' }}>
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <div className="card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Upload size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Scan Leaf</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload an image for analysis</p>
              </div>
            </div>

            <div 
              style={{ 
                border: '2px dashed var(--border-light)', 
                borderRadius: '12px', 
                padding: preview ? '0.5rem' : '2.5rem 1rem', 
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => document.getElementById('pro-image-upload').click()}
            >
              <input 
                id="pro-image-upload" 
                type="file" 
                accept="image/jpeg, image/png, image/jpg" 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
              />
              
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <div>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <Leaf size={28} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Click to browse</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>JPEG, PNG up to 10MB</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {preview && (
                <button 
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#fff', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={clearSelection}
                  disabled={loading}
                >
                  Clear
                </button>
              )}
              <button 
                className={`motor-btn ${file ? 'on' : 'off'}`} 
                style={{ flex: 2, padding: '0.75rem', fontSize: '0.95rem', margin: 0, opacity: (!file || loading) ? 0.6 : 1 }}
                disabled={!file || loading}
                onClick={handleAnalyze}
              >
                {loading ? 'Processing...' : 'Run Diagnostics'}
              </button>
            </div>
            
            {error && (
              <div style={{ marginTop: '1.25rem', color: 'var(--danger)', fontSize: '0.85rem', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="var(--primary)" />
              Supported Diseases
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DISEASE_INFO.BrownRust.color }} /> Brown Rust</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DISEASE_INFO.YellowRust.color }} /> Yellow Rust</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DISEASE_INFO.Septoria.color }} /> Septoria</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DISEASE_INFO.Mildew.color }} /> Powdery Mildew</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DISEASE_INFO.Healthy.color }} /> Healthy Leaf</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Results Dashboard */}
        <div>
          {!result && !loading && (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
              <Activity size={48} style={{ color: 'var(--border-light)', marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Awaiting Image Input</h3>
              <p style={{ margin: 0, textAlign: 'center', maxWidth: '400px' }}>
                Upload a clear picture of a wheat leaf. Our TerraLeaf Model-2 AI will analyze the image and generate a comprehensive diagnostic report.
              </p>
            </div>
          )}

          {loading && (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
              <div className="pulse-dot active" style={{ width: '24px', height: '24px', marginBottom: '1.5rem' }}></div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>AI is Analyzing</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Extracting features and classifying via EfficientNet-B0...</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Top Result Card */}
              <div className="card" style={{ padding: '2rem', borderLeft: `6px solid ${DISEASE_INFO[result.prediction]?.color || 'var(--primary)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Primary Detection
                    </p>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {result.prediction}
                      {result.prediction === 'Healthy' ? 
                        <CheckCircle size={32} color={DISEASE_INFO.Healthy.color} /> : 
                        <AlertTriangle size={32} color={DISEASE_INFO[result.prediction]?.color || '#f59e0b'} />
                      }
                    </h1>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI Confidence Score</p>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: DISEASE_INFO[result.prediction]?.color || 'var(--primary)' }}>
                      {result.confidence}%
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Beaker size={18} /> Agronomic Assessment
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {DISEASE_INFO[result.prediction]?.description || 'No detailed description available for this class.'}
                  </p>
                </div>
              </div>

              {/* Lower Section Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                {/* Chart Card */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', fontSize: '1.05rem' }}>Probability Distribution</h4>
                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer>
                      <BarChart data={result.chartData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-light)" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-main)' }} width={80} />
                        <Tooltip 
                          cursor={{fill: '#f1f5f9'}} 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} 
                          formatter={(value) => [`${value}%`, 'Confidence']}
                        />
                        <Bar dataKey="confidence" radius={[0, 4, 4, 0]} barSize={20}>
                          {result.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={DISEASE_INFO[entry.name]?.color || 'var(--primary)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recommendations Card */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ThermometerSun size={18} color="var(--primary)" /> Actionable Steps
                  </h4>
                  
                  {result.prediction !== 'Healthy' && (
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Severity Level:</span>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        backgroundColor: `${DISEASE_INFO[result.prediction]?.color}20`,
                        color: DISEASE_INFO[result.prediction]?.color 
                      }}>
                        {DISEASE_INFO[result.prediction]?.severity || 'Unknown'}
                      </span>
                    </div>
                  )}

                  <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {DISEASE_INFO[result.prediction]?.recommendation || 'Consult with a local agronomist for specific treatment plans.'}
                    </p>
                  </div>
                  
                  {result.prediction !== 'Healthy' && (
                    <button style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                      Schedule Irrigation Override
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
