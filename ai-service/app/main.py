import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.model_loader import model_manager
from app.predictor import process_image_and_predict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting TerraLeaf AI Service...")
    try:
        model_manager.initialize()
    except Exception as e:
        logger.error(f"Failed to initialize model during startup: {e}")
        # We don't crash here so that /health can report 'degraded' status 
        # and developers can inspect the environment without a restart loop.
    yield
    logger.info("Shutting down TerraLeaf AI Service...")

app = FastAPI(
    title="TerraLeaf AI Inference Service",
    description="Microservice for Wheat Leaf Disease Classification",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration from environment variable (Defaults to local frontend)
allowed_origins_list = [origin.strip() for origin in settings.allowed_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "TerraLeaf AI Inference Service",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    is_loaded = model_manager.model is not None
    return {
        "status": "healthy" if is_loaded else "degraded",
        "model_loaded": is_loaded,
        "model_name": "TerraLeaf_Model1_FINAL.keras",
        "classes": model_manager.classes if is_loaded else []
    }

@app.post("/api/v1/disease/predict")
async def predict_disease(file: UploadFile = File(...)):
    if model_manager.model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not loaded or initialization failed."
        )

    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided."
        )

    # Validate mime type
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported image format. Please upload JPEG or PNG."
        )

    try:
        # File is handled safely in memory
        file_bytes = await file.read()
        result = await process_image_and_predict(file_bytes)
        return result
    except ValueError as e:
        # Known client-side errors (bad image, file too large)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Unexpected server-side errors
        logger.error(f"Unexpected prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during prediction."
        )
