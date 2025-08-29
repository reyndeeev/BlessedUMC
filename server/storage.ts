import { type User, type InsertUser, type ContactMessage, type InsertContactMessage, users, contactMessages } from "@shared/schema";
import bcrypt from "bcrypt";
import { getDatabaseConnection } from "./db";
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
  private db: ReturnType<typeof getDatabaseConnection>;
  
  constructor() {
    this.db = getDatabaseConnection();
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
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    const [user] = await this.db
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
    const [message] = await this.db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await this.db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users).orderBy(users.username);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const [totalUsersResult] = await this.db.select({ count: sql<number>`count(*)` }).from(users);
    const [totalMessagesResult] = await this.db.select({ count: sql<number>`count(*)` }).from(contactMessages);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const [recentMessagesResult] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(contactMessages)
      .where(sql`${contactMessages.createdAt} >= ${oneDayAgo.toISOString()}`);

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

    const messages = await this.db
      .select({
        date: sql<string>`DATE(${contactMessages.createdAt})`,
        count: sql<number>`count(*)`
      })
      .from(contactMessages)
      .where(sql`${contactMessages.createdAt} >= ${sevenDaysAgo.toISOString()}`)
      .groupBy(sql`DATE(${contactMessages.createdAt})`)
      .orderBy(sql`DATE(${contactMessages.createdAt})`);

    return messages;
  }

  private async getTopSubjects(): Promise<{ subject: string; count: number }[]> {
    const results = await this.db
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

// In-memory storage implementation for fallback
export class MemStorage implements IStorage {
  private users: User[] = [];
  private contactMessages: ContactMessage[] = [];
  private idCounter = 1;

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
        console.log("Default admin user created (in-memory):", { username: defaultAdmin.username, id: defaultAdmin.id });
      }
    } catch (error) {
      console.error("Failed to create default admin:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    const user: User = {
      id: (this.idCounter++).toString(),
      username: insertUser.username,
      password: hashedPassword
    };
    this.users.push(user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    console.log("AUTH (MemStorage): Looking for user:", username);
    const user = await this.getUserByUsername(username);
    if (!user) {
      console.log("AUTH (MemStorage): User not found");
      return null;
    }

    console.log("AUTH (MemStorage): User found, checking password");
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("AUTH (MemStorage): Password comparison result:", isValidPassword);

    if (!isValidPassword) {
      console.log("AUTH (MemStorage): Password mismatch");
      return null;
    }

    console.log("AUTH (MemStorage): Authentication successful");
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const message: ContactMessage = {
      id: (this.idCounter++).toString(),
      firstName: insertMessage.firstName,
      lastName: insertMessage.lastName,
      email: insertMessage.email,
      phone: insertMessage.phone ?? null,
      subject: insertMessage.subject,
      message: insertMessage.message,
      createdAt: new Date()
    };
    this.contactMessages.push(message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return [...this.contactMessages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users].sort((a, b) => a.username.localeCompare(b.username));
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index > -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const totalUsers = this.users.length;
    const totalMessages = this.contactMessages.length;
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentMessages = this.contactMessages.filter(msg => msg.createdAt >= oneDayAgo).length;

    return {
      totalUsers,
      totalMessages,
      recentMessages,
      activeUsersToday: Math.floor(totalUsers * 0.3),
      messagesByDay: this.getMessagesByDay(),
      topSubjects: this.getTopSubjects()
    };
  }

  private getMessagesByDay(): { date: string; count: number }[] {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const messagesByDay = new Map<string, number>();
    
    this.contactMessages
      .filter(msg => msg.createdAt >= sevenDaysAgo)
      .forEach(msg => {
        const date = msg.createdAt.toISOString().split('T')[0];
        messagesByDay.set(date, (messagesByDay.get(date) || 0) + 1);
      });
    
    return Array.from(messagesByDay.entries()).map(([date, count]) => ({ date, count }));
  }

  private getTopSubjects(): { subject: string; count: number }[] {
    const subjectCounts = new Map<string, number>();
    
    this.contactMessages.forEach(msg => {
      subjectCounts.set(msg.subject, (subjectCounts.get(msg.subject) || 0) + 1);
    });
    
    return Array.from(subjectCounts.entries())
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

// Try to use database storage, fallback to memory storage
let storage: IStorage;
try {
  storage = new DatabaseStorage();
  console.log("Using DatabaseStorage with PostgreSQL");
} catch (error) {
  console.warn("Failed to initialize DatabaseStorage, falling back to MemStorage:", error);
  storage = new MemStorage();
}

export { storage };