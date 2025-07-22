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
  gender: varchar("gender", { length: 10 }),
  goalId: integer("goal_id").references(() => goals.id),
  phoneNumber: varchar("phone_number", { length: 15 }),
  role: varchar("role", { length: 20 }).notNull().default("STUDENT"),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  goalId: integer("goal_id").notNull().references(() => goals.id, { onDelete: "cascade" }),
  category: text("category"), // Optional field for Boards (Science/Commerce)
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    subjectGoalUnique: unique().on(table.name, table.goalId, table.category),
  };
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

export const goalsRelations = relations(goals, ({ many }) => ({
  subjects: many(subjects),
}));

export const subjectsRelations = relations(subjects, ({ one }) => ({
  goal: one(goals, {
    fields: [subjects.goalId],
    references: [goals.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const signupSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-z_]+$/, "Username must be lowercase letters and underscores only, no numbers or spaces"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  goalId: z.number().int().positive("Please select a goal"),
  phoneNumber: z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
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

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type UserNote = typeof userNotes.$inferSelect;
export type InsertUserNote = z.infer<typeof insertUserNoteSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
