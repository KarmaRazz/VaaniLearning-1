import { storage } from "./storage";

export async function seedDatabase() {
  try {
    console.log('Database seed function called - no dummy data will be added');
    
    // Check if we already have notes
    const existingNotes = await storage.getNotes();
    console.log(`Database currently contains ${existingNotes.length} notes (admin-created only)`);
    
    // No longer seed dummy data - only admin panel can add notes
    console.log('Database ready - only admin-created content will be shown');
  } catch (error) {
    console.error('Error checking database:', error);
  }
}