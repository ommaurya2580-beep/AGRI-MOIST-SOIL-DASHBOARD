import os
import json
import logging
import tensorflow as tf
from app.config import settings, FALLBACK_CLASSES

logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self):
        self.model = None
        self.classes = []

    def load_model(self):
        logger.info(f"Loading model from {settings.model_path}...")
        if not os.path.exists(settings.model_path):
            raise FileNotFoundError(f"Model file not found at {settings.model_path}")
        
        try:
            self.model = tf.keras.models.load_model(settings.model_path)
            logger.info("Model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    def load_classes(self):
        logger.info(f"Loading classes from {settings.classes_path}...")
        if os.path.exists(settings.classes_path):
            try:
                with open(settings.classes_path, 'r') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        self.classes = data
                    elif isinstance(data, dict):
                        # Handle {"0": "Class"} format
                        if all(k.isdigit() for k in data.keys()):
                            sorted_keys = sorted(data.keys(), key=int)
                            self.classes = [data[k] for k in sorted_keys]
                        # Handle {"Class": 0} format
                        else:
                            sorted_items = sorted(data.items(), key=lambda item: item[1])
                            self.classes = [item[0] for item in sorted_items]
                    logger.info(f"Classes loaded from JSON: {self.classes}")
            except Exception as e:
                logger.warning(f"Failed to parse classes JSON ({e}). Using fallback.")
                self.classes = FALLBACK_CLASSES
        else:
            logger.warning("Classes JSON not found. Using fallback class order.")
            self.classes = FALLBACK_CLASSES
            
    def initialize(self):
        self.load_classes()
        self.load_model()

model_manager = ModelManager()
