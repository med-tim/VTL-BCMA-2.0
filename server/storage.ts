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

// Database storage implementation
export class DatabaseStorage implements IStorage {
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Detection methods
  async saveDetection(detection: Detection): Promise<Detection> {
    // Convert the Detection object to the database format
    const dbDetection = {
      id: detection.id,
      medicationName: detection.medicationName,
      confidence: detection.confidence.toString(), // Convert to string as defined in schema
      boundingBox: JSON.stringify(detection.boundingBox), // Convert object to JSON string
      timestamp: new Date(detection.timestamp)
    };
    
    const [insertedDetection] = await db.insert(detections).values(dbDetection).returning();
    
    // Convert back to the Detection interface format
    return {
      id: insertedDetection.id,
      medicationName: insertedDetection.medicationName,
      confidence: parseFloat(insertedDetection.confidence),
      boundingBox: JSON.parse(insertedDetection.boundingBox),
      timestamp: insertedDetection.timestamp.toISOString()
    };
  }
  
  async getDetection(id: string): Promise<Detection | undefined> {
    const [dbDetection] = await db.select().from(detections).where(eq(detections.id, id));
    
    if (!dbDetection) {
      return undefined;
    }
    
    // Convert from database format to Detection interface
    return {
      id: dbDetection.id,
      medicationName: dbDetection.medicationName,
      confidence: parseFloat(dbDetection.confidence),
      boundingBox: JSON.parse(dbDetection.boundingBox),
      timestamp: dbDetection.timestamp.toISOString()
    };
  }
  
  // Verification methods
  async createVerification(verification: InsertVerification): Promise<Verification> {
    // Generate an ID if not provided
    const id = `ver_${Date.now()}`;
    
    const dbVerification = {
      id,
      medicationName: verification.medicationName as string,
      isCorrect: verification.isCorrect,
      verifiedBy: verification.verifiedBy || "Staff Member",
      timestamp: verification.timestamp ? new Date(verification.timestamp) : new Date(),
      detectionId: verification.detectionId
    };
    
    const [insertedVerification] = await db.insert(verifications).values(dbVerification).returning();
    return insertedVerification;
  }
  
  async getRecentVerifications(limit: number = 10): Promise<Verification[]> {
    return await db
      .select()
      .from(verifications)
      .orderBy(desc(verifications.timestamp))
      .limit(limit);
  }
}

// Export the database storage instance
export const storage = new DatabaseStorage();
