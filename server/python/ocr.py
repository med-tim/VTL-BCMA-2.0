#!/usr/bin/env python3
"""
OCR Processor for Medication Labels

This script processes cropped images of medication labels and extracts text using OCR.
"""

import sys
import json
import cv2
import numpy as np
import pytesseract
from PIL import Image

def preprocess_image(image_path):
    """
    Preprocess the image for better OCR results
    
    Args:
        image_path: Path to the input image
        
    Returns:
        Preprocessed image
    """
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        return None
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    
    # Apply noise removal
    kernel = np.ones((1, 1), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
    
    return opening

def perform_ocr(image):
    """
    Perform OCR on the image
    
    Args:
        image: Preprocessed image
        
    Returns:
        Extracted text
    """
    # Convert OpenCV image to PIL image for Tesseract
    pil_img = Image.fromarray(image)
    
    # Configure Tesseract for better results
    custom_config = r'--oem 3 --psm 6'
    
    # Perform OCR
    text = pytesseract.image_to_string(pil_img, config=custom_config)
    
    return text.strip()

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: ocr.py <image_path>"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        # Preprocess the image
        preprocessed = preprocess_image(image_path)
        if preprocessed is None:
            print(json.dumps({"error": "Failed to load image"}))
            sys.exit(1)
        
        # Perform OCR
        text = perform_ocr(preprocessed)
        
        # Return results
        result = {
            "text": text,
            "confidence": 0.92  # Mock confidence level
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
