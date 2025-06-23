#!/usr/bin/env python3
import os
import argparse
from PIL import Image
import concurrent.futures
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# File extensions that can be converted to WebP
CONVERTIBLE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'}

def convert_to_webp(input_path, output_path, quality=80):
    """
    Convert an image to WebP format
    
    Args:
        input_path (str): Path to the input image
        output_path (str): Path to save the WebP image
        quality (int): WebP quality (0-100)
    
    Returns:
        bool: True if conversion was successful, False otherwise
    """
    try:
        img = Image.open(input_path)
        
        # Handle transparency for PNG files
        if input_path.lower().endswith('.png'):
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                logger.info(f"Converting PNG with transparency: {input_path}")
                # Use lossless for images with transparency to preserve quality
                img.save(output_path, 'WEBP', lossless=True)
                return True
                
        # Convert to WebP with the specified quality
        img.save(output_path, 'WEBP', quality=quality)
        img.close()
        
        # Log successful conversion and size comparison
        original_size = os.path.getsize(input_path)
        webp_size = os.path.getsize(output_path)
        savings = (1 - webp_size / original_size) * 100
        
        logger.info(f"Converted: {input_path} -> {output_path}")
        logger.info(f"Size reduction: {original_size/1024:.2f}KB -> {webp_size/1024:.2f}KB ({savings:.2f}% saved)")
        
        return True
    except Exception as e:
        logger.error(f"Error converting {input_path}: {str(e)}")
        return False

def process_file(file_path, output_dir, quality, keep_originals):
    """Process a single file for conversion"""
    # Skip SVG files completely
    if file_path.lower().endswith('.svg'):
        logger.info(f"Skipping SVG file: {file_path}")
        return False
        
    # Skip files that are already WebP
    if file_path.lower().endswith('.webp'):
        logger.info(f"Skipping already WebP file: {file_path}")
        return False
        
    # Check if the file extension is convertible
    ext = os.path.splitext(file_path)[1].lower()
    if ext not in CONVERTIBLE_EXTENSIONS:
        logger.info(f"Skipping non-convertible file: {file_path}")
        return False
    
    # For in-place replacement, use the same directory
    output_file_dir = os.path.dirname(file_path)
    
    # Create WebP output path (change extension to .webp)
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    output_path = os.path.join(output_file_dir, f"{base_name}.webp")
    
    # Convert the file
    success = convert_to_webp(file_path, output_path, quality)
    
    # Remove original if conversion was successful (always remove for in-place replacement)
    if success and not file_path.lower().endswith('.svg'):
        try:
            os.remove(file_path)
            logger.info(f"Replaced original file with WebP version: {file_path}")
        except Exception as e:
            logger.error(f"Error removing original file {file_path}: {str(e)}")
    
    return success

def main(args):
    """
    Main function to convert images to WebP
    """
    # Find all image files
    all_files = []
    for root, _, files in os.walk(args.input_dir):
        for file in files:
            file_path = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()
            if ext in CONVERTIBLE_EXTENSIONS:
                all_files.append(file_path)
    
    # Show summary before conversion
    logger.info(f"Found {len(all_files)} image files to process")
    logger.info(f"Input directory: {args.input_dir}")
    logger.info(f"WebP quality: {args.quality}")
    logger.info(f"Mode: Replace original files with WebP versions")
    
    # Convert files using multiple threads
    converted_count = 0
    skipped_count = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = []
        for file_path in all_files:
            future = executor.submit(
                process_file, 
                file_path, 
                None,  # output_dir not used for in-place replacement 
                args.quality, 
                False  # always replace originals
            )
            futures.append(future)
        
        # Process results as they complete
        for future in concurrent.futures.as_completed(futures):
            if future.result():
                converted_count += 1
            else:
                skipped_count += 1
    
    # Show summary
    logger.info(f"Conversion completed: {converted_count} files converted to WebP, {skipped_count} files skipped")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Convert images to WebP format')
    parser.add_argument('--input-dir', type=str, default='./public/images',
                        help='Input directory containing images (default: ./public/images)')
    parser.add_argument('--quality', type=int, default=80,
                        help='WebP quality (0-100, default: 80)')
    parser.add_argument('--workers', type=int, default=4,
                        help='Number of worker threads (default: 4)')
    
    args = parser.parse_args()
    main(args)