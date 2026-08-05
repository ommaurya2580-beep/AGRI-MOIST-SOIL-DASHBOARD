# Agri Pulse - Crop Intelligence ML Service

This is the FastAPI standalone service for processing plant images and returning disease probabilities using an EfficientNet-B0 PyTorch model.

## Setup

1. **IMPORTANT**: Place your trained model file (`best_wheat_finetuned.pth`) into the `models/` directory. The service expects it at `models/best_wheat_finetuned.pth`.
2. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the service:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Docker

```bash
docker build -t agri-pulse-ml .
docker run -p 8000:8000 agri-pulse-ml
```
