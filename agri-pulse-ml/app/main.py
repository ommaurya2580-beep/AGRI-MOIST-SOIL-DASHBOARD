from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import logging

from app.model_loader import load_model
from app.preprocessing import preprocess_image
from app.inference import predict
from app.config import MODEL_VERSION

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Agri Pulse ML Service")

# Load model on startup
model = load_model()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model": MODEL_VERSION
    }

@app.post("/predict")
async def predict_disease(
    image: UploadFile = File(...),
    crop: str = Form(...),
    plantPart: str = Form(...)
):
    if crop.lower() != "wheat" or plantPart.lower() != "leaf":
        return JSONResponse(status_code=400, content={
            "status": "error",
            "message": "Currently only wheat leaf analysis is supported."
        })
        
    try:
        contents = await image.read()
        tensor = preprocess_image(contents)
        result = predict(model, tensor)
        
        result["crop"] = crop
        result["plantPart"] = plantPart
        
        return result
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return JSONResponse(status_code=500, content={
            "status": "error",
            "message": str(e)
        })
