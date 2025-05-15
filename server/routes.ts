import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { execFile } from "child_process";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { insertVerificationSchema } from "@shared/schema";
import { z } from "zod";

// Define base64 image schema
const base64ImageSchema = z.string().startsWith("data:image/");

// Define detect payload schema
const detectPayloadSchema = z.object({
  imageData: base64ImageSchema
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Ensure Python directories exist
  const tempDir = path.join(import.meta.dirname, "temp");
  try {
    await fs.mkdir(tempDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create temp directory:", err);
  }

  // API endpoint to process an image for syringe detection and OCR
  app.post("/api/detect", async (req, res) => {
    try {
      // Validate the request payload
      const { imageData } = detectPayloadSchema.parse(req.body);
      
      // Extract the base64 image data
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      
      // Generate unique filename
      const imageId = uuidv4();
      const imagePath = path.join(tempDir, `${imageId}.jpg`);
      
      // Save the image to disk
      await fs.writeFile(imagePath, base64Data, "base64");
      
      // Call the Python script for detection
      const pythonScript = path.join(import.meta.dirname, "python", "detector.py");
      
      return new Promise<void>((resolve, reject) => {
        execFile("python", [pythonScript, imagePath], async (error, stdout, stderr) => {
          try {
            // Clean up the temporary image file
            await fs.unlink(imagePath).catch(console.error);
            
            if (error) {
              console.error("Python execution error:", error);
              console.error("stderr:", stderr);
              res.status(500).json({ message: "Detection failed" });
              reject(error);
              return;
            }
            
            // Parse the output from the Python script
            const detectionResult = JSON.parse(stdout);
            
            // Store detections in memory for verification
            const medications = detectionResult.medications.map((med: any) => {
              const id = uuidv4();
              const detection = {
                id,
                medicationName: med.medicationName,
                confidence: med.confidence,
                boundingBox: med.boundingBox,
                timestamp: new Date().toISOString()
              };
              
              // Store the detection for later verification
              storage.saveDetection(detection);
              
              return detection;
            });
            
            res.json({ medications });
            resolve();
          } catch (err) {
            console.error("Error processing detection result:", err);
            res.status(500).json({ message: "Failed to process detection result" });
            reject(err);
          }
        });
      });
    } catch (err) {
      console.error("Validation error:", err);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // API endpoint to verify a medication
  app.post("/api/verifications", async (req, res) => {
    try {
      // Parse and validate the verification data
      const verificationData = insertVerificationSchema.parse(req.body);
      
      // Get the detection from storage
      const detection = await storage.getDetection(verificationData.detectionId);
      if (!detection) {
        return res.status(404).json({ message: "Detection not found" });
      }
      
      // Create the verification record
      const verification = await storage.createVerification({
        ...verificationData,
        medicationName: detection.medicationName,
        timestamp: new Date().toISOString(),
        verifiedBy: verificationData.verifiedBy || "Staff Member",
      });
      
      res.status(201).json(verification);
    } catch (err) {
      console.error("Verification error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid verification data", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to create verification" });
      }
    }
  });

  // API endpoint to get recent verifications
  app.get("/api/verifications", async (_req, res) => {
    try {
      const verifications = await storage.getRecentVerifications();
      res.json(verifications);
    } catch (err) {
      console.error("Error getting verifications:", err);
      res.status(500).json({ message: "Failed to get verifications" });
    }
  });

  return httpServer;
}
