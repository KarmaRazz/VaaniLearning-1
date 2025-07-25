import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertGoalSchema, insertSubjectSchema, forgotPasswordSchema, resetPasswordSchema } from "@shared/schema";
import { signup, login, logout, getCurrentUser, authenticateToken, uploadProfilePic, handleProfilePicUpload, AuthenticatedRequest } from "./auth";
import { AdminAuth } from "./admin-auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", authenticateToken, getCurrentUser);
  app.post("/api/auth/upload-profile-pic", authenticateToken, uploadProfilePic, handleProfilePicUpload);

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const isValidAdmin = await AdminAuth.authenticateAdmin(email, password);
      
      if (!isValidAdmin) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
      
      // Create admin session token
      const token = Buffer.from(`admin:${email}:${Date.now()}`).toString('base64');
      
      // Set secure cookie with development-friendly settings
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: false, // Set to false for development (http://localhost)
        sameSite: 'lax' as const, // More permissive for development
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/' // Ensure cookie is available for all paths
      });
      
      const adminData = await AdminAuth.getAdmin(email);
      res.json({ 
        success: true, 
        message: "Admin login successful",
        admin: adminData
      });
      
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie('admin_token', {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax' as const
    });
    res.json({ success: true, message: "Admin logout successful" });
  });

  app.get("/api/admin/verify", (req, res) => {
    const adminToken = req.cookies.admin_token;
    
    if (!adminToken) {
      return res.status(401).json({ error: "No admin session found" });
    }
    
    try {
      const decoded = Buffer.from(adminToken, 'base64').toString();
      const [prefix, email, timestamp] = decoded.split(':');
      
      if (prefix !== 'admin' || !email) {
        return res.status(401).json({ error: "Invalid admin token" });
      }
      
      // Check if token is not expired (24 hours)
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      const tokenAge = now - tokenTime;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (tokenAge > maxAge) {
        res.clearCookie('admin_token');
        return res.status(401).json({ error: "Admin session expired" });
      }
      
      res.json({ 
        success: true, 
        admin: { email }
      });
      
    } catch (error) {
      console.error("Admin token verification error:", error);
      res.status(401).json({ error: "Invalid admin token" });
    }
  });



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

  // Admin Users Management API
  app.get("/api/admin/users", async (req, res) => {
    try {
      const { search, goal, sort, page } = req.query;
      
      const searchTerm = typeof search === 'string' ? search : undefined;
      const goalFilter = goal && typeof goal === 'string' ? parseInt(goal) : undefined;
      const sortBy = (sort === 'newest' || sort === 'oldest') ? sort : 'newest';
      const pageNum = page && typeof page === 'string' ? parseInt(page) : 1;
      const limit = 10;

      const result = await storage.getUsersWithFilters(searchTerm, goalFilter, sortBy, pageNum, limit);
      
      res.json({
        success: true,
        users: result.users,
        total: result.total,
        goals: result.goals,
        currentPage: pageNum,
        totalPages: Math.ceil(result.total / limit),
        hasNextPage: pageNum * limit < result.total,
        hasPrevPage: pageNum > 1
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin Users Summary API
  app.get("/api/admin/users/summary", async (req, res) => {
    try {
      const summary = await storage.getUsersSummary();
      res.json({
        success: true,
        ...summary
      });
    } catch (error) {
      console.error("Get users summary error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Check credential uniqueness API for live validation
  app.post("/api/auth/check-credentials", async (req, res) => {
    try {
      const { username, email, phoneNumber } = req.body;

      if (!username && !email && !phoneNumber) {
        return res.status(400).json({ error: "At least one credential field is required" });
      }

      const result: { [key: string]: boolean } = {};

      // Check each credential individually
      if (username) {
        const existingByUsername = await storage.getUserByUsername(username);
        result.username = !!existingByUsername;
      }

      if (email) {
        const existingByEmail = await storage.getUserByEmail(email);
        result.email = !!existingByEmail;
      }

      if (phoneNumber) {
        const existingByPhone = await storage.getUserByPhoneNumber(phoneNumber);
        result.phoneNumber = !!existingByPhone;
      }

      res.json({
        success: true,
        exists: result
      });
    } catch (error) {
      console.error("Check credentials error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Goals and Subjects API endpoints
  
  // Student Notes Summary API
  app.get("/api/student/notes-summary", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const notesGrouped = await storage.getUserNotesGroupedBySubject(req.user.id);
      const totalNotes = notesGrouped.reduce((acc, item) => acc + item.count, 0);
      
      res.json({
        totalNotes,
        subjectBreakdown: notesGrouped
      });
    } catch (error) {
      console.error("Error fetching user notes summary:", error);
      res.status(500).json({ error: "Failed to fetch notes summary" });
    }
  });

  // Student Profile API
  app.get("/api/student/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get goal name if goalId exists
      let goalName = null;
      if (user.goalId) {
        try {
          const goals = await storage.getGoals();
          const userGoal = goals.find(goal => goal.id === user.goalId);
          goalName = userGoal?.name || null;
        } catch (error) {
          console.error("Error fetching goal name:", error);
        }
      }

      // For now, return default values for learning statistics
      // These will be replaced with real data from database in future
      const profileData = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePic: user.profilePic,
        phoneNumber: user.phoneNumber,
        goalName: goalName,
        totalNotesAccessed: (await storage.getUserNotes(user.id)).length, // Real count from user_notes table
        totalTestsTaken: 0,     // TODO: Implement real counting from test history
        averageScore: 0         // TODO: Calculate from actual test results
      };

      res.json(profileData);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Change Password API
  app.post("/api/student/change-password", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { oldPassword, newPassword } = req.body;

      // Get current user with password
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify old password
      const bcrypt = require('bcrypt');
      const oldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!oldPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password in database
      await storage.updateUserPassword(req.user.id, hashedNewPassword);

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

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

  // Student Notes Management Routes (Protected)
  
  // Add note to dashboard
  app.post("/api/student/notes", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const { noteId } = req.body;
      
      if (!noteId) {
        return res.status(400).json({ error: "Note ID is required" });
      }

      // Check if note exists
      const note = await storage.getNote(noteId);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      // Add note to user's dashboard
      const userNote = await storage.addUserNote(userId, noteId);
      res.status(201).json({ message: "Note added to dashboard successfully", userNote });
    } catch (error) {
      console.error("Error adding note to dashboard:", error);
      if (error instanceof Error && error.message.includes('duplicate')) {
        res.status(409).json({ error: "Note already added to dashboard" });
      } else {
        res.status(500).json({ error: "Failed to add note to dashboard" });
      }
    }
  });

  // Get user's dashboard notes
  app.get("/api/student/notes", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const userNotes = await storage.getUserNotes(userId);
      res.json(userNotes);
    } catch (error) {
      console.error("Error fetching user notes:", error);
      res.status(500).json({ error: "Failed to fetch user notes" });
    }
  });

  // Remove note from dashboard
  app.delete("/api/student/notes/:noteId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const noteId = parseInt(req.params.noteId);
      
      if (isNaN(noteId)) {
        return res.status(400).json({ error: "Invalid note ID" });
      }

      await storage.removeUserNote(userId, noteId);
      res.json({ message: "Note removed from dashboard successfully" });
    } catch (error) {
      console.error("Error removing note from dashboard:", error);
      res.status(500).json({ error: "Failed to remove note from dashboard" });
    }
  });

  // GET /api/student/test-history - Get student's test history
  app.get("/api/student/test-history", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Return empty array - in real app, this would come from a tests table
      // TODO: Implement real test history from database when test system is built
      const testHistory: any[] = [];
      
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

  // Password Reset Routes
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      // Clean up expired tokens first
      await storage.deleteExpiredPasswordResetTokens();
      
      const validationResult = forgotPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid email format", 
          details: validationResult.error.errors 
        });
      }

      const { email } = validationResult.data;
      
      // Check if user exists with this email
      const user = await storage.getUserByEmail(email);
      
      // Always return success message to prevent email enumeration
      const successMessage = "If this email exists in our system, you'll receive a password reset link shortly.";
      
      if (!user) {
        return res.json({ message: successMessage });
      }

      // Generate secure token using Node.js crypto
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // Set expiry to 1 hour from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      
      // Save token to database
      await storage.createPasswordResetToken({
        token: hashedToken,
        userId: user.id,
        expiresAt
      });

      // Send email with reset link
      const { sendPasswordResetEmail } = require('./email');
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      
      res.json({ message: successMessage });
      
    } catch (error) {
      console.error("Error in forgot password:", error);
      res.status(500).json({ error: "Internal server error. Please try again later." });
    }
  });

  app.post("/api/auth/reset-password/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ error: "Reset token is required" });
      }

      const validationResult = resetPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Password validation failed", 
          details: validationResult.error.errors 
        });
      }

      const { password } = validationResult.data;
      
      // Hash the provided token to match what's stored in database
      const crypto = require('crypto');
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      
      // Find and verify token
      const resetToken = await storage.getPasswordResetToken(hashedToken);
      
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }
      
      // Check if token has expired
      if (new Date() > resetToken.expiresAt) {
        // Delete expired token
        await storage.deletePasswordResetToken(hashedToken);
        return res.status(400).json({ error: "Reset token has expired. Please request a new one." });
      }
      
      // Hash the new password
      const bcrypt = require('bcrypt');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Update user's password
      await storage.updateUserPassword(resetToken.userId, hashedPassword);
      
      // Delete the used token
      await storage.deletePasswordResetToken(hashedToken);
      
      res.json({ message: "Password reset successful. You can now login with your new password." });
      
    } catch (error) {
      console.error("Error in reset password:", error);
      res.status(500).json({ error: "Internal server error. Please try again later." });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
