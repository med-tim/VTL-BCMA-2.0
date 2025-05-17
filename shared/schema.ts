import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Detection table for storing medication detections
export const detections = sqliteTable("detections", {
  id: text("id").primaryKey(),
  medicationName: text("medication_name").notNull(),
  confidence: text("confidence").notNull(),
  boundingBox: text("bounding_box").notNull(), // Stored as JSON string
  timestamp: text("timestamp").notNull(),
});

export interface Detection {
  id: string;
  medicationName: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: string;
}

// Verification table for storing medication verifications
export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  medicationName: text("medication_name").notNull(),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  verifiedBy: text("verified_by").notNull(),
  timestamp: text("timestamp").notNull(), 
  detectionId: text("detection_id").notNull(),
});

export const insertVerificationSchema = z.object({
  detectionId: z.string(),
  isCorrect: z.boolean(),
  verifiedBy: z.string().optional().default("Staff Member"),
  medicationName: z.string().optional(), // Will be filled from the detection
  timestamp: z.string().optional(), // Will be filled with current timestamp
});

export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type Verification = typeof verifications.$inferSelect;
