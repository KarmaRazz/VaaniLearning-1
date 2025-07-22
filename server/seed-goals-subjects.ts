import { storage } from "./storage";

// Data structure as specified in the requirements
const goalsAndSubjects = [
  {
    name: "CEE",
    subjects: [
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Zoology" },
      { name: "Botany" },
      { name: "Math" }
    ]
  },
  {
    name: "IOE",
    subjects: [
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Math" },
      { name: "English" },
      { name: "Drawing" },
      { name: "Aptitude" }
    ]
  },
  {
    name: "Language",
    subjects: [
      { name: "German" },
      { name: "Japanese" },
      { name: "Korean" }
    ]
  },
  {
    name: "Boards",
    subjects: [
      { name: "Physics", category: "Science" },
      { name: "Chemistry", category: "Science" },
      { name: "Biology", category: "Science" },
      { name: "Math", category: "Science" },
      { name: "Accounting", category: "Commerce" },
      { name: "Business Studies", category: "Commerce" },
      { name: "Economics", category: "Commerce" }
    ]
  },
  {
    name: "ACCA",
    subjects: [
      { name: "FA1" },
      { name: "MA1" },
      { name: "F1" },
      { name: "F2" },
      { name: "F3" }
    ]
  }
];

export async function seedGoalsAndSubjects() {
  try {
    console.log("Starting goals and subjects seeding...");
    
    // Check if goals already exist
    const existingGoals = await storage.getGoals();
    if (existingGoals.length > 0) {
      console.log("Goals already exist, skipping seeding");
      return;
    }

    // Create goals and their subjects
    for (const goalData of goalsAndSubjects) {
      // Create goal
      const goal = await storage.createGoal({ name: goalData.name });
      console.log(`Created goal: ${goal.name}`);

      // Create subjects for this goal
      for (const subjectData of goalData.subjects) {
        const subject = await storage.createSubject({
          name: subjectData.name,
          goalId: goal.id,
          category: subjectData.category || null
        });
        console.log(`Created subject: ${subject.name} for goal: ${goal.name}${subject.category ? ` (${subject.category})` : ''}`);
      }
    }

    console.log("Goals and subjects seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding goals and subjects:", error);
    throw error;
  }
}