import { useQuery } from '@tanstack/react-query';
import { FileText, BarChart3, BookOpen } from 'lucide-react';

interface NotesSummary {
  totalNotes: number;
  subjectBreakdown: {
    subject: string;
    count: number;
  }[];
}

const ProgressTracker = () => {
  const { data: notesSummary, isLoading: notesLoading, error: notesError } = useQuery({
    queryKey: ['/api/student/notes-summary'],
    queryFn: async () => {
      const response = await fetch('/api/student/notes-summary', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch notes summary');
      return response.json();
    }
  });

  return (
    <div>
      {/* Notes Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-[#F26B1D]" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Progress Tracker</h2>
        </div>
        
        {notesLoading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        ) : notesError || !notesSummary ? (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Failed to load notes summary. Please try again later.</p>
          </div>
        ) : notesSummary.totalNotes === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Notes Added Yet</h4>
            <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">Start adding notes to your dashboard to track your study progress by subject.</p>
            <button className="bg-[#F26B1D] hover:bg-[#D72638] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base">
              Browse Notes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Total Notes Count */}
            <div className="bg-gradient-to-r from-[#F26B1D]/10 to-[#D72638]/10 p-3 sm:p-4 rounded-lg border border-[#F26B1D]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-[#F26B1D]/20 rounded-lg flex-shrink-0">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#F26B1D]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Total Notes Added</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Notes saved to your dashboard</p>
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-[#F26B1D] flex-shrink-0">{notesSummary.totalNotes}</span>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">By Subject</h4>
              {notesSummary.subjectBreakdown.map((item: { subject: string; count: number }, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#F26B1D] rounded-full"></div>
                    <span className="font-medium text-gray-900">{item.subject}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{item.count}</span>
                    <span className="text-sm text-gray-500">notes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;