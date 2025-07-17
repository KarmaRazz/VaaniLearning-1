import { useState } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotesPageCard from "@/components/NotesPageCard";
import { Search } from "lucide-react";

// Placeholder data for goals
const goals = ["CEE", "IOE", "Lok Sewa", "ACCA", "Language"];

// Placeholder data for subjects by goal
const subjectsByGoal: { [key: string]: string[] } = {
  "CEE": ["Physics", "Chemistry", "Zoology", "Botany", "Math"],
  "IOE": ["Physics", "Chemistry", "Math", "English"],
  "Lok Sewa": ["General Knowledge", "Current Affairs", "Nepal History", "Geography", "Constitution"],
  "ACCA": ["Financial Accounting", "Management Accounting", "Corporate Law", "Taxation"],
  "Language": ["English Grammar", "Vocabulary", "Comprehension", "Writing Skills"]
};

// Placeholder data for notes
const notesData = [
  {
    id: 1,
    label: "Note" as const,
    chapterName: "Optics",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "Free"
  },
  {
    id: 2,
    label: "Note" as const,
    chapterName: "Organic Chemistry",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹199"
  },
  {
    id: 3,
    label: "Note" as const,
    chapterName: "Cell Biology",
    subjectName: "Zoology",
    goals: ["CEE"],
    cost: "Free"
  },
  {
    id: 4,
    label: "Note" as const,
    chapterName: "Trigonometry",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹149"
  },
  {
    id: 5,
    label: "Note" as const,
    chapterName: "Current Affairs",
    subjectName: "General Knowledge",
    goals: ["Lok Sewa"],
    cost: "Free"
  },
  {
    id: 6,
    label: "Note" as const,
    chapterName: "Plant Biology",
    subjectName: "Botany",
    goals: ["CEE"],
    cost: "₹99"
  }
];

// Placeholder data for formulas and derivations
const formulasData = [
  {
    id: 7,
    label: "Formula" as const,
    chapterName: "Newton's Laws",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "Free"
  },
  {
    id: 8,
    label: "Derivation" as const,
    chapterName: "Thermodynamics",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹99"
  },
  {
    id: 9,
    label: "Formula" as const,
    chapterName: "Calculus Basics",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹179"
  },
  {
    id: 10,
    label: "Derivation" as const,
    chapterName: "Electromagnetic Theory",
    subjectName: "Physics",
    goals: ["IOE"],
    cost: "Free"
  },
  {
    id: 11,
    label: "Formula" as const,
    chapterName: "Probability",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹129"
  },
  {
    id: 12,
    label: "Derivation" as const,
    chapterName: "Acid-Base Equilibrium",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹89"
  }
];

export default function Notes() {
  const [selectedGoal, setSelectedGoal] = useState<string>("CEE");
  const [selectedSubject, setSelectedSubject] = useState<string>("Physics");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentType, setContentType] = useState<"notes" | "formulas">("notes");

  const handleGoalClick = (goal: string) => {
    setSelectedGoal(goal);
    // Reset subject to first subject of the selected goal
    const subjects = subjectsByGoal[goal];
    if (subjects && subjects.length > 0) {
      setSelectedSubject(subjects[0]);
    }
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleView = (id: number) => {
    console.log("View clicked for item:", id);
    // Add view logic here
  };

  const handleGetAdd = (id: number) => {
    console.log("Get/Add clicked for item:", id);
    // Add get/add logic here
  };

  // Get available subjects for selected goal
  const availableSubjects = selectedGoal ? subjectsByGoal[selectedGoal] || [] : [];

  // Filter data based on selected goal, subject, search query, and content type
  const currentData = contentType === "notes" ? notesData : formulasData;
  
  const filteredData = currentData.filter(item => {
    const matchesGoal = item.goals.includes(selectedGoal);
    const matchesSubject = item.subjectName === selectedSubject;
    const matchesSearch = searchQuery === "" || 
      item.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.goals.some(goal => goal.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesGoal && matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF7F3' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#F26B1D' }}>
            Study Notes
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Access comprehensive notes and formulas for your exam preparation
          </p>
        </div>

        {/* Goal Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {goals.map((goal) => (
            <Button
              key={goal}
              variant={selectedGoal === goal ? "default" : "outline"}
              onClick={() => handleGoalClick(goal)}
              className={`px-6 py-2 font-medium transition-colors duration-200 ${
                selectedGoal === goal
                  ? "bg-[#F26B1D] text-white hover:bg-[#D72638]"
                  : "border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white"
              }`}
            >
              {goal}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search chapters, subjects, or goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-[#F26B1D] focus:ring-[#F26B1D]"
            />
          </div>
        </div>

        {/* Subject Tabs and Content Type Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          
          {/* Subject Tabs - Horizontally Scrollable */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {availableSubjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "ghost"}
                  onClick={() => handleSubjectClick(subject)}
                  className={`px-4 py-2 font-medium whitespace-nowrap transition-colors duration-200 ${
                    selectedSubject === subject
                      ? "bg-[#D72638] text-white hover:bg-[#F26B1D]"
                      : "text-gray-600 hover:text-[#F26B1D] hover:bg-gray-100"
                  }`}
                >
                  {subject}
                </Button>
              ))}
            </div>
          </div>

          {/* Content Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={contentType === "notes" ? "default" : "ghost"}
              onClick={() => setContentType("notes")}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                contentType === "notes"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Notes
            </Button>
            <Button
              variant={contentType === "formulas" ? "default" : "ghost"}
              onClick={() => setContentType("formulas")}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                contentType === "formulas"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Formulas & Derivations
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredData.map((item) => (
            <NotesPageCard
              key={item.id}
              label={item.label}
              chapterName={item.chapterName}
              subjectName={item.subjectName}
              goals={item.goals}
              cost={item.cost}
              onView={() => handleView(item.id)}
              onGetAdd={() => handleGetAdd(item.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {contentType} found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search for different content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
