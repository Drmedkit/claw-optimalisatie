import { z } from "zod";
import { pgTable, serial, varchar, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Calculator Data Types
export const PropertyType = z.enum(["huur", "koop"]);
export type PropertyType = z.infer<typeof PropertyType>;

export const PropertySize = z.enum(["tot-50", "50-100", "100-150", "150-plus"]);
export type PropertySize = z.infer<typeof PropertySize>;

export const ServiceType = z.enum(["energielabel", "fotografie", "label-fotografie", "puntentelling", "adviesrapport"]);
export type ServiceType = z.infer<typeof ServiceType>;

export const FotografiePakket = z.enum(["basis", "totaal", "exclusief"]);
export type FotografiePakket = z.infer<typeof FotografiePakket>;

// Calculator Configuration
export const calculatorPricing = {
  // Base prices per property size (for energielabel service)
  energielabel: {
    "tot-50": 229,
    "50-100": 269,
    "100-150": 309,
    "150-plus": 349,
  },
  // Photography packages
  fotografie: {
    basis: 249,
    totaal: 325,
    exclusief: 399,
  },
  // Add-ons
  addons: {
    puntentelling: 120,
    adviesrapport: 120,
    spoedService: 80,
  },
  // BTW percentage
  btw: 0.21,
};

// Calculator State Schema (updated for new service structure)
export const calculatorStateSchema = z.object({
  propertyType: PropertyType,
  selectedService: ServiceType,
  propertySize: PropertySize.nullable(), // For energielabel pricing
  fotografiePakket: FotografiePakket.nullable(), // For fotografie services
  puntentelling: z.boolean().default(false), // For huurwoning only
  adviesrapport: z.boolean().default(false), // For huurwoning only
  spoedService: z.boolean().default(false),
  extraNotes: z.string().optional(),
});

export type CalculatorState = z.infer<typeof calculatorStateSchema>;

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 tekens bevatten"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().min(10, "Ongeldig telefoonnummer").optional(),
  message: z.string().min(10, "Bericht moet minimaal 10 tekens bevatten"),
  propertyAddress: z.string().optional(),
  calculatorData: calculatorStateSchema.optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Quote Request Schema (from calculator)
export const quoteRequestSchema = z.object({
  name: z.string().min(2, "Naam is verplicht"),
  companyName: z.string().optional(),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().min(10, "Telefoonnummer is verplicht"),
  propertyPostcode: z.string().min(6, "Postcode is verplicht"),
  propertyAddress: z.string().min(5, "Adres is verplicht"),
  extraNotes: z.string().optional(),
  calculatorState: calculatorStateSchema,
  totalPrice: z.number(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

// Quote Form Schema (without calculatorState - for frontend form validation)
export const quoteFormSchema = z.object({
  name: z.string().min(2, "Naam is verplicht"),
  companyName: z.string().optional(),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().min(10, "Telefoonnummer is verplicht"),
  propertyPostcode: z.string().min(6, "Postcode is verplicht"),
  propertyAddress: z.string().min(5, "Adres is verplicht"),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Stored Contact/Quote (with ID and timestamp)
export interface StoredContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  propertyAddress?: string;
  calculatorData?: CalculatorState;
  totalPrice?: number;
  createdAt: Date;
  type: "contact" | "quote";
}

// Database Tables (Drizzle ORM)
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  propertyPostcode: varchar("property_postcode", { length: 20 }),
  propertyAddress: varchar("property_address", { length: 500 }),
  propertyType: varchar("property_type", { length: 50 }).notNull(), // "koop" or "huur"
  selectedService: varchar("selected_service", { length: 100 }).notNull(), // "energielabel", "fotografie", etc.
  propertySize: varchar("property_size", { length: 50 }), // For energielabel pricing
  fotografiePakket: varchar("fotografie_pakket", { length: 50 }), // "basis", "totaal", "exclusief"
  puntentelling: boolean("puntentelling").default(false).notNull(), // For huurwoning only
  adviesrapport: boolean("adviesrapport").default(false).notNull(), // For huurwoning only
  spoedService: boolean("spoed_service").default(false).notNull(),
  extraNotes: text("extra_notes"),
  totalPrice: integer("total_price"), // In euros
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

// Validation schemas for form submissions
export const insertSubmissionSchema = createInsertSchema(submissions, {
  name: z.string().min(2, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().min(10, "Telefoonnummer is verplicht"),
  propertyAddress: z.string().min(5, "Adres is verplicht"),
  propertyType: PropertyType,
  selectedService: ServiceType,
  propertySize: PropertySize.nullable(),
  fotografiePakket: FotografiePakket.nullable(),
}).omit({ id: true, createdAt: true });
