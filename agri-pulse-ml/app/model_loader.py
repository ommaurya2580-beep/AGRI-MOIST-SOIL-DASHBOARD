import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0
import os
import logging

from app.config import MODEL_PATH, CLASSES

logger = logging.getLogger(__name__)

def load_model():
    model = efficientnet_b0(weights=None)
    
    # Replace classifier for exactly 5 outputs
    # EfficientNet-B0 classifier is a Sequential with Dropout and Linear
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, len(CLASSES))
    
    if os.path.exists(MODEL_PATH):
        try:
            # We use map_location='cpu' to ensure it runs even if GPU isn't available
            state_dict = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
            model.load_state_dict(state_dict)
            logger.info(f"Successfully loaded model weights from {MODEL_PATH}")
        except Exception as e:
            logger.error(f"Error loading model weights: {e}")
    else:
        logger.warning(f"Model file {MODEL_PATH} not found. Running with randomly initialized weights for structural testing.")
        
    model.eval()
    return model
