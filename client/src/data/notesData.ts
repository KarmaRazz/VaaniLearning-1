// Centralized data for notes and formulas - easily replaceable with API calls

export interface NoteItem {
  id: number;
  label: "Note" | "Formula" | "Derivation";
  chapterName: string;
  subjectName: string;
  goals: string[];
  cost: string;
}

// Extended notes data - 20 items
export const notesData: NoteItem[] = [
  {
    id: 1,
    label: "Note",
    chapterName: "Optics",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "Free"
  },
  {
    id: 2,
    label: "Note",
    chapterName: "Organic Chemistry",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹199"
  },
  {
    id: 3,
    label: "Note",
    chapterName: "Cell Biology",
    subjectName: "Zoology",
    goals: ["CEE"],
    cost: "Free"
  },
  {
    id: 4,
    label: "Note",
    chapterName: "Trigonometry",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹149"
  },
  {
    id: 5,
    label: "Note",
    chapterName: "Current Affairs",
    subjectName: "General Knowledge",
    goals: ["Lok Sewa"],
    cost: "Free"
  },
  {
    id: 6,
    label: "Note",
    chapterName: "Plant Biology",
    subjectName: "Botany",
    goals: ["CEE"],
    cost: "₹99"
  },
  {
    id: 7,
    label: "Note",
    chapterName: "Mechanics",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "₹129"
  },
  {
    id: 8,
    label: "Note",
    chapterName: "Inorganic Chemistry",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "Free"
  },
  {
    id: 9,
    label: "Note",
    chapterName: "Genetics",
    subjectName: "Zoology",
    goals: ["CEE"],
    cost: "₹179"
  },
  {
    id: 10,
    label: "Note",
    chapterName: "Algebra",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "Free"
  },
  {
    id: 11,
    label: "Note",
    chapterName: "Nepal History",
    subjectName: "Nepal History",
    goals: ["Lok Sewa"],
    cost: "₹89"
  },
  {
    id: 12,
    label: "Note",
    chapterName: "Ecology",
    subjectName: "Botany",
    goals: ["CEE"],
    cost: "Free"
  },
  {
    id: 13,
    label: "Note",
    chapterName: "Thermodynamics",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "₹199"
  },
  {
    id: 14,
    label: "Note",
    chapterName: "Physical Chemistry",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹149"
  },
  {
    id: 15,
    label: "Note",
    chapterName: "Animal Physiology",
    subjectName: "Zoology",
    goals: ["CEE"],
    cost: "Free"
  },
  {
    id: 16,
    label: "Note",
    chapterName: "Calculus",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹229"
  },
  {
    id: 17,
    label: "Note",
    chapterName: "Constitution",
    subjectName: "Constitution",
    goals: ["Lok Sewa"],
    cost: "Free"
  },
  {
    id: 18,
    label: "Note",
    chapterName: "Financial Accounting",
    subjectName: "Financial Accounting",
    goals: ["ACCA"],
    cost: "₹299"
  },
  {
    id: 19,
    label: "Note",
    chapterName: "English Grammar",
    subjectName: "English Grammar",
    goals: ["Language", "IOE"],
    cost: "Free"
  },
  {
    id: 20,
    label: "Note",
    chapterName: "Geography",
    subjectName: "Geography",
    goals: ["Lok Sewa"],
    cost: "₹119"
  }
];

// Extended formulas and derivations data - 18 items
export const formulasData: NoteItem[] = [
  {
    id: 21,
    label: "Formula",
    chapterName: "Newton's Laws",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "Free"
  },
  {
    id: 22,
    label: "Derivation",
    chapterName: "Thermodynamics",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹99"
  },
  {
    id: 23,
    label: "Formula",
    chapterName: "Calculus Basics",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹179"
  },
  {
    id: 24,
    label: "Derivation",
    chapterName: "Electromagnetic Theory",
    subjectName: "Physics",
    goals: ["IOE"],
    cost: "Free"
  },
  {
    id: 25,
    label: "Formula",
    chapterName: "Probability",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹129"
  },
  {
    id: 26,
    label: "Derivation",
    chapterName: "Acid-Base Equilibrium",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹89"
  },
  {
    id: 27,
    label: "Formula",
    chapterName: "Kinematics",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "Free"
  },
  {
    id: 28,
    label: "Derivation",
    chapterName: "Chemical Bonding",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹149"
  },
  {
    id: 29,
    label: "Formula",
    chapterName: "Integration",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹199"
  },
  {
    id: 30,
    label: "Derivation",
    chapterName: "Wave Mechanics",
    subjectName: "Physics",
    goals: ["IOE"],
    cost: "Free"
  },
  {
    id: 31,
    label: "Formula",
    chapterName: "Statistics",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹159"
  },
  {
    id: 32,
    label: "Derivation",
    chapterName: "Electrochemistry",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹119"
  },
  {
    id: 33,
    label: "Formula",
    chapterName: "Circular Motion",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "Free"
  },
  {
    id: 34,
    label: "Derivation",
    chapterName: "Organic Reactions",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹189"
  },
  {
    id: 35,
    label: "Formula",
    chapterName: "Differential Equations",
    subjectName: "Math",
    goals: ["IOE"],
    cost: "₹249"
  },
  {
    id: 36,
    label: "Derivation",
    chapterName: "Quantum Physics",
    subjectName: "Physics",
    goals: ["IOE"],
    cost: "₹299"
  },
  {
    id: 37,
    label: "Formula",
    chapterName: "Matrix Operations",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "Free"
  },
  {
    id: 38,
    label: "Derivation",
    chapterName: "Coordination Chemistry",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹139"
  }
];

// Helper functions for easy data access
export const getAllNotes = (): NoteItem[] => notesData;
export const getAllFormulas = (): NoteItem[] => formulasData;

export const getNotesForHomepage = (limit: number = 5): NoteItem[] => 
  notesData.slice(0, limit);

export const getFormulasForHomepage = (limit: number = 5): NoteItem[] => 
  formulasData.slice(0, limit);