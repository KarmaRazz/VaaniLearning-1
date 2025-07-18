import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck, Calendar, Trophy, TrendingUp, Eye } from 'lucide-react';

interface TestResult {
  id: number;
  testName: string;
  subject: string;
  goal: string;
  dateTaken: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  rank: number;
  totalParticipants: number;
  duration: number; // in minutes
  status: 'completed' | 'incomplete';
}

const TestHistory = () => {
  const { data: testHistory, isLoading, error } = useQuery({
    queryKey: ['/api/student/test-history'],
    queryFn: async () => {
      const response = await fetch('/api/student/test-history');
      if (!response.ok) throw new Error('Failed to fetch test history');
      return response.json() as TestResult[];
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Test History</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Test History</h2>
        <div className="text-center py-8">
          <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Failed to load test history. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!testHistory || testHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Test History</h2>
        <div className="text-center py-12">
          <ClipboardCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Taken</h3>
          <p className="text-gray-500 mb-6">You haven't taken any mock tests yet. Start practicing to improve your scores!</p>
          <button className="bg-[#F26B1D] hover:bg-[#D72638] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Take Your First Test
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRankColor = (rank: number, total: number) => {
    const percentile = (rank / total) * 100;
    if (percentile <= 10) return 'text-green-600 bg-green-100';
    if (percentile <= 25) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Test History</h2>
        <div className="text-sm text-gray-500">
          {testHistory.length} test{testHistory.length !== 1 ? 's' : ''} taken
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Tests Completed</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {testHistory.filter(t => t.status === 'completed').length}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Average Score</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {Math.round(testHistory.reduce((acc, test) => acc + test.percentage, 0) / testHistory.length)}%
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Best Score</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {Math.max(...testHistory.map(t => t.percentage))}%
          </p>
        </div>
      </div>

      {/* Test List */}
      <div className="space-y-4">
        {testHistory.map((test) => (
          <div
            key={test.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#F26B1D] transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-[#F26B1D] bg-opacity-10 rounded-lg">
                <ClipboardCheck className="h-6 w-6 text-[#F26B1D]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(test.dateTaken).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{test.subject}</span>
                  <span>•</span>
                  <span className="text-[#F26B1D] font-medium">{test.goal}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(test.percentage)}`}>
                  {test.score}/{test.totalQuestions} ({test.percentage}%)
                </div>
                <div className={`mt-1 px-2 py-1 rounded text-xs font-medium ${getRankColor(test.rank, test.totalParticipants)}`}>
                  Rank: {test.rank}/{test.totalParticipants}
                </div>
              </div>
              
              <button className="flex items-center space-x-1 px-3 py-2 text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white border border-[#F26B1D] rounded-lg transition-colors">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestHistory;