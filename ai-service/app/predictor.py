import io
import logging
import numpy as np
from PIL import Image, UnidentifiedImageError
from app.model_loader import model_manager

logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB limit

async def process_image_and_predict(file_bytes: bytes):
    # 1. Validate size
    if len(file_bytes) > MAX_FILE_SIZE:
        raise ValueError("File exceeds maximum allowed size of 10MB.")

    # 2. Decode safely and convert to RGB
    try:
        image = Image.open(io.BytesIO(file_bytes))
        if image.mode != "RGB":
            image = image.convert("RGB")
    except UnidentifiedImageError:
        raise ValueError("Invalid or corrupted image file.")
    except Exception as e:
        logger.error(f"Image processing error: {str(e)}")
        raise ValueError("Failed to process the uploaded image.")

    # 3. Resize to 224x224
    image = image.resize((224, 224))

    # 4. Convert to float32 NumPy array
    img_array = np.array(image, dtype=np.float32)

    # 5. Add batch dimension -> (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)

    # Note: Deliberately omitting manual /255 normalization as per instructions.
    # The Keras EfficientNet-B0 architecture internally includes a Rescaling layer.

    # 6. Predict
    try:
        predictions = model_manager.model.predict(img_array)
        probs = predictions[0]  # Get the first item in the batch
    except Exception as e:
        logger.error(f"Inference error: {str(e)}")
        raise RuntimeError("Model inference failed.")

    # 7. Convert NumPy types to JSON-safe Python values
    classes = model_manager.classes
    if len(probs) != len(classes):
        raise RuntimeError("Model output dimension does not match number of loaded classes.")

    probabilities_dict = {}
    for i, cls_name in enumerate(classes):
        # Convert np.float32 to standard float, round for neatness
        probabilities_dict[cls_name] = round(float(probs[i]) * 100, 2)

    # Find top prediction
    top_index = int(np.argmax(probs))
    top_class = classes[top_index]
    top_confidence = probabilities_dict[top_class]

    return {
        "success": True,
        "prediction": top_class,
        "confidence": top_confidence,
        "probabilities": probabilities_dict
    }
