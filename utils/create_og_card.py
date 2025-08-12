#!/usr/bin/env python3
"""
Create a proper Open Graph card (1200x630px) from church images
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_og_card():
    # Paths
    input_image = "images/church_foto.jpg"  # Main church photo
    output_path = "public/images/og-card.png"
    
    # OG card dimensions (Facebook/Twitter standard)
    og_width = 1200
    og_height = 630
    
    try:
        # Open and process the church image
        print(f"Opening {input_image}...")
        img = Image.open(input_image)
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Calculate dimensions for center crop to 1200x630 aspect ratio
        aspect_ratio = og_width / og_height  # 1.905
        img_width, img_height = img.size
        img_aspect = img_width / img_height
        
        if img_aspect > aspect_ratio:
            # Image is wider - crop width
            new_width = int(img_height * aspect_ratio)
            left = (img_width - new_width) // 2
            crop_box = (left, 0, left + new_width, img_height)
        else:
            # Image is taller - crop height  
            new_height = int(img_width / aspect_ratio)
            top = (img_height - new_height) // 2
            crop_box = (0, top, img_width, top + new_height)
        
        # Crop and resize to exact OG dimensions
        cropped = img.crop(crop_box)
        og_image = cropped.resize((og_width, og_height), Image.Resampling.LANCZOS)
        
        # Add overlay with church information
        overlay = Image.new('RGBA', (og_width, og_height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Add semi-transparent overlay at bottom
        overlay_height = 200
        overlay_y = og_height - overlay_height
        draw.rectangle([(0, overlay_y), (og_width, og_height)], 
                      fill=(0, 0, 0, 120))  # Semi-transparent black
        
        # Try to load a font, fallback to default
        try:
            title_font = ImageFont.truetype("arial.ttf", 48)
            subtitle_font = ImageFont.truetype("arial.ttf", 28)
        except:
            try:
                title_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 48)
                subtitle_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 28)
            except:
                title_font = ImageFont.load_default()
                subtitle_font = ImageFont.load_default()
        
        # Add text
        title = "First Church of God"
        subtitle = "Palatka, Florida"
        details = "Sunday 10am-1:30pm • Wednesday 6pm • Saturday 9:30am"
        
        # Calculate text positions for center alignment
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (og_width - title_width) // 2
        title_y = overlay_y + 20
        
        subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
        subtitle_x = (og_width - subtitle_width) // 2
        subtitle_y = title_y + 60
        
        details_bbox = draw.textbbox((0, 0), details, font=subtitle_font)
        details_width = details_bbox[2] - details_bbox[0]
        details_x = (og_width - details_width) // 2
        details_y = subtitle_y + 40
        
        # Draw text with shadow effect
        shadow_offset = 2
        
        # Title with shadow
        draw.text((title_x + shadow_offset, title_y + shadow_offset), title, 
                 font=title_font, fill=(0, 0, 0, 180))
        draw.text((title_x, title_y), title, font=title_font, fill=(255, 255, 255, 255))
        
        # Subtitle with shadow
        draw.text((subtitle_x + shadow_offset, subtitle_y + shadow_offset), subtitle, 
                 font=subtitle_font, fill=(0, 0, 0, 180))
        draw.text((subtitle_x, subtitle_y), subtitle, font=subtitle_font, fill=(255, 255, 255, 255))
        
        # Details with shadow
        draw.text((details_x + shadow_offset, details_y + shadow_offset), details, 
                 font=subtitle_font, fill=(0, 0, 0, 180))
        draw.text((details_x, details_y), details, font=subtitle_font, fill=(255, 255, 255, 255))
        
        # Composite the overlay onto the image
        final_image = Image.alpha_composite(og_image.convert('RGBA'), overlay)
        
        # Convert back to RGB and save
        final_rgb = final_image.convert('RGB')
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save with optimization
        final_rgb.save(output_path, 'PNG', optimize=True, quality=85)
        
        print(f"✅ OG card created successfully: {output_path}")
        print(f"📐 Dimensions: {og_width}x{og_height}px")
        
        # Get file size
        file_size = os.path.getsize(output_path)
        print(f"📁 File size: {file_size / 1024:.1f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating OG card: {e}")
        return False

if __name__ == "__main__":
    create_og_card()
