import torch
import torch.nn.functional as F
from app.config import CLASSES, UNCERTAINTY_THRESHOLD, MODEL_VERSION

def predict(model, image_tensor):
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = F.softmax(outputs[0], dim=0)
        
    # Get top predictions
    probs_list = probabilities.tolist()
    class_probs = [{"label": CLASSES[i], "confidence": round(p * 100, 2)} for i, p in enumerate(probs_list)]
    
    # Sort by confidence descending
    class_probs.sort(key=lambda x: x["confidence"], reverse=True)
    
    top_3 = class_probs[:3]
    top_confidence = top_3[0]["confidence"]
    
    status = "success"
    if top_confidence < UNCERTAINTY_THRESHOLD:
        status = "uncertain"
        
    return {
        "status": status,
        "modelVersion": MODEL_VERSION,
        "predictions": top_3
    }
