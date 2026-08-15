import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, Leaf } from 'lucide-react';
import PestDetection from './PestDetection';

const API_URL = '/api';

export default function CropAnalysis() {
  const [activeModel, setActiveModel] = useState('model1');
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
    formData.append('image', file);
    formData.append('crop', 'wheat');
    formData.append('plantPart', 'leaf');

    try {
      const response = await fetch(`${API_URL}/analysis/disease`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Make sure the ML service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setActiveModel('model1')} 
          className={`motor-btn ${activeModel === 'model1' ? 'on' : 'off'}`} 
          style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', minWidth: '220px' }}
        >
          Model-1: Crop Disease
        </button>
        <button 
          onClick={() => setActiveModel('model2')} 
          className={`motor-btn ${activeModel === 'model2' ? 'on' : 'off'}`} 
          style={{ padding: '0.5rem 1.5rem', borderRadius: '20px', minWidth: '220px' }}
        >
          Model-2: Wheat Pest (YOLO11s)
        </button>
      </div>

      {activeModel === 'model1' ? (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <div className="card-icon"><Leaf size={24} /></div>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Visual Disease Analysis (Model-1)</h2>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
        {/* Upload Section */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Crop</label>
            <select disabled style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
              <option>Wheat</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Plant Part</label>
            <select disabled style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
              <option>Leaf</option>
            </select>
          </div>

          <div 
            style={{ 
              border: '2px dashed var(--border-light)', 
              borderRadius: '8px', 
              padding: '2rem', 
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
            onClick={() => document.getElementById('image-upload').click()}
          >
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
            {preview ? (
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
            ) : (
              <div>
                <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click to upload leaf image</p>
              </div>
            )}
          </div>

          <button 
            className="motor-btn on" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            disabled={!file || loading}
            onClick={handleAnalyze}
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
          
          {error && <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</div>}
        </div>

        {/* Results Section */}
        <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-main)' }}>Analysis Results</h3>
          
          {!result && !loading && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '3rem' }}>
              Upload an image and click Analyze to see results.
            </p>
          )}

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <div className="pulse-dot active" style={{ display: 'inline-block', width: '16px', height: '16px' }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>Running ML model...</p>
            </div>
          )}

          {result && (
            <div>
              {result.status === 'uncertain' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', marginBottom: '1.5rem', backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '4px' }}>
                  <AlertTriangle size={20} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Uncertain: Visual prediction is uncertain. Please capture a clearer image.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '1.5rem', backgroundColor: '#dcfce7', padding: '0.75rem', borderRadius: '4px' }}>
                  <CheckCircle size={20} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Visual Match Found</span>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Primary Visual Match</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  {result.predictions && result.predictions[0] ? result.predictions[0].label : 'Unknown'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Confidence Breakdown</div>
                
                {result.predictions && result.predictions.map((pred, idx) => (
                  <div key={idx} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span>{pred.label}</span>
                      <span style={{ fontWeight: 600 }}>{pred.confidence}%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${pred.confidence}%`, 
                          backgroundColor: idx === 0 ? (result.status === 'uncertain' ? '#f59e0b' : 'var(--primary)') : '#cbd5e1', 
                          height: '100%' 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Disclaimer:</strong> This provides visual AI evidence only and does not represent a final agronomic diagnosis. Symptoms may overlap with nutrient deficiencies or environmental stress.
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      ) : (
        <PestDetection />
      )}
    </div>
  );
}
