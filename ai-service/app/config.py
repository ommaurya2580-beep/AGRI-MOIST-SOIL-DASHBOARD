import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", 8000))
    model_path: str = os.getenv("MODEL_PATH", "model/TerraLeaf_Model1_FINAL.keras")
    classes_path: str = os.getenv("CLASSES_JSON_PATH", "model/TerraLeaf_Model1_classes.json")
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
    
    class Config:
        env_file = ".env"

settings = Settings()

# Hardcoded class order fallback based on project specification
FALLBACK_CLASSES = [
    "BrownRust",
    "Healthy",
    "Mildew",
    "Septoria",
    "YellowRust"
]
