import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const registrationsTable = pgTable("workshop_registrations", {
  reference: text("reference").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  category: text("category").notNull(),
  affiliation: text("affiliation").notNull(),
  submitAbstract: boolean("submit_abstract").notNull().default(false),
  presentationTitle: text("presentation_title"),
  abstract: text("abstract"),
  format: text("format"),
  accommodation: boolean("accommodation").notNull().default(false),
  dietaryRestrictions: text("dietary_restrictions"),
  consent: boolean("consent").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRegistrationSchema = createInsertSchema(registrationsTable).omit({ createdAt: true });
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrationsTable.$inferSelect;