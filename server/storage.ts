import { users, notes, type User, type InsertUser, type Note, type InsertNote } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getNotes(): Promise<Note[]>;
  getPublishedNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  getNote(id: number): Promise<Note | undefined>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  getNotesWithPagination(page: number, limit: number, search?: string, goalFilter?: string, subjectFilter?: string): Promise<{ notes: Note[], total: number }>;
  getUniqueSubjects(): Promise<string[]>;
  deleteMultipleNotes(ids: number[]): Promise<boolean>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
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
    const note: Note = { ...insertNote, id };
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
        note.chapterName.toLowerCase().includes(search.toLowerCase()) ||
        note.subjectName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (goalFilter) {
      filteredNotes = filteredNotes.filter(note => note.goals.includes(goalFilter));
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
    const subjects = [...new Set(allNotes.map(note => note.subjectName))];
    return subjects.filter(Boolean);
  }

  async deleteMultipleNotes(ids: number[]): Promise<boolean> {
    ids.forEach(id => this.notes.delete(id));
    return true;
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
    return result.rowCount !== undefined && result.rowCount > 0;
  }

  async getNotesWithPagination(page: number = 1, limit: number = 20, search?: string, goalFilter?: string, subjectFilter?: string): Promise<{ notes: Note[], total: number }> {
    const offset = (page - 1) * limit;
    
    let query = db.select().from(notes);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(notes);
    
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          ilike(notes.chapterName, `%${search}%`),
          ilike(notes.subjectName, `%${search}%`)
        )
      );
    }
    
    if (goalFilter) {
      conditions.push(sql`${notes.goals} @> ${JSON.stringify([goalFilter])}`);
    }
    
    if (subjectFilter) {
      conditions.push(eq(notes.subjectName, subjectFilter));
    }
    
    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereCondition);
      countQuery = countQuery.where(whereCondition);
    }
    
    const [notesResult, countResult] = await Promise.all([
      query.limit(limit).offset(offset).execute(),
      countQuery.execute()
    ]);
    
    return {
      notes: notesResult,
      total: countResult[0]?.count || 0
    };
  }

  async getUniqueSubjects(): Promise<string[]> {
    const result = await db.selectDistinct({ subjectName: notes.subjectName }).from(notes);
    return result.map(r => r.subjectName).filter(Boolean);
  }

  async deleteMultipleNotes(ids: number[]): Promise<boolean> {
    if (ids.length === 0) return true;
    
    const result = await db.delete(notes).where(
      sql`${notes.id} = ANY(${ids})`
    );
    
    return true;
  }
}

export const storage = new DatabaseStorage();
