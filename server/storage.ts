import { users, notes, userNotes, goals, subjects, type User, type InsertUser, type Note, type InsertNote, type UserNote, type InsertUserNote, type Goal, type InsertGoal, type Subject, type InsertSubject } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, sql, inArray } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
  checkUniqueCredentials(username: string, email: string, phoneNumber?: string): Promise<{ field: string, exists: boolean } | null>;
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
  addUserNote(userId: number, noteId: number): Promise<UserNote>;
  removeUserNote(userId: number, noteId: number): Promise<boolean>;
  getUserNotes(userId: number): Promise<Note[]>;
  isNoteAddedByUser(userId: number, noteId: number): Promise<boolean>;
  // Goals and Subjects methods
  getGoals(): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  getSubjectsByGoal(goalId: number): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  getAllSubjects(): Promise<Subject[]>;
  // User notes summary
  getUserNotesGroupedBySubject(userId: number): Promise<{subject: string, count: number}[]>;
  // Password update
  updateUserPassword(userId: number, hashedPassword: string): Promise<void>;
  // Users management
  getUsersWithFilters(search?: string, goalFilter?: number, sortBy?: 'newest' | 'oldest', page?: number, limit?: number): Promise<{ users: User[], total: number, goals: Goal[] }>;
  getUsersSummary(): Promise<{ totalUsers: number, signupsThisMonth: number, signupsToday: number }>;
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

  async getUserNotesGroupedBySubject(userId: number): Promise<{subject: string, count: number}[]> {
    throw new Error("UserNote functionality not implemented in MemStorage");
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    throw new Error("Password update functionality not implemented in MemStorage");
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

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user || undefined;
  }

  async checkUniqueCredentials(username: string, email: string, phoneNumber?: string): Promise<{ field: string, exists: boolean } | null> {
    // Build OR conditions for checking duplicates
    const conditions = [
      eq(users.username, username),
      eq(users.email, email)
    ];
    
    if (phoneNumber) {
      conditions.push(eq(users.phoneNumber, phoneNumber));
    }

    const [existingUser] = await db
      .select({
        username: users.username,
        email: users.email,
        phoneNumber: users.phoneNumber
      })
      .from(users)
      .where(or(...conditions))
      .limit(1);

    if (!existingUser) {
      return null; // No conflicts
    }

    // Return which field is conflicting
    if (existingUser.username === username) {
      return { field: 'username', exists: true };
    }
    if (existingUser.email === email) {
      return { field: 'email', exists: true };
    }
    if (phoneNumber && existingUser.phoneNumber === phoneNumber) {
      return { field: 'phoneNumber', exists: true };
    }

    return null;
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
  async addUserNote(userId: number, noteId: number): Promise<UserNote> {
    const [userNote] = await db
      .insert(userNotes)
      .values({ userId, noteId })
      .returning();
    return userNote;
  }

  async removeUserNote(userId: number, noteId: number): Promise<boolean> {
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

  async getUserNotesGroupedBySubject(userId: number): Promise<{subject: string, count: number}[]> {
    const result = await db
      .select({
        subject: notes.subjectName,
        count: sql<number>`count(*)::int`
      })
      .from(userNotes)
      .innerJoin(notes, eq(userNotes.noteId, notes.id))
      .where(eq(userNotes.userId, userId))
      .groupBy(notes.subjectName)
      .orderBy(sql`count(*) DESC`, notes.subjectName);
    
    return result.map(r => ({
      subject: r.subject || 'Unknown',
      count: r.count
    }));
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  async getUsersWithFilters(search?: string, goalFilter?: number, sortBy?: 'newest' | 'oldest', page?: number, limit?: number): Promise<{ users: User[], total: number, goals: Goal[] }> {
    const offset = page && limit ? (page - 1) * limit : 0;
    const limitClause = limit || 10;

    // Build the base query with joins
    let query = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        password: users.password,
        gender: users.gender,
        goalId: users.goalId,
        phoneNumber: users.phoneNumber,
        profilePic: users.profilePic,
        role: users.role,
        goalName: goals.name,
      })
      .from(users)
      .leftJoin(goals, eq(users.goalId, goals.id))
      .$dynamic();

    // Add search filter
    if (search) {
      query = query.where(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.phoneNumber, `%${search}%`)
        )
      );
    }

    // Add goal filter
    if (goalFilter) {
      query = query.where(eq(users.goalId, goalFilter));
    }

    // Add sorting - assuming users table has a createdAt field, if not we'll use id as proxy
    if (sortBy === 'newest') {
      query = query.orderBy(sql`${users.id} DESC`);
    } else if (sortBy === 'oldest') {
      query = query.orderBy(sql`${users.id} ASC`);
    } else {
      query = query.orderBy(sql`${users.id} DESC`); // Default to newest
    }

    // Get total count for pagination
    let countQuery = db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .$dynamic();

    // Apply same filters to count query
    if (search) {
      countQuery = countQuery.where(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.phoneNumber, `%${search}%`)
        )
      );
    }

    if (goalFilter) {
      countQuery = countQuery.where(eq(users.goalId, goalFilter));
    }

    // Execute queries
    const [usersResult, countResult, goalsResult] = await Promise.all([
      query.limit(limitClause).offset(offset),
      countQuery,
      db.select().from(goals).orderBy(goals.name)
    ]);

    // Transform the results to match User interface
    const transformedUsers: User[] = usersResult.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: user.password,
      gender: user.gender,
      goalId: user.goalId,
      phoneNumber: user.phoneNumber,
      profilePic: user.profilePic,
      role: user.role,
    }));

    return {
      users: transformedUsers,
      total: countResult[0]?.count || 0,
      goals: goalsResult
    };
  }

  async getUsersSummary(): Promise<{ totalUsers: number, signupsThisMonth: number, signupsToday: number }> {
    const now = new Date();
    
    // Get start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get start of today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get end of today
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    // Execute all queries in parallel
    const [totalUsersResult, monthlyUsersResult, todayUsersResult] = await Promise.all([
      // Total users count
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      
      // Users this month (using ID as proxy for creation date since we don't have createdAt)
      // For now, we'll use a simple approach - in production you'd have createdAt timestamps
      db.select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(sql`${users.id} >= (SELECT COALESCE(MAX(id), 0) - 30 FROM ${users})`),
      
      // Users today (using ID as proxy)
      db.select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(sql`${users.id} >= (SELECT COALESCE(MAX(id), 0) - 1 FROM ${users})`)
    ]);

    return {
      totalUsers: totalUsersResult[0]?.count || 0,
      signupsThisMonth: monthlyUsersResult[0]?.count || 0,
      signupsToday: todayUsersResult[0]?.count || 0
    };
  }
}

export const storage = new DatabaseStorage();
