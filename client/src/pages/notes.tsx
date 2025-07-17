import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotesPageCard from "@/components/NotesPageCard";
import { Search } from "lucide-react";
import { getAllNotes, getAllFormulas } from "@/data/notesData";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

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

export default function Notes() {
  // Get data from API using React Query
  const { data: notesData = [] } = useQuery({
    queryKey: ['/api/notes', 'all-notes'],
    queryFn: getAllNotes,
  });

  const { data: formulasData = [] } = useQuery({
    queryKey: ['/api/notes', 'all-formulas'],
    queryFn: getAllFormulas,
  });
  const [location] = useLocation();
  const [selectedGoal, setSelectedGoal] = useState<string>("CEE");
  const [selectedSubject, setSelectedSubject] = useState<string>("Physics");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentType, setContentType] = useState<"notes" | "formulas">("notes");

  // Check URL parameter to set initial tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('filter') === 'formulas') {
      setContentType('formulas');
    }
  }, [location]);

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
    // Check if user is logged in (simple check for now - in real app this would be proper auth)
    const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
    
    if (!isLoggedIn) {
      // Redirect to login/signup
      alert('Please log in to view the content. Redirecting to login...');
      // In a real app, this would redirect to login page
      window.location.href = '/login';
      return;
    }

    // Find the note/formula with the given id
    const allData = [...notesData, ...formulasData];
    const item = allData.find(note => note.id === id);
    
    if (item && item.driveLink) {
      // Open Google Drive link in new tab
      window.open(item.driveLink, '_blank');
    } else {
      alert('Content link not available');
    }
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
