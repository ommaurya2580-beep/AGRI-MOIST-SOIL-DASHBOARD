# TerraLeaf AI - Model 1 (Inference Service)

FastAPI microservice for Wheat Leaf Disease Classification using TensorFlow/Keras.

## Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Place the trained model files in the `model/` directory:
   - `TerraLeaf_Model1_FINAL.keras`
   - `TerraLeaf_Model1_classes.json`

3. Copy `.env.example` to `.env`.

4. Run the service:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
