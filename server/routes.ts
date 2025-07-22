import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertGoalSchema, insertSubjectSchema } from "@shared/schema";
import { signup, login, logout, getCurrentUser, authenticateToken, AuthenticatedRequest } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", authenticateToken, getCurrentUser);

  // put application routes here
  // prefix all routes with /api

  // Get all notes (public endpoint - only published)
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getPublishedNotes();
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // Get all notes for admin (including unpublished)
  app.get("/api/admin/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes);
    } catch (error) {
      console.error("Error fetching admin notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });



  // Create new note (admin endpoint)
  app.post("/api/admin/notes", async (req, res) => {
    try {
      const validationResult = insertNoteSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid note data", 
          details: validationResult.error.errors 
        });
      }
      
      const note = await storage.createNote(validationResult.data);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  // Update note (admin endpoint)
  app.put("/api/admin/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid note ID" });
      }

      const validationResult = insertNoteSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid note data", 
          details: validationResult.error.errors 
        });
      }
      
      const updatedNote = await storage.updateNote(id, validationResult.data);
      if (!updatedNote) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      res.json(updatedNote);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  // Delete note (admin endpoint)
  app.delete("/api/admin/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid note ID" });
      }
      
      const deleted = await storage.deleteNote(id);
      if (!deleted) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  // Get paginated notes with filters
  app.get("/api/admin/notes/paginated", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const goalFilter = req.query.goal as string;
      const subjectFilter = req.query.subject as string;
      const activeTab = req.query.activeTab as string; // Add activeTab parameter

      const result = await storage.getNotesWithPagination(page, limit, search, goalFilter, subjectFilter, activeTab);
      res.json(result);
    } catch (error) {
      console.error('Error fetching paginated notes:', error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // Get unique subjects
  app.get("/api/admin/notes/subjects", async (req, res) => {
    try {
      const subjects = await storage.getUniqueSubjects();
      res.json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  // Bulk delete notes
  app.delete("/api/admin/notes/bulk", async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Invalid or empty ids array" });
      }

      // Validate that all IDs are numbers
      const validIds = ids.filter(id => typeof id === 'number' && !isNaN(id));
      if (validIds.length === 0) {
        return res.status(400).json({ error: "Invalid note IDs" });
      }

      await storage.deleteMultipleNotes(validIds);
      res.json({ message: `Successfully deleted ${validIds.length} notes` });
    } catch (error) {
      console.error('Error bulk deleting notes:', error);
      res.status(500).json({ error: "Failed to delete notes" });
    }
  });

  // Goals and Subjects API endpoints
  
  // GET /api/goals - Get all goals
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals();
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  // POST /api/goals - Create new goal (admin endpoint)
  app.post("/api/goals", async (req, res) => {
    try {
      const validationResult = insertGoalSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid goal data", 
          details: validationResult.error.errors 
        });
      }
      
      const goal = await storage.createGoal(validationResult.data);
      res.status(201).json(goal);
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  // GET /api/goals/:goalId/subjects - Get subjects for a specific goal
  app.get("/api/goals/:goalId/subjects", async (req, res) => {
    try {
      const goalId = parseInt(req.params.goalId);
      if (isNaN(goalId)) {
        return res.status(400).json({ error: "Invalid goal ID" });
      }
      
      const subjects = await storage.getSubjectsByGoal(goalId);
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects for goal:", error);
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  // GET /api/subjects - Get all subjects
  app.get("/api/subjects", async (req, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ error: "Failed to fetch subjects" });
    }
  });

  // POST /api/subjects - Create new subject (admin endpoint)
  app.post("/api/subjects", async (req, res) => {
    try {
      const validationResult = insertSubjectSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid subject data", 
          details: validationResult.error.errors 
        });
      }
      
      const subject = await storage.createSubject(validationResult.data);
      res.status(201).json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ error: "Failed to create subject" });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Student Dashboard Routes (Protected)
  // GET /api/student/notes - Get student's accessible notes
  app.get("/api/student/notes", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // For demo purposes, we'll return published notes with student access info
      // In a real app, this would check user's purchased/accessible notes
      const allNotes = await storage.getPublishedNotes();
      
      const studentNotes = allNotes.map(note => ({
        id: note.id,
        title: note.chapterName,
        subject: note.subjectName,
        goal: note.goals,
        cost: note.cost,
        accessType: note.cost === 'Free' ? 'free' : 'paid',
        downloadUrl: note.driveLink,
        viewUrl: note.driveLink,
        isAccessible: true // For demo, all notes are accessible
      }));
      
      res.json(studentNotes);
    } catch (error) {
      console.error("Error fetching student notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // GET /api/student/test-history - Get student's test history
  app.get("/api/student/test-history", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock test history data - in real app, this would come from a tests table
      const testHistory = [
        {
          id: 1,
          testName: "Physics Mock Test 1",
          subject: "Physics",
          goal: "CEE",
          dateTaken: "2025-01-15",
          score: 42,
          totalQuestions: 50,
          percentage: 84,
          rank: 15,
          totalParticipants: 150,
          duration: 120,
          status: "completed"
        },
        {
          id: 2,
          testName: "Chemistry Practice Test",
          subject: "Chemistry",
          goal: "CEE",
          dateTaken: "2025-01-12",
          score: 38,
          totalQuestions: 50,
          percentage: 76,
          rank: 28,
          totalParticipants: 120,
          duration: 90,
          status: "completed"
        },
        {
          id: 3,
          testName: "Math Foundation Test",
          subject: "Math",
          goal: "IOE",
          dateTaken: "2025-01-10",
          score: 45,
          totalQuestions: 50,
          percentage: 90,
          rank: 8,
          totalParticipants: 200,
          duration: 150,
          status: "completed"
        }
      ];
      
      res.json(testHistory);
    } catch (error) {
      console.error("Error fetching test history:", error);
      res.status(500).json({ error: "Failed to fetch test history" });
    }
  });

  // GET /api/student/profile - Get student profile information
  app.get("/api/student/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock student profile - in real app, this would come from user table with additional fields
      const profile = {
        id: 1,
        name: "Ramesh Sharma",
        email: "ramesh.sharma@email.com",
        username: "ramesh_student",
        profilePicture: null,
        joinDate: "2024-09-15",
        goals: ["CEE", "IOE"],
        totalNotesAccessed: 25,
        totalTestsTaken: 12,
        averageScore: 78
      };
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // PUT /api/student/profile - Update student profile
  app.put("/api/student/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, email, goals } = req.body;
      
      // In real app, this would update the user record in database
      // For demo, we'll just return the updated data
      const updatedProfile = {
        id: 1,
        name: name || "Ramesh Sharma",
        email: email || "ramesh.sharma@email.com",
        username: "ramesh_student",
        profilePicture: null,
        joinDate: "2024-09-15",
        goals: goals || ["CEE", "IOE"],
        totalNotesAccessed: 25,
        totalTestsTaken: 12,
        averageScore: 78
      };
      
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating student profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // GET /api/student/progress - Get student progress data
  app.get("/api/student/progress", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock progress data - in real app, this would be calculated from user activity
      const progressData = {
        overallProgress: 68,
        subjectProgress: [
          {
            subject: "Physics",
            goal: "CEE",
            progress: 75,
            notesCompleted: 12,
            totalNotes: 16,
            testsCompleted: 5,
            averageScore: 82
          },
          {
            subject: "Chemistry",
            goal: "CEE",
            progress: 60,
            notesCompleted: 8,
            totalNotes: 14,
            testsCompleted: 3,
            averageScore: 76
          },
          {
            subject: "Math",
            goal: "IOE",
            progress: 85,
            notesCompleted: 15,
            totalNotes: 18,
            testsCompleted: 6,
            averageScore: 88
          }
        ],
        weeklyActivity: [
          { date: "2025-01-13", notesStudied: 3, testsTaken: 1, timeSpent: 120 },
          { date: "2025-01-14", notesStudied: 2, testsTaken: 0, timeSpent: 80 },
          { date: "2025-01-15", notesStudied: 4, testsTaken: 2, timeSpent: 150 },
          { date: "2025-01-16", notesStudied: 1, testsTaken: 1, timeSpent: 90 },
          { date: "2025-01-17", notesStudied: 5, testsTaken: 0, timeSpent: 110 },
          { date: "2025-01-18", notesStudied: 2, testsTaken: 1, timeSpent: 95 },
          { date: "2025-01-19", notesStudied: 0, testsTaken: 0, timeSpent: 0 }
        ],
        achievements: [
          {
            id: 1,
            title: "First Test Completed",
            description: "Successfully completed your first mock test",
            icon: "trophy",
            unlockedDate: "2025-01-10",
            category: "tests"
          },
          {
            id: 2,
            title: "Study Streak - 7 Days",
            description: "Studied consistently for 7 days in a row",
            icon: "calendar",
            unlockedDate: "2025-01-16",
            category: "streak"
          },
          {
            id: 3,
            title: "High Scorer",
            description: "Achieved 90% or higher in a test",
            icon: "star",
            unlockedDate: "2025-01-10",
            category: "score"
          }
        ],
        currentStreak: 5,
        totalStudyTime: 45
      };
      
      res.json(progressData);
    } catch (error) {
      console.error("Error fetching student progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // UserNote Management Routes (Student only)
  
  // GET /notes/mine - Get all notes added by the logged-in student (must be before /notes/:id)
  app.get("/api/notes/mine", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      
      // Check if user is a student
      if (req.user!.role !== "STUDENT") {
        return res.status(403).json({ error: "Only students can access personal notes" });
      }
      
      const userNotes = await storage.getUserNotes(userId);
      res.json(userNotes);
      
    } catch (error) {
      console.error("Error fetching user notes:", error);
      res.status(500).json({ error: "Failed to fetch user notes" });
    }
  });

  // Get single note (must be after specific routes like /notes/mine)
  app.get("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid note ID" });
      }
      
      const note = await storage.getNote(id);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ error: "Failed to fetch note" });
    }
  });
  
  // POST /notes/add/:noteId - Add note to student's dashboard
  app.post("/api/notes/add/:noteId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      const userId = req.user!.id;
      
      if (isNaN(noteId)) {
        return res.status(400).json({ error: "Invalid note ID" });
      }
      
      // Check if user is a student
      if (req.user!.role !== "STUDENT") {
        return res.status(403).json({ error: "Only students can add notes to dashboard" });
      }
      
      // Check if note exists
      const note = await storage.getNote(noteId);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      // Check if note is already added
      const isAlreadyAdded = await storage.isNoteAddedByUser(userId, noteId);
      if (isAlreadyAdded) {
        return res.status(409).json({ error: "Note already added to dashboard" });
      }
      
      // Add note to user's dashboard
      const userNote = await storage.addNoteToUser(userId, noteId);
      res.status(201).json({ 
        message: "Note added to dashboard successfully",
        userNote 
      });
      
    } catch (error) {
      console.error("Error adding note to dashboard:", error);
      res.status(500).json({ error: "Failed to add note to dashboard" });
    }
  });

  
  // DELETE /notes/remove/:noteId - Remove note from student's dashboard
  app.delete("/api/notes/remove/:noteId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      const userId = req.user!.id;
      
      if (isNaN(noteId)) {
        return res.status(400).json({ error: "Invalid note ID" });
      }
      
      // Check if user is a student
      if (req.user!.role !== "STUDENT") {
        return res.status(403).json({ error: "Only students can remove notes from dashboard" });
      }
      
      // Check if note is added by user
      const isAdded = await storage.isNoteAddedByUser(userId, noteId);
      if (!isAdded) {
        return res.status(404).json({ error: "Note not found in dashboard" });
      }
      
      // Remove note from user's dashboard
      const removed = await storage.removeNoteFromUser(userId, noteId);
      if (!removed) {
        return res.status(500).json({ error: "Failed to remove note from dashboard" });
      }
      
      res.json({ message: "Note removed from dashboard successfully" });
      
    } catch (error) {
      console.error("Error removing note from dashboard:", error);
      res.status(500).json({ error: "Failed to remove note from dashboard" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
