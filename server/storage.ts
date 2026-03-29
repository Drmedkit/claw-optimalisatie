import { randomUUID } from "crypto";
import type { StoredContact, ContactFormData, QuoteRequest, InsertSubmission, Submission } from "@shared/schema";
import { submissions } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // New submission methods (PostgreSQL)
  createSubmission(data: InsertSubmission): Promise<Submission>;
  getSubmission(id: number): Promise<Submission | undefined>;
  getAllSubmissions(): Promise<Submission[]>;
  
  // Legacy methods (for backwards compatibility with old code)
  createContact(data: ContactFormData): Promise<StoredContact>;
  createQuote(data: QuoteRequest): Promise<StoredContact>;
  getContact(id: string): Promise<StoredContact | undefined>;
  getAllContacts(): Promise<StoredContact[]>;
}

// Database Storage (PostgreSQL with Drizzle ORM)
export class DatabaseStorage implements IStorage {
  async createSubmission(data: InsertSubmission): Promise<Submission> {
    const [submission] = await db
      .insert(submissions)
      .values(data)
      .returning();
    return submission;
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id));
    return submission || undefined;
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return await db.select().from(submissions);
  }

  // Legacy methods (for backwards compatibility)
  async createContact(data: ContactFormData): Promise<StoredContact> {
    const id = randomUUID();
    const contact: StoredContact = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      propertyAddress: data.propertyAddress,
      calculatorData: data.calculatorData,
      createdAt: new Date(),
      type: "contact",
    };
    return contact;
  }

  async createQuote(data: QuoteRequest): Promise<StoredContact> {
    const id = randomUUID();
    const quote: StoredContact = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      propertyAddress: data.propertyAddress,
      calculatorData: data.calculatorState,
      totalPrice: data.totalPrice,
      createdAt: new Date(),
      type: "quote",
    };
    return quote;
  }

  async getContact(id: string): Promise<StoredContact | undefined> {
    return undefined;
  }

  async getAllContacts(): Promise<StoredContact[]> {
    return [];
  }
}

export const storage = new DatabaseStorage();
