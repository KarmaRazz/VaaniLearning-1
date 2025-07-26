import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotesPageCard from "@/components/NotesPageCard";
import { Search } from "lucide-react";
import { getAllNotes, getAllFormulas, type NoteItem } from "@/data/notesData";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Fetch goals and subjects from API
const useGoals = () => useQuery({
  queryKey: ['/api/goals'],
  queryFn: async () => {
    const response = await fetch('/api/goals');
    if (!response.ok) throw new Error('Failed to fetch goals');
    const data = await response.json();
    // Sort goals with CEE first, then alphabetical
    return [...data].sort((a, b) => {
      if (a.name === "CEE") return -1;
      if (b.name === "CEE") return 1;
      return a.name.localeCompare(b.name);
    });
  },
});

const useSubjects = () => useQuery({
  queryKey: ['/api/subjects'],
  queryFn: async () => {
    const response = await fetch('/api/subjects');
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return response.json();
  },
});

export default function Notes() {
  // Get data from API using React Query
  const { data: notesData = [] } = useQuery<NoteItem[]>({
    queryKey: ['/api/notes', 'all-notes'],
    queryFn: getAllNotes,
  });

  const { data: formulasData = [] } = useQuery<NoteItem[]>({
    queryKey: ['/api/notes', 'all-formulas'],
    queryFn: getAllFormulas,
  });

  // Fetch goals and subjects data
  const { data: goals = [], isLoading: goalsLoading } = useGoals();
  const { data: allSubjects = [], isLoading: subjectsLoading } = useSubjects();
  
  const [location] = useLocation();
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentType, setContentType] = useState<"notes" | "formulas">("notes");

  // Check URL parameter to set initial tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('filter') === 'formulas') {
      setContentType('formulas');
    }
  }, [location]);

  // Initialize selectedGoal when goals are loaded
  useEffect(() => {
    if (goals.length > 0 && !selectedGoal) {
      setSelectedGoal(goals[0].name);
    }
  }, [goals, selectedGoal]);

  // Initialize selectedSubject when allSubjects are loaded and selectedGoal changes
  useEffect(() => {
    if (selectedGoal && allSubjects.length > 0) {
      const goalData = goals.find(g => g.name === selectedGoal);
      if (goalData) {
        const goalSubjects = allSubjects.filter(s => s.goalId === goalData.id);
        if (goalSubjects.length > 0 && !goalSubjects.some(s => s.name === selectedSubject)) {
          setSelectedSubject(goalSubjects[0].name);
        }
      }
    }
  }, [selectedGoal, allSubjects, goals, selectedSubject]);

  const handleGoalClick = (goalName: string) => {
    setSelectedGoal(goalName);
    // Reset subject to first subject of the selected goal
    const goalData = goals.find(g => g.name === goalName);
    if (goalData) {
      const goalSubjects = allSubjects.filter(s => s.goalId === goalData.id);
      if (goalSubjects.length > 0) {
        setSelectedSubject(goalSubjects[0].name);
      }
    }
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleView = (id: number) => {
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

  const { toast } = useToast();

  // Add note to dashboard mutation
  const addNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      const response = await apiRequest('POST', '/api/student/notes', { noteId });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note added to your dashboard!",
      });
      // Invalidate student notes query to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['/api/student/notes'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.message || 'Failed to add note to dashboard';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleGetAdd = (id: number) => {
    addNoteMutation.mutate(id);
  };

  // Get available subjects for selected goal
  const getAvailableSubjects = () => {
    if (!selectedGoal) return [];
    const goalData = goals.find(g => g.name === selectedGoal);
    if (!goalData) return [];
    return allSubjects.filter(s => s.goalId === goalData.id);
  };

  const availableSubjects = getAvailableSubjects();

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
          {goalsLoading ? (
            <div className="text-gray-500">Loading goals...</div>
          ) : (
            goals.map((goal) => (
              <Button
                key={goal.id}
                variant={selectedGoal === goal.name ? "default" : "outline"}
                onClick={() => handleGoalClick(goal.name)}
                className={`px-6 py-2 font-medium transition-colors duration-200 ${
                  selectedGoal === goal.name
                    ? "bg-[#F26B1D] text-white hover:bg-[#D72638]"
                    : "border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white"
                }`}
              >
                {goal.name}
              </Button>
            ))
          )}
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
              {subjectsLoading ? (
                <div className="text-gray-500">Loading subjects...</div>
              ) : (
                availableSubjects.map((subject) => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject === subject.name ? "default" : "ghost"}
                    onClick={() => handleSubjectClick(subject.name)}
                    className={`px-4 py-2 font-medium whitespace-nowrap transition-colors duration-200 ${
                      selectedSubject === subject.name
                        ? "bg-[#D72638] text-white hover:bg-[#F26B1D]"
                        : "text-gray-600 hover:text-[#F26B1D] hover:bg-gray-100"
                    }`}
                  >
                    {subject.name}
                    {subject.category && (
                      <span className="ml-1 text-xs opacity-75">({subject.category})</span>
                    )}
                  </Button>
                ))
              )}
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
              noteId={item.id?.toString()}
              onView={() => handleView(item.id || 0)}
              onGetAdd={() => handleGetAdd(item.id || 0)}
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
