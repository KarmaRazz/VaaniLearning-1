import { storage } from "./storage";
import { notesData, formulasData } from "../client/src/data/notesData";

export async function seedDatabase() {
  try {
    console.log("Seeding database with notes and formulas...");
    
    // Convert the existing data to match our database schema
    const allData = [...notesData, ...formulasData];
    
    for (const item of allData) {
      await storage.createNote({
        label: item.label,
        chapterName: item.chapterName,
        subjectName: item.subjectName,
        goals: item.goals,
        cost: item.cost,
        driveLink: `https://drive.google.com/file/d/example-${item.chapterName.toLowerCase().replace(/\s+/g, '-')}`,
        isPublished: true
      });
    }
    
    console.log(`Successfully seeded ${allData.length} notes and formulas to database`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}