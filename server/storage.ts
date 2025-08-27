import { type User, type InsertUser, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export interface AnalyticsData {
  totalUsers: number;
  totalMessages: number;
  recentMessages: number;
  activeUsersToday: number;
  messagesByDay: { date: string; count: number }[];
  topSubjects: { subject: string; count: number }[];
}
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    // Create a default admin user for testing
    try {
      const defaultAdmin = await this.createUser({
        username: "admin",
        password: "admin123"
      });
      console.log("Default admin user created:", { username: defaultAdmin.username, id: defaultAdmin.id });
    } catch (error) {
      console.error("Failed to create default admin:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    const user: User = { ...insertUser, id, password: hashedPassword };
    this.users.set(id, user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }
    
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { 
      ...insertMessage, 
      phone: insertMessage.phone || null,
      id, 
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort(
      (a, b) => a.username.localeCompare(b.username)
    );
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const totalUsers = this.users.size;
    const totalMessages = this.contactMessages.size;
    const recentMessages = Array.from(this.contactMessages.values())
      .filter(msg => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return msg.createdAt > dayAgo;
      }).length;
    
    return {
      totalUsers,
      totalMessages,
      recentMessages,
      activeUsersToday: Math.floor(totalUsers * 0.3), // Mock data
      messagesByDay: this.getMessagesByDay(),
      topSubjects: this.getTopSubjects()
    };
  }

  private getMessagesByDay(): { date: string; count: number }[] {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = Array.from(this.contactMessages.values())
        .filter(msg => msg.createdAt.toISOString().split('T')[0] === dateStr).length;
      last7Days.push({ date: dateStr, count });
    }
    return last7Days;
  }

  private getTopSubjects(): { subject: string; count: number }[] {
    const subjectCounts = new Map<string, number>();
    this.contactMessages.forEach(msg => {
      const count = subjectCounts.get(msg.subject) || 0;
      subjectCounts.set(msg.subject, count + 1);
    });
    
    return Array.from(subjectCounts.entries())
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

export const storage = new MemStorage();
