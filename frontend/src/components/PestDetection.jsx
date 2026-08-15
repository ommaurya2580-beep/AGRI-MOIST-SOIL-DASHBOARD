import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertTriangle, Bug, AlertCircle } from 'lucide-react';

const API_URL = '/api';

const CONFIDENCE_THRESHOLD = 0.15;

const CLASS_NAMES = {
  0: "English Grain Aphid",
  1: "Green Bug",
  2: "Bird Cherry-Oat Aphid",
  3: "Wheat Blossom Midge",
  4: "Penthaleus Major",
  5: "Longlegged Spider Mite",
  6: "Wheat Phloeothrips",
  7: "Wheat Sawfly",
  8: "Cerodonta Denticornis",
};

export default function PestDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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
      const response = await fetch(`/api/pest/predict`, {
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
      setError('An error occurred during analysis. Make sure the AWS ML service is running.');
    } finally {
      setLoading(false);
    }
  };

  // Draw bounding boxes on the image when results arrive
  useEffect(() => {
    if (result && result.detections && preview) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (!img || !canvas) return;

      // Ensure canvas matches image dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw bounding boxes
      result.detections.forEach(det => {
        if (det.confidence >= CONFIDENCE_THRESHOLD) {
          const { x1, y1, x2, y2 } = det.bbox;
          const width = x2 - x1;
          const height = y2 - y1;

          // Box
          ctx.strokeStyle = '#10b981'; // Green
          ctx.lineWidth = Math.max(3, canvas.width / 200);
          ctx.strokeRect(x1, y1, width, height);

          // Background for text
          const text = `${det.class_name} ${(det.confidence * 100).toFixed(1)}%`;
          ctx.font = `bold ${Math.max(16, canvas.width / 40)}px Arial`;
          const textWidth = ctx.measureText(text).width;
          
          ctx.fillStyle = '#10b981';
          ctx.fillRect(x1, y1 - 30, textWidth + 10, 30);
          
          // Text
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x1 + 5, y1 - 8);
        }
      });
    }
  }, [result, preview]);

  const filteredDetections = result?.detections?.filter(d => d.confidence >= CONFIDENCE_THRESHOLD) || [];
  const hasLowConfidenceGreenBug = result?.detections?.some(d => d.class_id === 1 && d.confidence >= CONFIDENCE_THRESHOLD && d.confidence < 0.6);

  return (
    <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <div className="card-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}><Bug size={24} /></div>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Wheat Pest Detection (YOLO11s)</h2>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
        {/* Upload Section */}
        <div>
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
            onClick={() => document.getElementById('pest-image-upload').click()}
          >
            <input 
              id="pest-image-upload" 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
            {preview ? (
              <div style={{ position: 'relative', width: '100%' }}>
                {/* Hidden image just to get natural dimensions */}
                <img 
                  ref={imageRef} 
                  src={preview} 
                  alt="original" 
                  style={{ display: 'none' }} 
                  onLoad={() => {
                    // Force a re-render of canvas if we already have results
                    if(result) setResult({...result});
                  }}
                />
                
                {result ? (
                   <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                ) : (
                   <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                )}
              </div>
            ) : (
              <div>
                <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Click to upload wheat image</p>
              </div>
            )}
          </div>

          <button 
            className="motor-btn on" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            disabled={!file || loading}
            onClick={handleAnalyze}
          >
            {loading ? 'Detecting Pests...' : 'Run Pest Detection'}
          </button>
          
          {error && <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</div>}
        </div>

        {/* Results Section */}
        <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-main)' }}>Detection Results</h3>
          
          {!result && !loading && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '3rem' }}>
              Upload an image and click "Run Pest Detection" to see results.
            </p>
          )}

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <div className="pulse-dot active" style={{ display: 'inline-block', width: '16px', height: '16px' }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>Running YOLO11s model...</p>
            </div>
          )}

          {result && (
            <div>
              {filteredDetections.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '1.5rem', backgroundColor: '#dcfce7', padding: '0.75rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>No pests detected in this image.</span>
                </div>
              ) : (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Pests Found ({filteredDetections.length})</div>
                  
                  {filteredDetections.map((pred, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>{pred.class_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <span style={{ 
                           fontWeight: 600, 
                           padding: '0.2rem 0.5rem', 
                           borderRadius: '4px',
                           backgroundColor: pred.confidence > 0.7 ? '#dcfce7' : '#fef3c7',
                           color: pred.confidence > 0.7 ? '#15803d' : '#b45309'
                        }}>
                          {(pred.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* Special handling for Green Bug limitation */}
                      {pred.class_id === 1 && pred.confidence < 0.6 && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem', color: '#b45309', fontSize: '0.8rem' }}>
                          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>Green Bugs can visually resemble other aphids. Please verify manually if confidence is low.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
