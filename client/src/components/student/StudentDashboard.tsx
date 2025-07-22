import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  ClipboardCheck, 
  User, 
  TrendingUp,
  Calendar,
  Award,
  FileText,
  BarChart3,
  Camera
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MyNotes from './MyNotes';
import TestHistory from './TestHistory';
import ProfileInfo from './ProfileInfo';
import ProgressTracker from './ProgressTracker';

type DashboardSection = 'notes' | 'tests' | 'profile' | 'progress';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('notes');
  const { user } = useAuth();

  const sidebarItems = [
    { id: 'notes' as const, label: 'My Notes', icon: BookOpen },
    { id: 'tests' as const, label: 'Test History', icon: ClipboardCheck },
    { id: 'profile' as const, label: 'Profile Info', icon: User },
    { id: 'progress' as const, label: 'Progress Tracker', icon: TrendingUp },
  ];



  const renderActiveSection = () => {
    switch (activeSection) {
      case 'notes':
        return <MyNotes />;
      case 'tests':
        return <TestHistory />;
      case 'profile':
        return <ProfileInfo />;
      case 'progress':
        return <ProgressTracker />;
      default:
        return <MyNotes />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F3]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hi, {user?.name || 'Student'}
              </h1>
              <p className="text-gray-600">Manage your learning journey</p>
            </div>
            {/* User Avatar with Profile Picture Viewer */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer">
                  {user?.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#F26B1D]/20 hover:border-[#F26B1D] transition-colors"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center hover:shadow-lg transition-shadow">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-6">
                  {user?.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-48 h-48 rounded-full object-cover border-4 border-[#F26B1D]/20"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center">
                      <User className="h-24 w-24 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-[#F26B1D] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;