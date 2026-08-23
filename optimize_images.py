import os
from PIL import Image
import glob

def optimize_images(directory):
    # Find all PNG and JPG images
    png_files = glob.glob(os.path.join(directory, '**/*.png'), recursive=True)
    jpg_files = glob.glob(os.path.join(directory, '**/*.jpg'), recursive=True)
    
    all_files = png_files + jpg_files
    
    for file_path in all_files:
        try:
            with Image.open(file_path) as img:
                # Convert RGBA to RGB for JPG saving
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Resize if it's too large (max 1200 width/height)
                max_size = (1200, 1200)
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # If PNG, save as JPG and remove PNG
                if file_path.lower().endswith('.png'):
                    new_path = file_path.rsplit('.', 1)[0] + '.jpg'
                    img.save(new_path, 'JPEG', quality=80, optimize=True)
                    os.remove(file_path)
                    print(f"Converted & Optimized: {file_path} -> {new_path}")
                else:
                    # Overwrite JPG with optimized version
                    img.save(file_path, 'JPEG', quality=80, optimize=True)
                    print(f"Optimized: {file_path}")
        except Exception as e:
            print(f"Failed to process {file_path}: {e}")

if __name__ == '__main__':
    optimize_images('frontend/public/images')
