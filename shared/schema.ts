import { pgTable, text, serial, integer, boolean, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("STUDENT"),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  // New required fields with defaults to avoid data loss
  title: text("title").notNull().default("Untitled"), 
  subject: text("subject").notNull().default("General"), 
  type: varchar("type", { length: 20 }).notNull().default("Note"), 
  goal: text("goal").notNull().default("General"), 
  sheetLink: text("sheet_link"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Keep legacy fields for backward compatibility with existing UI
  label: varchar("label", { length: 20 }),
  chapterName: text("chapter_name"),
  subjectName: text("subject_name"),
  goals: text("goals").array(),
  cost: varchar("cost", { length: 20 }),
  driveLink: text("drive_link"),
  isPublished: boolean("is_published").default(false).notNull(),
});

export const userNotes = pgTable("user_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  noteId: integer("note_id").notNull().references(() => notes.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (table) => {
  return {
    userNoteUnique: unique().on(table.userId, table.noteId),
  };
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userNotes: many(userNotes),
}));

export const notesRelations = relations(notes, ({ many }) => ({
  userNotes: many(userNotes),
}));

export const userNotesRelations = relations(userNotes, ({ one }) => ({
  user: one(users, {
    fields: [userNotes.userId],
    references: [users.id],
  }),
  note: one(notes, {
    fields: [userNotes.noteId],
    references: [notes.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  username: true,
  password: true,
  role: true,
});

export const signupSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export const insertUserNoteSchema = createInsertSchema(userNotes).omit({
  id: true,
  addedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type UserNote = typeof userNotes.$inferSelect;
export type InsertUserNote = z.infer<typeof insertUserNoteSchema>;
