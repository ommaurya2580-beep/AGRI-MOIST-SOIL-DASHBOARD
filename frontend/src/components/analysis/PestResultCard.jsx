import React, { useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

// Use 0.05 instead of 0.15 to prevent frontend from hiding backend results!
const CONFIDENCE_THRESHOLD = 0.05;

export default function PestResultCard({ result, previewUrl }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Safely extract detections and ensure they exist
  const detections = result?.detections || [];
  const filteredDetections = detections.filter(d => d.confidence >= CONFIDENCE_THRESHOLD);

  useEffect(() => {
    if (filteredDetections.length > 0 && previewUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = imageRef.current;

      if (!img || !canvas || !ctx) return;

      // When image loads, set canvas dimensions and draw
      const drawBoxes = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        filteredDetections.forEach(det => {
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
          ctx.fillRect(x1, y1 - Math.max(30, canvas.width / 30), textWidth + 10, Math.max(30, canvas.width / 30));
          
          // Text
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x1 + 5, y1 - 8);
        });
      };

      if (img.complete) {
        drawBoxes();
      } else {
        img.onload = drawBoxes;
      }
    }
  }, [filteredDetections, previewUrl]);

  if (!result) return null;

  if (filteredDetections.length === 0) {
    return (
      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg">
        <span className="text-sm font-semibold">No pests detected in this image.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider">
        Pests Found ({filteredDetections.length})
      </div>
      
      <div className="space-y-3 mb-6">
        {filteredDetections.map((pred, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="font-bold text-slate-800 capitalize">
              {pred.class_name.replace(/_/g, ' ')}
            </span>
            <span className={`font-bold px-3 py-1 rounded-full text-xs ${
              pred.confidence > 0.6 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {(pred.confidence * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {previewUrl && (
        <div className="relative rounded-xl overflow-hidden border border-slate-200">
          <img 
            ref={imageRef} 
            src={previewUrl} 
            alt="original" 
            className="hidden" 
          />
          <canvas 
            ref={canvasRef} 
            className="w-full h-auto block" 
          />
        </div>
      )}
      
      {/* Disclaimer for weak detections */}
      {filteredDetections.some(d => d.confidence < 0.3) && (
        <div className="mt-4 flex items-start gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg text-xs font-medium">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>Low confidence detections are shown. Please verify manually as they might be false positives.</span>
        </div>
      )}
    </div>
  );
}
