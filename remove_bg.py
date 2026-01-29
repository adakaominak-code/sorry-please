from rembg import remove
from PIL import Image
import os

# Input and output directories
input_dir = "public/cats"
output_dir = "public/cats"

# List of cat images to process
images = [
    "cat-flowers.jpg",
    "cat-shy.jpg", 
    "cat-kitten.jpg",
    "cat-angry.jpg",
    "cat-knife.jpg"
]

for img_name in images:
    input_path = os.path.join(input_dir, img_name)
    output_name = img_name.replace(".jpg", ".png")
    output_path = os.path.join(output_dir, output_name)
    
    print(f"Processing {img_name}...")
    
    # Open image
    input_image = Image.open(input_path)
    
    # Remove background
    output_image = remove(input_image)
    
    # Save as PNG with transparency
    output_image.save(output_path, "PNG")
    print(f"  Saved {output_name}")

print("\nDone! All backgrounds removed.")
