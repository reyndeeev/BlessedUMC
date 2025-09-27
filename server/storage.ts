import { 
  type User, type InsertUser, type ContactMessage, type InsertContactMessage,
  type Sermon, type InsertSermon, type Birthday, type InsertBirthday,
  type Anniversary, type InsertAnniversary,
  users, contactMessages, sermons, birthdays, anniversaries 
} from "@shared/schema";
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
  
  // Sermon methods
  createSermon(sermon: InsertSermon): Promise<Sermon>;
  getSermons(): Promise<Sermon[]>;
  getFeaturedSermon(): Promise<Sermon | undefined>;
  getRecentSermons(limit?: number): Promise<Sermon[]>;
  updateSermon(id: string, sermon: Partial<InsertSermon>): Promise<Sermon | undefined>;
  deleteSermon(id: string): Promise<boolean>;
  
  // Birthday methods
  createBirthday(birthday: InsertBirthday): Promise<Birthday>;
  getBirthdays(): Promise<Birthday[]>;
  getUpcomingBirthdays(days?: number): Promise<Birthday[]>;
  updateBirthday(id: string, birthday: Partial<InsertBirthday>): Promise<Birthday | undefined>;
  deleteBirthday(id: string): Promise<boolean>;
  
  // Anniversary methods
  createAnniversary(anniversary: InsertAnniversary): Promise<Anniversary>;
  getAnniversaries(): Promise<Anniversary[]>;
  getUpcomingAnniversaries(days?: number): Promise<Anniversary[]>;
  updateAnniversary(id: string, anniversary: Partial<InsertAnniversary>): Promise<Anniversary | undefined>;
  deleteAnniversary(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof getDatabaseConnection>;
  
  constructor() {
    this.db = getDatabaseConnection();
    // Don't create admin immediately, wait for first database operation to ensure connection is ready
    this.ensureDefaultAdmin();
  }

  private async ensureDefaultAdmin() {
    // Always create default admin in development
    if (process.env.NODE_ENV !== 'development' && process.env.CREATE_DEFAULT_ADMIN !== 'true') {
      return;
    }
    
    // Create a default admin user immediately - no timeout
    try {
      const existingAdmin = await this.getUserByUsername("admin");
      if (!existingAdmin) {
        const defaultAdmin = await this.createUser({
          username: "admin",
          password: "admin123"
        });
        console.log("Default admin user created (database):", { username: defaultAdmin.username, id: defaultAdmin.id });
      } else {
        console.log("Admin user already exists in database:", { username: existingAdmin.username, id: existingAdmin.id });
      }
    } catch (error) {
      console.warn("Could not create default admin in database:", error instanceof Error ? error.message : String(error));
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    const [user] = await this.db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
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
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [message] = await this.db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    return await this.db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    return await this.db.select().from(users).orderBy(users.username);
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const result = await this.db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAnalytics(): Promise<AnalyticsData> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
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
    if (!this.db) {
      throw new Error("Database connection not available");
    }
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
    if (!this.db) {
      throw new Error("Database connection not available");
    }
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

  // Sermon methods
  async createSermon(insertSermon: InsertSermon): Promise<Sermon> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [sermon] = await this.db
      .insert(sermons)
      .values(insertSermon)
      .returning();
    return sermon;
  }

  async getSermons(): Promise<Sermon[]> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    return await this.db.select().from(sermons).orderBy(desc(sermons.date));
  }

  async getFeaturedSermon(): Promise<Sermon | undefined> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [sermon] = await this.db.select().from(sermons).where(eq(sermons.isFeatured, true)).limit(1);
    return sermon || undefined;
  }

  async getRecentSermons(limit: number = 6): Promise<Sermon[]> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    return await this.db.select().from(sermons).orderBy(desc(sermons.date)).limit(limit);
  }

  async updateSermon(id: string, updateData: Partial<InsertSermon>): Promise<Sermon | undefined> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [sermon] = await this.db
      .update(sermons)
      .set(updateData)
      .where(eq(sermons.id, id))
      .returning();
    return sermon || undefined;
  }

  async deleteSermon(id: string): Promise<boolean> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const result = await this.db.delete(sermons).where(eq(sermons.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Birthday methods
  async createBirthday(insertBirthday: InsertBirthday): Promise<Birthday> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [birthday] = await this.db
      .insert(birthdays)
      .values(insertBirthday)
      .returning();
    return birthday;
  }

  async getBirthdays(): Promise<Birthday[]> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    return await this.db.select().from(birthdays).where(eq(birthdays.isActive, true)).orderBy(birthdays.firstName);
  }

  async getUpcomingBirthdays(days: number = 30): Promise<Birthday[]> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    
    // Get all active birthdays and filter in application logic
    // This is simpler and avoids complex SQL parameter binding issues
    const allBirthdays = await this.db
      .select()
      .from(birthdays)
      .where(eq(birthdays.isActive, true));
    
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    
    return allBirthdays
      .filter(birthday => {
        const birthDate = new Date(birthday.birthDate);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        
        const birthDateNumber = birthMonth * 100 + birthDay;
        const currentDateNumber = currentMonth * 100 + currentDay;
        const endDateNumber = endMonth * 100 + endDay;
        
        // Handle year wrap-around (e.g., December to January)
        if (endDateNumber < currentDateNumber) {
          return birthDateNumber >= currentDateNumber || birthDateNumber <= endDateNumber;
        } else {
          return birthDateNumber >= currentDateNumber && birthDateNumber <= endDateNumber;
        }
      })
      .sort((a, b) => {
        const aDate = new Date(a.birthDate);
        const bDate = new Date(b.birthDate);
        return (aDate.getMonth() * 100 + aDate.getDate()) - (bDate.getMonth() * 100 + bDate.getDate());
      });
  }

  async updateBirthday(id: string, updateData: Partial<InsertBirthday>): Promise<Birthday | undefined> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [birthday] = await this.db
      .update(birthdays)
      .set(updateData)
      .where(eq(birthdays.id, id))
      .returning();
    return birthday || undefined;
  }

  async deleteBirthday(id: string): Promise<boolean> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const result = await this.db.delete(birthdays).where(eq(birthdays.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Anniversary methods
  async createAnniversary(insertAnniversary: InsertAnniversary): Promise<Anniversary> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [anniversary] = await this.db
      .insert(anniversaries)
      .values(insertAnniversary)
      .returning();
    return anniversary;
  }

  async getAnniversaries(): Promise<Anniversary[]> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    return await this.db.select().from(anniversaries).where(eq(anniversaries.isActive, true)).orderBy(anniversaries.husbandName);
  }

  async getUpcomingAnniversaries(days: number = 30): Promise<Anniversary[]> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    
    // Get all active anniversaries and filter in application logic
    // This is simpler and avoids complex SQL parameter binding issues
    const allAnniversaries = await this.db
      .select()
      .from(anniversaries)
      .where(eq(anniversaries.isActive, true));
    
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    
    return allAnniversaries
      .filter(anniversary => {
        const anniversaryDate = new Date(anniversary.anniversaryDate);
        const anniversaryMonth = anniversaryDate.getMonth() + 1;
        const anniversaryDay = anniversaryDate.getDate();
        
        const anniversaryDateNumber = anniversaryMonth * 100 + anniversaryDay;
        const currentDateNumber = currentMonth * 100 + currentDay;
        const endDateNumber = endMonth * 100 + endDay;
        
        // Handle year wrap-around (e.g., December to January)
        if (endDateNumber < currentDateNumber) {
          return anniversaryDateNumber >= currentDateNumber || anniversaryDateNumber <= endDateNumber;
        } else {
          return anniversaryDateNumber >= currentDateNumber && anniversaryDateNumber <= endDateNumber;
        }
      })
      .sort((a, b) => {
        const aDate = new Date(a.anniversaryDate);
        const bDate = new Date(b.anniversaryDate);
        return (aDate.getMonth() * 100 + aDate.getDate()) - (bDate.getMonth() * 100 + bDate.getDate());
      });
  }

  async updateAnniversary(id: string, updateData: Partial<InsertAnniversary>): Promise<Anniversary | undefined> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const [anniversary] = await this.db
      .update(anniversaries)
      .set(updateData)
      .where(eq(anniversaries.id, id))
      .returning();
    return anniversary || undefined;
  }

  async deleteAnniversary(id: string): Promise<boolean> {
    if (!this.db) {
      throw new Error("Database connection not available");
    }
    const result = await this.db.delete(anniversaries).where(eq(anniversaries.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

// In-memory storage implementation for fallback
export class MemStorage implements IStorage {
  private users: User[] = [];
  private contactMessages: ContactMessage[] = [];
  private sermons: Sermon[] = [];
  private birthdays: Birthday[] = [];
  private anniversaries: Anniversary[] = [];
  private idCounter = 1;

  constructor() {
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    // Only create default admin in development environment
    if (process.env.NODE_ENV !== 'development' && process.env.CREATE_DEFAULT_ADMIN !== 'true') {
      return;
    }
    
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

  // Sermon methods for MemStorage
  async createSermon(insertSermon: InsertSermon): Promise<Sermon> {
    const sermon: Sermon = {
      id: (this.idCounter++).toString(),
      title: insertSermon.title,
      pastor: insertSermon.pastor,
      date: insertSermon.date,
      description: insertSermon.description || null,
      videoUrl: insertSermon.videoUrl || null,
      audioUrl: insertSermon.audioUrl || null,
      thumbnailUrl: insertSermon.thumbnailUrl || null,
      isLive: insertSermon.isLive || false,
      isFeatured: insertSermon.isFeatured || false,
      createdAt: new Date()
    };
    this.sermons.push(sermon);
    return sermon;
  }

  async getSermons(): Promise<Sermon[]> {
    return [...this.sermons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getFeaturedSermon(): Promise<Sermon | undefined> {
    return this.sermons.find(sermon => sermon.isFeatured);
  }

  async getRecentSermons(limit: number = 6): Promise<Sermon[]> {
    const sermons = await this.getSermons();
    return sermons.slice(0, limit);
  }

  async updateSermon(id: string, updateData: Partial<InsertSermon>): Promise<Sermon | undefined> {
    const index = this.sermons.findIndex(sermon => sermon.id === id);
    if (index > -1) {
      this.sermons[index] = { ...this.sermons[index], ...updateData };
      return this.sermons[index];
    }
    return undefined;
  }

  async deleteSermon(id: string): Promise<boolean> {
    const index = this.sermons.findIndex(sermon => sermon.id === id);
    if (index > -1) {
      this.sermons.splice(index, 1);
      return true;
    }
    return false;
  }

  // Birthday methods for MemStorage
  async createBirthday(insertBirthday: InsertBirthday): Promise<Birthday> {
    const birthday: Birthday = {
      id: (this.idCounter++).toString(),
      firstName: insertBirthday.firstName,
      lastName: insertBirthday.lastName,
      birthDate: insertBirthday.birthDate,
      phone: insertBirthday.phone || null,
      email: insertBirthday.email || null,
      isActive: insertBirthday.isActive || true,
      createdAt: new Date()
    };
    this.birthdays.push(birthday);
    return birthday;
  }

  async getBirthdays(): Promise<Birthday[]> {
    return this.birthdays.filter(birthday => birthday.isActive).sort((a, b) => a.firstName.localeCompare(b.firstName));
  }

  async getUpcomingBirthdays(days: number = 30): Promise<Birthday[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    
    return this.birthdays
      .filter(birthday => birthday.isActive)
      .filter(birthday => {
        const birthDate = new Date(birthday.birthDate);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        
        const birthDateNumber = birthMonth * 100 + birthDay;
        const currentDateNumber = currentMonth * 100 + currentDay;
        const endDateNumber = endMonth * 100 + endDay;
        
        // Handle year wrap-around (e.g., December to January)
        if (endDateNumber < currentDateNumber) {
          return birthDateNumber >= currentDateNumber || birthDateNumber <= endDateNumber;
        } else {
          return birthDateNumber >= currentDateNumber && birthDateNumber <= endDateNumber;
        }
      })
      .sort((a, b) => {
        const aDate = new Date(a.birthDate);
        const bDate = new Date(b.birthDate);
        return (aDate.getMonth() * 100 + aDate.getDate()) - (bDate.getMonth() * 100 + bDate.getDate());
      });
  }

  async updateBirthday(id: string, updateData: Partial<InsertBirthday>): Promise<Birthday | undefined> {
    const index = this.birthdays.findIndex(birthday => birthday.id === id);
    if (index > -1) {
      this.birthdays[index] = { ...this.birthdays[index], ...updateData };
      return this.birthdays[index];
    }
    return undefined;
  }

  async deleteBirthday(id: string): Promise<boolean> {
    const index = this.birthdays.findIndex(birthday => birthday.id === id);
    if (index > -1) {
      this.birthdays.splice(index, 1);
      return true;
    }
    return false;
  }

  // Anniversary methods for MemStorage
  async createAnniversary(insertAnniversary: InsertAnniversary): Promise<Anniversary> {
    const anniversary: Anniversary = {
      id: (this.idCounter++).toString(),
      husbandName: insertAnniversary.husbandName,
      wifeName: insertAnniversary.wifeName,
      anniversaryDate: insertAnniversary.anniversaryDate,
      phone: insertAnniversary.phone || null,
      email: insertAnniversary.email || null,
      yearsMarried: insertAnniversary.yearsMarried || null,
      isActive: insertAnniversary.isActive || true,
      createdAt: new Date()
    };
    this.anniversaries.push(anniversary);
    return anniversary;
  }

  async getAnniversaries(): Promise<Anniversary[]> {
    return this.anniversaries.filter(anniversary => anniversary.isActive).sort((a, b) => a.husbandName.localeCompare(b.husbandName));
  }

  async getUpcomingAnniversaries(days: number = 30): Promise<Anniversary[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);
    
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    
    return this.anniversaries
      .filter(anniversary => anniversary.isActive)
      .filter(anniversary => {
        const anniversaryDate = new Date(anniversary.anniversaryDate);
        const anniversaryMonth = anniversaryDate.getMonth() + 1;
        const anniversaryDay = anniversaryDate.getDate();
        
        const anniversaryDateNumber = anniversaryMonth * 100 + anniversaryDay;
        const currentDateNumber = currentMonth * 100 + currentDay;
        const endDateNumber = endMonth * 100 + endDay;
        
        // Handle year wrap-around (e.g., December to January)
        if (endDateNumber < currentDateNumber) {
          return anniversaryDateNumber >= currentDateNumber || anniversaryDateNumber <= endDateNumber;
        } else {
          return anniversaryDateNumber >= currentDateNumber && anniversaryDateNumber <= endDateNumber;
        }
      })
      .sort((a, b) => {
        const aDate = new Date(a.anniversaryDate);
        const bDate = new Date(b.anniversaryDate);
        return (aDate.getMonth() * 100 + aDate.getDate()) - (bDate.getMonth() * 100 + bDate.getDate());
      });
  }

  async updateAnniversary(id: string, updateData: Partial<InsertAnniversary>): Promise<Anniversary | undefined> {
    const index = this.anniversaries.findIndex(anniversary => anniversary.id === id);
    if (index > -1) {
      this.anniversaries[index] = { ...this.anniversaries[index], ...updateData };
      return this.anniversaries[index];
    }
    return undefined;
  }

  async deleteAnniversary(id: string): Promise<boolean> {
    const index = this.anniversaries.findIndex(anniversary => anniversary.id === id);
    if (index > -1) {
      this.anniversaries.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Initialize storage with better error handling and fallback
let storage: IStorage;

// Function to test database connectivity
async function testDatabaseConnection(db: DatabaseStorage): Promise<boolean> {
  try {
    // Try a simple operation to test connectivity
    await db.getAnalytics();
    return true;
  } catch (error) {
    console.warn("Database connectivity test failed:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Initialize storage
async function initializeStorage(): Promise<IStorage> {
  const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  
  if (databaseUrl && databaseUrl.includes('postgresql://')) {
    try {
      const dbStorage = new DatabaseStorage();
      console.log("Testing DatabaseStorage connection...");
      
      // Test connection in background - don't wait for it
      setTimeout(async () => {
        const isConnected = await testDatabaseConnection(dbStorage);
        if (!isConnected) {
          console.warn("Database connection failed, recommend switching to MemStorage for development");
        }
      }, 1000);
      
      console.log("Using DatabaseStorage with PostgreSQL");
      return dbStorage;
    } catch (error) {
      console.warn("Failed to initialize DatabaseStorage:", error instanceof Error ? error.message : String(error));
      console.log("Falling back to MemStorage");
      return new MemStorage();
    }
  } else {
    console.log("No DATABASE_URL configured, using MemStorage for development");
    return new MemStorage();
  }
}

// For development/testing in environments with SSL issues, force MemStorage
const forceMemStorage = process.env.FORCE_MEM_STORAGE === 'true' || 
                       (process.env.NODE_ENV === 'development' && process.env.REPL_ID);

if (forceMemStorage) {
  console.log("Forcing MemStorage for development environment (SSL issues with Neon in Replit)");
  storage = new MemStorage();
} else {
  // Initialize asynchronously and export
  storage = new MemStorage(); // Temporary fallback
  initializeStorage().then(initializedStorage => {
    storage = initializedStorage;
  }).catch(error => {
    console.error("Failed to initialize storage:", error);
    storage = new MemStorage();
  });
}

export { storage };