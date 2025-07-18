import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Eye, Lock, Unlock } from 'lucide-react';

interface StudentNote {
  id: number;
  title: string;
  subject: string;
  goal: string[];
  cost: string;
  accessType: 'free' | 'paid';
  downloadUrl?: string;
  viewUrl?: string;
  isAccessible: boolean;
}

const MyNotes = () => {
  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['/api/student/notes'],
    queryFn: async () => {
      const response = await fetch('/api/student/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      return response.json() as StudentNote[];
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Notes</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Notes</h2>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Failed to load notes. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Notes</h2>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Notes Available</h3>
          <p className="text-gray-500 mb-6">You don't have access to any notes yet.</p>
          <button className="bg-[#F26B1D] hover:bg-[#D72638] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Browse Available Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Notes</h2>
        <div className="text-sm text-gray-500">
          {notes.length} note{notes.length !== 1 ? 's' : ''} available
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#F26B1D] transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${note.isAccessible ? 'bg-green-100' : 'bg-gray-100'}`}>
                {note.isAccessible ? (
                  <Unlock className="h-6 w-6 text-green-600" />
                ) : (
                  <Lock className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{note.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{note.subject}</span>
                  <span>•</span>
                  <span className="text-[#F26B1D] font-medium">{note.goal.join(', ')}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    note.accessType === 'free' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {note.accessType === 'free' ? 'Free' : note.cost}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {note.isAccessible && (
                <>
                  {note.viewUrl && (
                    <button
                      onClick={() => window.open(note.viewUrl, '_blank')}
                      className="flex items-center space-x-1 px-3 py-2 text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white border border-[#F26B1D] rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  )}
                  {note.downloadUrl && (
                    <button
                      onClick={() => window.open(note.downloadUrl, '_blank')}
                      className="flex items-center space-x-1 px-3 py-2 bg-[#F26B1D] hover:bg-[#D72638] text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  )}
                </>
              )}
              {!note.isAccessible && (
                <button className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                  Access Required
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNotes;