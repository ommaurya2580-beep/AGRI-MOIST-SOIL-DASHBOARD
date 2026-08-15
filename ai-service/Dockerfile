FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (for caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app/ ./app/
COPY model/ ./model/
COPY .env.example .env

# Unzip the model package
RUN python -c "import zipfile, os; zipfile.ZipFile('model/TerraLeaf_Model1_FINAL_PACKAGE.zip', 'r').extractall('model/')"

# Expose port
EXPOSE 8000

# Start the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
