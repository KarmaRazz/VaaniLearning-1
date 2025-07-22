import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Target, Clock, Award, BookOpen, CheckCircle, FileText, BarChart3 } from 'lucide-react';

interface ProgressData {
  overallProgress: number;
  subjectProgress: {
    subject: string;
    goal: string;
    progress: number;
    notesCompleted: number;
    totalNotes: number;
    testsCompleted: number;
    averageScore: number;
  }[];
  weeklyActivity: {
    date: string;
    notesStudied: number;
    testsTaken: number;
    timeSpent: number; // in minutes
  }[];
  achievements: {
    id: number;
    title: string;
    description: string;
    icon: string;
    unlockedDate: string;
    category: 'notes' | 'tests' | 'streak' | 'score';
  }[];
  currentStreak: number;
  totalStudyTime: number; // in hours
}

interface NotesSummary {
  totalNotes: number;
  subjectBreakdown: {
    subject: string;
    count: number;
  }[];
}

const ProgressTracker = () => {
  const { data: progress, isLoading, error } = useQuery({
    queryKey: ['/api/student/progress'],
    queryFn: async () => {
      const response = await fetch('/api/student/progress', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    }
  });

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Tracker</h2>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Tracker</h2>
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Failed to load progress data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Tracker</h2>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">Overall Learning Progress</h3>
            <span className="text-2xl font-bold text-[#F26B1D]">{progress.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getProgressColor(progress.overallProgress)}`}
              style={{ width: `${progress.overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Study Time</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{progress.totalStudyTime}h</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Current Streak</span>
            </div>
            <p className="text-xl font-bold text-green-600">{progress.currentStreak} days</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Achievements</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{progress.achievements.length}</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Notes Studied</span>
            </div>
            <p className="text-xl font-bold text-orange-600">
              {progress.subjectProgress.reduce((acc, subj) => acc + subj.notesCompleted, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Notes Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="h-6 w-6 text-[#F26B1D]" />
          <h3 className="text-lg font-bold text-gray-900">Notes Summary</h3>
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
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Notes Added Yet</h4>
            <p className="text-gray-500 mb-6">Start adding notes to your dashboard to track your study progress by subject.</p>
            <button className="bg-[#F26B1D] hover:bg-[#D72638] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Browse Notes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Total Notes Count */}
            <div className="bg-gradient-to-r from-[#F26B1D]/10 to-[#D72638]/10 p-4 rounded-lg border border-[#F26B1D]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#F26B1D]/20 rounded-lg">
                    <BookOpen className="h-6 w-6 text-[#F26B1D]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Total Notes Added</h4>
                    <p className="text-sm text-gray-600">Notes saved to your dashboard</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-[#F26B1D]">{notesSummary.totalNotes}</span>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">By Subject</h4>
              {notesSummary.subjectBreakdown.map((item, index) => (
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

      {/* Subject-wise Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Subject-wise Progress</h3>
        <div className="space-y-4">
          {progress.subjectProgress.map((subject, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                  <span className="text-sm text-[#F26B1D] font-medium">{subject.goal}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{subject.progress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(subject.progress)}`}
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Notes</p>
                  <p className="font-semibold">{subject.notesCompleted}/{subject.totalNotes}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Tests</p>
                  <p className="font-semibold">{subject.testsCompleted}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Avg Score</p>
                  <p className="font-semibold">{subject.averageScore}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>
        {progress.achievements.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No achievements yet. Keep studying to unlock your first achievement!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.achievements.slice(0, 4).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#F26B1D] transition-colors"
              >
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Activity</h3>
        <div className="space-y-3">
          {progress.weeklyActivity.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900 w-16">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{day.notesStudied} notes</span>
                  <span>{day.testsTaken} tests</span>
                  <span>{day.timeSpent}min</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {(day.notesStudied > 0 || day.testsTaken > 0) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;