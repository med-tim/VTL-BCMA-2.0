// Bounding box for detection area
export interface BoundingBox {
  x: number;       // x-coordinate as percentage of image width
  y: number;       // y-coordinate as percentage of image height
  width: number;   // width in pixels
  height: number;  // height in pixels
}

// Medication detection from the ML pipeline
export interface MedicationDetection {
  id: string;               // Unique ID for this detection
  medicationName: string;   // OCR-detected medication name
  confidence: number;       // Confidence score (0-1)
  boundingBox: BoundingBox; // Position in the image
  timestamp: string;        // ISO string timestamp
}

// Verification record
export interface Verification {
  id: string;               // Unique ID for the verification
  medicationName: string;   // Name of the verified medication
  isCorrect: boolean;       // Whether the detection was correct
  verifiedBy: string;       // User who performed the verification
  timestamp: string;        // ISO string timestamp
  detectionId: string;      // Reference to the original detection
}
