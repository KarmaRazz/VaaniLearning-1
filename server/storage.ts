import { users, notes, userNotes, goals, subjects, type User, type InsertUser, type Note, type InsertNote, type UserNote, type InsertUserNote, type Goal, type InsertGoal, type Subject, type InsertSubject } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, sql, inArray } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfilePic(userId: number, profilePicPath: string): Promise<User>;
  getNotes(): Promise<Note[]>;
  getPublishedNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  getNote(id: number): Promise<Note | undefined>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  getNotesWithPagination(page: number, limit: number, search?: string, goalFilter?: string, subjectFilter?: string): Promise<{ notes: Note[], total: number }>;
  getUniqueSubjects(): Promise<string[]>;
  deleteMultipleNotes(ids: number[]): Promise<boolean>;
  // UserNote methods
  addNoteToUser(userId: number, noteId: number): Promise<UserNote>;
  removeNoteFromUser(userId: number, noteId: number): Promise<boolean>;
  getUserNotes(userId: number): Promise<Note[]>;
  isNoteAddedByUser(userId: number, noteId: number): Promise<boolean>;
  // Goals and Subjects methods
  getGoals(): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  getSubjectsByGoal(goalId: number): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  getAllSubjects(): Promise<Subject[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notes: Map<number, Note>;
  currentId: number;
  currentNoteId: number;

  constructor() {
    this.users = new Map();
    this.notes = new Map();
    this.currentId = 1;
    this.currentNoteId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "STUDENT",
      gender: insertUser.gender || null,
      goalId: insertUser.goalId || null,
      phoneNumber: insertUser.phoneNumber || null,
      profilePic: null
    };
    this.users.set(id, user);
    return user;
  }

  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async getPublishedNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.isPublished);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.currentNoteId++;
    const note: Note = { 
      ...insertNote, 
      id, 
      createdAt: new Date(),
      title: insertNote.title || insertNote.chapterName || "Untitled",
      subject: insertNote.subject || insertNote.subjectName || "General",
      type: insertNote.type || insertNote.label || "Note",
      goal: insertNote.goal || (insertNote.goals && insertNote.goals.length > 0 ? insertNote.goals[0] : "General"),
      sheetLink: insertNote.sheetLink ?? null,
      label: insertNote.label ?? null,
      chapterName: insertNote.chapterName ?? null,
      subjectName: insertNote.subjectName ?? null,
      goals: insertNote.goals ?? null,
      cost: insertNote.cost ?? null,
      driveLink: insertNote.driveLink ?? null,
      isPublished: insertNote.isPublished ?? false,
    };
    this.notes.set(id, note);
    return note;
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async updateNote(id: number, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) return undefined;
    
    const updatedNote: Note = { ...existingNote, ...updateData };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  async getNotesWithPagination(page: number = 1, limit: number = 20, search?: string, goalFilter?: string, subjectFilter?: string): Promise<{ notes: Note[], total: number }> {
    const allNotes = Array.from(this.notes.values());
    let filteredNotes = allNotes;

    if (search) {
      filteredNotes = filteredNotes.filter(note => 
        (note.chapterName && note.chapterName.toLowerCase().includes(search.toLowerCase())) ||
        (note.subjectName && note.subjectName.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (goalFilter) {
      filteredNotes = filteredNotes.filter(note => note.goals && note.goals.includes(goalFilter));
    }

    if (subjectFilter) {
      filteredNotes = filteredNotes.filter(note => note.subjectName === subjectFilter);
    }

    const total = filteredNotes.length;
    const offset = (page - 1) * limit;
    const paginatedNotes = filteredNotes.slice(offset, offset + limit);

    return { notes: paginatedNotes, total };
  }

  async getUniqueSubjects(): Promise<string[]> {
    const allNotes = Array.from(this.notes.values());
    const subjects = Array.from(new Set(allNotes.map(note => note.subjectName).filter((subject): subject is string => Boolean(subject))));
    return subjects;
  }

  // UserNote methods for MemStorage (stub implementations)
  async addNoteToUser(userId: number, noteId: number): Promise<UserNote> {
    throw new Error("UserNote functionality not implemented in MemStorage");
  }

  async removeNoteFromUser(userId: number, noteId: number): Promise<boolean> {
    throw new Error("UserNote functionality not implemented in MemStorage");
  }

  async getUserNotes(userId: number): Promise<Note[]> {
    throw new Error("UserNote functionality not implemented in MemStorage");
  }

  async isNoteAddedByUser(userId: number, noteId: number): Promise<boolean> {
    throw new Error("UserNote functionality not implemented in MemStorage");
  }

  async deleteMultipleNotes(ids: number[]): Promise<boolean> {
    ids.forEach(id => this.notes.delete(id));
    return true;
  }

  // Goals and Subjects methods for MemStorage (stub implementations)
  async getGoals(): Promise<Goal[]> {
    throw new Error("Goals functionality not implemented in MemStorage");
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    throw new Error("Goals functionality not implemented in MemStorage");
  }

  async getSubjectsByGoal(goalId: number): Promise<Subject[]> {
    throw new Error("Subjects functionality not implemented in MemStorage");
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    throw new Error("Subjects functionality not implemented in MemStorage");
  }

  async getAllSubjects(): Promise<Subject[]> {
    throw new Error("Subjects functionality not implemented in MemStorage");
  }

  async updateUserProfilePic(userId: number, profilePicPath: string): Promise<User> {
    throw new Error("Profile picture functionality not implemented in MemStorage");
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getNotes(): Promise<Note[]> {
    return await db.select().from(notes);
  }

  async getPublishedNotes(): Promise<Note[]> {
    return await db.select().from(notes).where(eq(notes.isPublished, true));
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values(insertNote)
      .returning();
    return note;
  }

  async getNote(id: number): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note || undefined;
  }

  async updateNote(id: number, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const [note] = await db
      .update(notes)
      .set(updateData)
      .where(eq(notes.id, id))
      .returning();
    return note || undefined;
  }

  async deleteNote(id: number): Promise<boolean> {
    const result = await db.delete(notes).where(eq(notes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getNotesWithPagination(page: number = 1, limit: number = 20, search?: string, goalFilter?: string, subjectFilter?: string, activeTab?: string): Promise<{ notes: Note[], total: number }> {
    const offset = (page - 1) * limit;
    
    const conditions = [];
    
    // Filter by activeTab first (Note vs Formula/Derivation)
    if (activeTab === 'notes') {
      conditions.push(eq(notes.label, 'Note'));
    } else if (activeTab === 'formulas') {
      conditions.push(or(eq(notes.label, 'Formula'), eq(notes.label, 'Derivation')));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(notes.chapterName, `%${search}%`),
          ilike(notes.subjectName, `%${search}%`)
        )
      );
    }
    
    if (goalFilter) {
      // Use PostgreSQL = ANY() syntax which is safer for text arrays
      conditions.push(sql`${goalFilter} = ANY(${notes.goals})`);
    }
    
    if (subjectFilter) {
      conditions.push(eq(notes.subjectName, subjectFilter));
    }
    
    const whereCondition = conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined;
    
    const [notesResult, countResult] = await Promise.all([
      db.select().from(notes).where(whereCondition).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(notes).where(whereCondition)
    ]);
    
    return {
      notes: notesResult,
      total: countResult[0]?.count || 0
    };
  }

  async getUniqueSubjects(): Promise<string[]> {
    const result = await db.selectDistinct({ subjectName: notes.subjectName }).from(notes);
    return result.map(r => r.subjectName).filter((subject): subject is string => Boolean(subject));
  }

  async deleteMultipleNotes(ids: number[]): Promise<boolean> {
    if (ids.length === 0) return true;
    
    // Use inArray for better type safety with Drizzle
    const result = await db.delete(notes).where(
      inArray(notes.id, ids)
    );
    
    return true;
  }

  // UserNote methods for DatabaseStorage
  async addNoteToUser(userId: number, noteId: number): Promise<UserNote> {
    const [userNote] = await db
      .insert(userNotes)
      .values({ userId, noteId })
      .returning();
    return userNote;
  }

  async removeNoteFromUser(userId: number, noteId: number): Promise<boolean> {
    const result = await db
      .delete(userNotes)
      .where(and(eq(userNotes.userId, userId), eq(userNotes.noteId, noteId)));
    return (result.rowCount ?? 0) > 0;
  }

  async getUserNotes(userId: number): Promise<Note[]> {
    const result = await db
      .select({
        id: notes.id,
        title: notes.title,
        subject: notes.subject,
        type: notes.type,
        goal: notes.goal,
        sheetLink: notes.sheetLink,
        createdAt: notes.createdAt,
        label: notes.label,
        chapterName: notes.chapterName,
        subjectName: notes.subjectName,
        goals: notes.goals,
        cost: notes.cost,
        driveLink: notes.driveLink,
        isPublished: notes.isPublished,
      })
      .from(userNotes)
      .innerJoin(notes, eq(userNotes.noteId, notes.id))
      .where(eq(userNotes.userId, userId));
    
    return result;
  }

  async isNoteAddedByUser(userId: number, noteId: number): Promise<boolean> {
    const [result] = await db
      .select({ id: userNotes.id })
      .from(userNotes)
      .where(and(eq(userNotes.userId, userId), eq(userNotes.noteId, noteId)))
      .limit(1);
    
    return Boolean(result);
  }

  // Goals and Subjects methods for DatabaseStorage
  async getGoals(): Promise<Goal[]> {
    return await db.select().from(goals).orderBy(goals.name);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values(insertGoal)
      .returning();
    return goal;
  }

  async getSubjectsByGoal(goalId: number): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(eq(subjects.goalId, goalId))
      .orderBy(subjects.category, subjects.name);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const [subject] = await db
      .insert(subjects)
      .values(insertSubject)
      .returning();
    return subject;
  }

  async getAllSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects).orderBy(subjects.name);
  }

  async updateUserProfilePic(userId: number, profilePicPath: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ profilePic: profilePicPath })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
