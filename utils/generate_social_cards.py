from PIL import Image
import os

def generate_social_cards(input_path, output_dir):
    # Sizes for OG and Twitter
    sizes = {
        'og-card.png': (1200, 630),
        'twitter-card.png': (800, 418)
    }
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    img = Image.open(input_path)
    for filename, size in sizes.items():
        # Center crop to aspect ratio, then resize
        aspect = size[0] / size[1]
        w, h = img.size
        img_aspect = w / h
        if img_aspect > aspect:
            # Crop width
            new_w = int(h * aspect)
            left = (w - new_w) // 2
            box = (left, 0, left + new_w, h)
        else:
            # Crop height
            new_h = int(w / aspect)
            top = (h - new_h) // 2
            box = (0, top, w, top + new_h)
        cropped = img.crop(box)
        resized = cropped.resize(size, Image.LANCZOS)
        out_path = os.path.join(output_dir, filename)
        resized.save(out_path)
        print(f"Saved {out_path}")

if __name__ == "__main__":
    # Example usage
    generate_social_cards(
        input_path="../images/firstchurchofgod2.jpg",
        output_dir="../public/images"
    )
