import os

# Model Settings
MODEL_PATH = os.getenv("MODEL_PATH", "models/best_wheat_finetuned.pth")
MODEL_VERSION = "wheat-disease-v1"

# Ordered Classes (MUST match training output exactly)
CLASSES = [
    "BrownRust",
    "Healthy",
    "Mildew",
    "Septoria",
    "YellowRust"
]

# If the highest confidence prediction is below this threshold, it is considered UNCERTAIN
UNCERTAINTY_THRESHOLD = 50.0
