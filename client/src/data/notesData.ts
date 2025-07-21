// API-only data source - no static dummy data

export interface NoteItem {
  id: number;
  label: "Note" | "Formula" | "Derivation";
  chapterName: string;
  subjectName: string;
  goals: string[];
  cost: string;
  driveLink?: string;
}

// API fetch functions - only source of data
export const fetchNotesFromAPI = async (): Promise<NoteItem[]> => {
  try {
    const response = await fetch('/api/notes');
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching notes from API:', error);
    return [];
  }
};

// Homepage specific functions
export const getNotesForHomepage = async (limit: number = 12): Promise<NoteItem[]> => {
  try {
    const allData = await fetchNotesFromAPI();
    const notesOnly = allData.filter(item => item.label === 'Note');
    return notesOnly.slice(0, limit);
  } catch (error) {
    console.error('Error fetching notes for homepage:', error);
    return [];
  }
};

export const getFormulasForHomepage = async (limit: number = 12): Promise<NoteItem[]> => {
  try {
    const allData = await fetchNotesFromAPI();
    const formulasOnly = allData.filter(item => item.label === 'Formula' || item.label === 'Derivation');
    return formulasOnly.slice(0, limit);
  } catch (error) {
    console.error('Error fetching formulas for homepage:', error);
    return [];
  }
};

// Notes page specific functions
export const getAllNotes = async (): Promise<NoteItem[]> => {
  try {
    const allData = await fetchNotesFromAPI();
    return allData.filter(item => item.label === 'Note');
  } catch (error) {
    console.error('Error fetching all notes:', error);
    return [];
  }
};

export const getAllFormulas = async (): Promise<NoteItem[]> => {
  try {
    const allData = await fetchNotesFromAPI();
    return allData.filter(item => item.label === 'Formula' || item.label === 'Derivation');
  } catch (error) {
    console.error('Error fetching all formulas:', error);
    return [];
  }
};

// No static data - all data comes from admin panel via API
export const notesData: NoteItem[] = [];
export const formulasData: NoteItem[] = [];