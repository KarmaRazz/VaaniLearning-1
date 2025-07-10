import { useState } from "react";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface SubjectMap {
  [key: string]: string[];
}

const subjectsByGoal: SubjectMap = {
  'CEE': ['Physics', 'Chemistry', 'Zoology', 'Botany', 'Math'],
  'IOE': ['Physics', 'Chemistry', 'Math', 'English'],
  'ACCA': ['Financial Accounting', 'Management Accounting', 'Corporate Law', 'Taxation'],
  'Lok Sewa': ['General Knowledge', 'Current Affairs', 'Nepal History', 'Geography', 'Constitution'],
  'Language': ['English Grammar', 'Vocabulary', 'Comprehension', 'Writing Skills']
};

interface NoteCard {
  id: number;
  title: string;
  description: string;
  downloadUrl: string;
}

const sampleNotes: NoteCard[] = [
  {
    id: 1,
    title: "Complete Chapter Notes",
    description: "Comprehensive notes covering all important concepts with examples and practice questions.",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "Formula & Derivation Guide",
    description: "Essential formulas and step-by-step derivations for quick revision and exam preparation.",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "Previous Year Questions",
    description: "Collection of previous year exam questions with detailed solutions and explanations.",
    downloadUrl: "#"
  }
];

export default function Notes() {
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const handleGoalChange = (value: string) => {
    setSelectedGoal(value);
    setSelectedSubject(""); // Reset subject when goal changes
  };

  const availableSubjects = selectedGoal ? subjectsByGoal[selectedGoal] || [] : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF7F3' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#F26B1D' }}>
            Study Notes
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Access our comprehensive collection of 10,000+ study notes. 
            Choose your goal and subject to find relevant study materials.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goal Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Goal
              </label>
              <Select value={selectedGoal} onValueChange={handleGoalChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your exam goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CEE">CEE (Medical)</SelectItem>
                  <SelectItem value="IOE">IOE (Engineering)</SelectItem>
                  <SelectItem value="ACCA">ACCA</SelectItem>
                  <SelectItem value="Lok Sewa">Lok Sewa</SelectItem>
                  <SelectItem value="Language">Language</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject
              </label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={!selectedGoal}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedGoal ? "Choose a subject" : "Select goal first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {selectedGoal && selectedSubject && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedSubject} Notes for {selectedGoal}
              </h2>
              <span className="text-sm text-gray-500">
                {sampleNotes.length} notes available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleNotes.map((note) => (
                <Card key={note.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {note.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {note.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        {selectedSubject}
                      </span>
                      <Button 
                        size="sm" 
                        className="flex items-center gap-2 hover:bg-[#D72638] transition-colors duration-200"
                        style={{ backgroundColor: '#F26B1D' }}
                        onClick={() => window.open(note.downloadUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!selectedGoal || !selectedSubject) && (
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
                Select Goal and Subject
              </h3>
              <p className="text-gray-500">
                Choose your exam goal and subject from the dropdowns above to view available study notes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
