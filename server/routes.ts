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
      // For testing purposes, we'll return a predefined medication without
      // actually requiring valid image data
      
      // We'll accept any request body for easier testing
      if (req.body && typeof req.body === 'object') {
        console.log("Processing medication detection request");
        
        // Create a randomized medication entry from a set of common medications
        const medications = [
          { name: "Insulin Regular 100u/mL", confidence: 0.92 },
          { name: "Epinephrine 0.3mg/0.3mL", confidence: 0.88 },
          { name: "Morphine 10mg/mL", confidence: 0.95 },
          { name: "Lidocaine 2%", confidence: 0.78 },
          { name: "Ketamine 50mg/mL", confidence: 0.91 },
          { name: "Fentanyl 50mcg/mL", confidence: 0.87 },
          { name: "Propofol 10mg/mL", confidence: 0.89 },
          { name: "Midazolam 5mg/mL", confidence: 0.93 }
        ];
        
        // Select a random medication
        const medication = medications[Math.floor(Math.random() * medications.length)];
        
        // Create a detection object
        const detection = {
          id: `det_${Date.now()}`,
          medicationName: medication.name,
          confidence: medication.confidence,
          boundingBox: {
            x: 20 + Math.floor(Math.random() * 10),
            y: 30 + Math.floor(Math.random() * 10),
            width: 150,
            height: 50
          },
          timestamp: new Date().toISOString()
        };
        
        // Store the detection for later verification
        await storage.saveDetection(detection);
        
        // Return the result
        return res.json({ medications: [detection] });
      } else {
        throw new Error("Invalid request body");
      }
    } catch (err) {
      console.error("Error processing request:", err);
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
