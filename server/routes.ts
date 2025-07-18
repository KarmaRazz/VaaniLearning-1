import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Get single note
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

      const result = await storage.getNotesWithPagination(page, limit, search, goalFilter, subjectFilter);
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

      await storage.deleteMultipleNotes(ids);
      res.json({ message: `Successfully deleted ${ids.length} notes` });
    } catch (error) {
      console.error('Error bulk deleting notes:', error);
      res.status(500).json({ error: "Failed to delete notes" });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
