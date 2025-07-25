import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Eye, Trash2, Book, Calculator } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserNote {
  id: number;
  title: string;
  subject: string;
  type: string;
  goal: string;
  sheetLink: string | null;
  createdAt: string;
  label: string;
  chapterName: string;
  subjectName: string;
  goals: string[];
  cost: string;
  driveLink: string;
  isPublished: boolean;
  addedAt: string;
}

const MyNotes = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'formulas'>('notes');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/student/notes'],
    queryFn: async () => {
      const response = await fetch('/api/student/notes', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to view your notes');
        }
        throw new Error('Failed to fetch notes');
      }
      return response.json();
    },
    retry: false
  });

  const removeNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      const response = await fetch(`/api/student/notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove note');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student/notes'] });
      toast({
        title: 'Success',
        description: 'Note removed from dashboard',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Filter notes based on active tab
  const filteredNotes = notes.filter(note => {
    if (activeTab === 'notes') {
      return note.label === 'Note';
    } else {
      return note.label === 'Formula' || note.label === 'Derivation';
    }
  });

  // Group notes by subject
  const groupedNotes = filteredNotes.reduce((groups, note) => {
    const subject = note.subjectName;
    if (!groups[subject]) {
      groups[subject] = [];
    }
    groups[subject].push(note);
    return groups;
  }, {} as Record<string, UserNote[]>);

  const handleRemoveNote = (noteId: number) => {
    if (window.confirm('Are you sure you want to remove this note from your dashboard?')) {
      removeNoteMutation.mutate(noteId);
    }
  };

  const handleViewNote = (driveLink: string) => {
    if (driveLink) {
      window.open(driveLink, '_blank');
    } else {
      toast({
        title: 'Error',
        description: 'View link not available',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">My Learning Dashboard</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32 sm:w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 sm:w-32"></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">My Learning Dashboard</h2>
        <div className="text-center py-8 sm:py-12">
          <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Unable to Load Notes</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">
            {error instanceof Error && error.message.includes('login') 
              ? 'Please login to view your saved notes.' 
              : 'Failed to load your notes. Please try again later.'}
          </p>
          <Button 
            onClick={() => refetch()}
            className="bg-[#F26B1D] hover:bg-[#D72638] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">My Learning Dashboard</h2>
        <div className="text-center py-8 sm:py-12">
          <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Notes Added Yet</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">Start building your personal study collection by adding notes from our library.</p>
          <Button 
            onClick={() => window.location.href = '/notes'}
            className="bg-[#F26B1D] hover:bg-[#D72638] text-white px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base"
          >
            Browse Notes Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Learning Dashboard</h2>
          <div className="text-xs sm:text-sm text-gray-500">
            {filteredNotes.length} {activeTab} available
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm ${
              activeTab === 'notes'
                ? 'bg-white text-[#F26B1D] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Book className="h-4 w-4" />
            <span className="hidden sm:inline">Notes ({notes.filter((n: any) => n.label === 'Note').length})</span>
            <span className="sm:hidden">Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm ${
              activeTab === 'formulas'
                ? 'bg-white text-[#F26B1D] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Formulas & Derivations ({notes.filter((n: any) => n.label === 'Formula' || n.label === 'Derivation').length})</span>
            <span className="sm:hidden">Formulas</span>
          </button>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4">
            {activeTab === 'notes' ? <Book className="h-12 w-12 sm:h-16 sm:w-16" /> : <Calculator className="h-12 w-12 sm:h-16 sm:w-16" />}
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No {activeTab} added yet
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">
            Browse our library and add {activeTab} to build your personal collection.
          </p>
          <Button 
            onClick={() => window.location.href = `/notes?filter=${activeTab}`}
            className="bg-[#F26B1D] hover:bg-[#D72638] text-white text-sm sm:text-base"
          >
            Browse {activeTab === 'notes' ? 'Notes' : 'Formulas'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {Object.entries(groupedNotes).map(([subject, subjectNotes]) => (
            <div key={subject} className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {subject}
              </h3>
              <div className="space-y-3">
                {(subjectNotes as any).map((note: any) => (
                  <div
                    key={note.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#F26B1D] transition-colors space-y-3 sm:space-y-0"
                  >
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        note.label === 'Note' ? 'bg-blue-100' :
                        note.label === 'Formula' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {note.label === 'Note' ? (
                          <Book className={`h-4 w-4 sm:h-5 sm:w-5 ${
                            note.label === 'Note' ? 'text-blue-600' :
                            note.label === 'Formula' ? 'text-green-600' : 'text-purple-600'
                          }`} />
                        ) : (
                          <Calculator className={`h-4 w-4 sm:h-5 sm:w-5 ${
                            note.label === 'Note' ? 'text-blue-600' :
                            note.label === 'Formula' ? 'text-green-600' : 'text-purple-600'
                          }`} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{note.chapterName}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                          <span className="text-[#F26B1D] font-medium">{note.goals.join(', ')}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            note.cost === 'Free' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {note.cost}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            note.label === 'Note' ? 'bg-blue-100 text-blue-700' :
                            note.label === 'Formula' ? 'bg-green-100 text-green-700' : 
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {note.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewNote(note.driveLink)}
                        className="flex items-center space-x-1 border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveNote(note.id)}
                        disabled={removeNoteMutation.isPending}
                        className="flex items-center space-x-1 border-red-300 text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotes;