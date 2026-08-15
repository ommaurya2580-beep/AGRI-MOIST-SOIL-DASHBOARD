FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for OpenCV and clean apt cache
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# First, install ONLY the CPU version of PyTorch (saves ~3-4 GB of NVIDIA CUDA bloat)
RUN pip install --no-cache-dir torch==2.2.2 torchvision==0.17.2 --extra-index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install the rest
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

EXPOSE 8000

ENV MODEL_PATH=/app/models/best.pt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
