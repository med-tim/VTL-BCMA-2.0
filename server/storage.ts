import { 
  users, type User, type InsertUser,
  verifications, type Verification, type InsertVerification,
  detections, type Detection
} from "@shared/schema";

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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private detectionMap: Map<string, Detection>;
  private verificationMap: Map<string, Verification>;
  
  currentId: number;
  
  constructor() {
    this.users = new Map();
    this.detectionMap = new Map();
    this.verificationMap = new Map();
    this.currentId = 1;
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Detection methods
  async saveDetection(detection: Detection): Promise<Detection> {
    this.detectionMap.set(detection.id, detection);
    return detection;
  }
  
  async getDetection(id: string): Promise<Detection | undefined> {
    return this.detectionMap.get(id);
  }
  
  // Verification methods
  async createVerification(verification: InsertVerification): Promise<Verification> {
    const id = `ver_${Date.now()}`;
    const newVerification: Verification = { 
      ...verification, 
      id 
    };
    
    this.verificationMap.set(id, newVerification);
    return newVerification;
  }
  
  async getRecentVerifications(limit: number = 10): Promise<Verification[]> {
    // Get all verifications and sort by timestamp (descending)
    const allVerifications = Array.from(this.verificationMap.values());
    
    return allVerifications
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
