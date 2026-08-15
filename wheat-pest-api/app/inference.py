from ultralytics import YOLO
import os

# Load the model
# In production Docker, it will be at /app/models/best.pt
MODEL_PATH = os.environ.get("MODEL_PATH", "models/best.pt")

try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    print(f"Warning: Failed to load model at {MODEL_PATH}. Error: {e}")
    model = None

CLASS_NAMES = {
    0: "english_grain_aphid",
    1: "green_bug",
    2: "bird_cherry_oat_aphid",
    3: "wheat_blossom_midge",
    4: "penthaleus_major",
    5: "longlegged_spider_mite",
    6: "wheat_phloeothrips",
    7: "wheat_sawfly",
    8: "cerodonta_denticornis",
}

def get_predictions(img, conf_threshold=0.15):
    if model is None:
        return []
        
    results = model(img, conf=conf_threshold)
    detections = []
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            
            detections.append({
                "class_id": cls_id,
                "class_name": CLASS_NAMES.get(cls_id, "unknown"),
                "confidence": conf,
                "bbox": {
                    "x1": int(x1),
                    "y1": int(y1),
                    "x2": int(x2),
                    "y2": int(y2)
                }
            })
            
    return detections
