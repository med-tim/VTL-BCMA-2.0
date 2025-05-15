#!/usr/bin/env python3
"""
Syringe Detector and OCR Processor

This script simulates syringes detection in images and performs OCR on the syringe labels.
It uses a simplified approach for demonstration purposes.
"""

import os
import sys
import json
import cv2
import numpy as np
from PIL import Image
import pytesseract
import random

def detect_syringes(image_path):
    """
    Simulate syringe detection in the image
    
    Args:
        image_path: Path to the input image
        
    Returns:
        List of detected syringes with bounding boxes
    """
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        print(json.dumps({"error": "Failed to load image"}))
        sys.exit(1)
    
    # Get image dimensions
    height, width = image.shape[:2]
    
    # For demonstration, we'll create 1-2 detections in different areas of the image
    detections = []
    num_detections = random.randint(1, 2)
    
    for _ in range(num_detections):
        # Create a random detection area (simulating a syringe)
        detection_width = random.randint(100, 200)
        detection_height = random.randint(30, 100)
        
        # Calculate position (avoid edges)
        max_x = width - detection_width - 10
        max_y = height - detection_height - 10
        
        if max_x <= 10 or max_y <= 10:
            # Image is too small
            continue
            
        x1 = random.randint(10, max_x)
        y1 = random.randint(10, max_y)
        x2 = x1 + detection_width
        y2 = y1 + detection_height
        
        # Extract region for OCR
        syringe_img = image[y1:y2, x1:x2]
        
        # Calculate relative position as percentage
        x_percent = (x1 / width) * 100
        y_percent = (y1 / height) * 100
        
        detections.append({
            "boundingBox": {
                "x": x_percent,
                "y": y_percent,
                "width": detection_width,
                "height": detection_height
            },
            "image": syringe_img
        })
    
    return detections, image

def perform_ocr(syringe_img):
    """
    Perform OCR on the syringe image to extract medication name
    
    Args:
        syringe_img: Cropped image of the syringe
        
    Returns:
        Extracted text
    """
    # Convert to grayscale
    gray = cv2.cvtColor(syringe_img, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding to enhance text
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    
    # Convert OpenCV image to PIL image for Tesseract
    pil_img = Image.fromarray(thresh)
    
    # Perform OCR
    text = pytesseract.image_to_string(pil_img)
    
    # Clean up the text
    text = text.strip()
    
    # For demo purposes, if no text is detected or text is too short,
    # return one of the common medication names
    if len(text) < 5:
        import random
        medications = [
            "Epinephrine 0.3mg/0.3mL",
            "Morphine 10mg/mL",
            "Lidocaine 2%",
            "Insulin Regular 100u/mL",
            "Atropine 0.4mg/mL",
            "Fentanyl 50mcg/mL"
        ]
        text = random.choice(medications)
    
    return text

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: detector.py <image_path>"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        detections, _ = detect_syringes(image_path)
        
        medications = []
        for i, detection in enumerate(detections):
            if "image" in detection:
                syringe_img = detection["image"]
                medication_name = perform_ocr(syringe_img)
                
                medications.append({
                    "medicationName": medication_name,
                    "confidence": 0.85 + (i * 0.02),  # Mock confidence level
                    "boundingBox": detection["boundingBox"]
                })
                
                # Remove the image from the output 
                del detection["image"]
        
        result = {"medications": medications}
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
