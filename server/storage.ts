import { 
  users, type User, type InsertUser,
  verifications, type Verification, type InsertVerification,
  detections, type Detection
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Detection methods
  saveDetection(detection: Detection): Promise<Detection>;
  getDetection(id: string): Promise<Detection | undefined>;
  
  // Verification methods
  createVerification(verification: InsertVerification): Promise<Verification>;
  getRecentVerifications(limit?: number): Promise<Verification[]>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: User[] = [];
  private userIdCounter = 1;
  private detections: Detection[] = [];
  private verifications: Verification[] = [];
  
  constructor() {
    // Add some sample data
    this.addSampleData();
  }
  
  private addSampleData() {
    // Add sample verifications
    const sampleMedications = [
      { id: 'det_123', name: 'Insulin Regular 100u/mL', confidence: 0.92 },
      { id: 'det_124', name: 'Epinephrine 0.3mg/0.3mL', confidence: 0.88 },
      { id: 'det_125', name: 'Morphine 10mg/mL', confidence: 0.95 },
      { id: 'det_126', name: 'Lidocaine 2%', confidence: 0.78 }
    ];
    
    const now = new Date();
    
    // Add sample detections
    for (const med of sampleMedications) {
      this.detections.push({
        id: med.id,
        medicationName: med.name,
        confidence: med.confidence,
        boundingBox: { x: 20, y: 30, width: 150, height: 50 },
        timestamp: new Date(now.getTime() - Math.random() * 3600000).toISOString()
      });
    }
    
    // Add sample verifications
    this.verifications.push({
      id: 'ver_123',
      medicationName: 'Insulin Regular 100u/mL',
      isCorrect: true,
      verifiedBy: 'Staff Member',
      timestamp: new Date(now.getTime() - 900000).toISOString(),
      detectionId: 'det_123'
    });
    
    this.verifications.push({
      id: 'ver_124',
      medicationName: 'Epinephrine 0.3mg/0.3mL',
      isCorrect: true,
      verifiedBy: 'Staff Member',
      timestamp: new Date(now.getTime() - 1800000).toISOString(),
      detectionId: 'det_124'
    });
    
    this.verifications.push({
      id: 'ver_125',
      medicationName: 'Morphine 10mg/mL',
      isCorrect: false,
      verifiedBy: 'Staff Member',
      timestamp: new Date(now.getTime() - 2700000).toISOString(),
      detectionId: 'det_125'
    });
    
    this.verifications.push({
      id: 'ver_126',
      medicationName: 'Lidocaine 2%',
      isCorrect: true,
      verifiedBy: 'Staff Member',
      timestamp: new Date(now.getTime() - 3600000).toISOString(),
      detectionId: 'det_126'
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.userIdCounter++
    };
    this.users.push(user);
    return user;
  }
  
  // Detection methods
  async saveDetection(detection: Detection): Promise<Detection> {
    this.detections.push(detection);
    return detection;
  }
  
  async getDetection(id: string): Promise<Detection | undefined> {
    return this.detections.find(detection => detection.id === id);
  }
  
  // Verification methods
  async createVerification(verification: InsertVerification): Promise<Verification> {
    // Get the detection to fill in the medicationName if not provided
    const detection = await this.getDetection(verification.detectionId);
    
    if (!detection) {
      throw new Error(`Detection with ID ${verification.detectionId} not found`);
    }
    
    const newVerification: Verification = {
      id: `ver_${Date.now()}`,
      medicationName: verification.medicationName || detection.medicationName,
      isCorrect: verification.isCorrect,
      verifiedBy: verification.verifiedBy || "Staff Member",
      timestamp: verification.timestamp || new Date().toISOString(),
      detectionId: verification.detectionId
    };
    
    this.verifications.push(newVerification);
    return newVerification;
  }
  
  async getRecentVerifications(limit: number = 10): Promise<Verification[]> {
    return [...this.verifications]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

// Export the database storage instance
export const storage = new DatabaseStorage();
