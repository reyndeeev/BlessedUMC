import { type User, type InsertUser, type ContactMessage, type InsertContactMessage, users, contactMessages } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, desc, gte, sql } from "drizzle-orm";

const SALT_ROUNDS = 12;

export interface AnalyticsData {
  totalUsers: number;
  totalMessages: number;
  recentMessages: number;
  activeUsersToday: number;
  messagesByDay: { date: string; count: number }[];
  topSubjects: { subject: string; count: number }[];
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  getAnalytics(): Promise<AnalyticsData>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    // Create a default admin user for testing
    try {
      const existingAdmin = await this.getUserByUsername("admin");
      if (!existingAdmin) {
        const defaultAdmin = await this.createUser({
          username: "admin",
          password: "admin123"
        });
        console.log("Default admin user created:", { username: defaultAdmin.username, id: defaultAdmin.id });
      }
    } catch (error) {
      console.error("Failed to create default admin:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    console.log("AUTH: Looking for user:", username);
    const user = await this.getUserByUsername(username);
    if (!user) {
      console.log("AUTH: User not found");
      return null;
    }

    console.log("AUTH: User found, checking password. Hash:", user.password);
    console.log("AUTH: Plain password length:", password.length);
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("AUTH: Password comparison result:", isValidPassword);

    if (!isValidPassword) {
      console.log("AUTH: Password mismatch");
      return null;
    }

    console.log("AUTH: Authentication successful");
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.username);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.length > 0;
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const [totalUsersResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [totalMessagesResult] = await db.select({ count: sql<number>`count(*)` }).from(contactMessages);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const [recentMessagesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactMessages)
      .where(gte(contactMessages.createdAt, oneDayAgo.toISOString()));

    const totalUsers = totalUsersResult.count;
    const totalMessages = totalMessagesResult.count;
    const recentMessages = recentMessagesResult.count;

    return {
      totalUsers,
      totalMessages,
      recentMessages,
      activeUsersToday: Math.floor(totalUsers * 0.3), // Mock data
      messagesByDay: await this.getMessagesByDay(),
      topSubjects: await this.getTopSubjects()
    };
  }

  private async getMessagesByDay(): Promise<{ date: string; count: number }[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const messages = await db
      .select({
        date: sql<string>`DATE(${contactMessages.createdAt})`,
        count: sql<number>`count(*)`
      })
      .from(contactMessages)
      .where(gte(contactMessages.createdAt, sevenDaysAgo.toISOString()))
      .groupBy(sql`DATE(${contactMessages.createdAt})`)
      .orderBy(sql`DATE(${contactMessages.createdAt})`);

    return messages;
  }

  private async getTopSubjects(): Promise<{ subject: string; count: number }[]> {
    const results = await db
      .select({ 
        subject: contactMessages.subject, 
        count: sql<number>`count(*)` 
      })
      .from(contactMessages)
      .groupBy(contactMessages.subject)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    return results;
  }
}

export const storage = new DatabaseStorage();