import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  BookOpen, 
  ClipboardCheck, 
  User, 
  TrendingUp,
  Calendar,
  Award,
  FileText,
  BarChart3,
  Camera,
  Home
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MyNotes from './MyNotes';
import TestHistory from './TestHistory';
import ProfileInfo from './ProfileInfo';
import ProgressTracker from './ProgressTracker';

type DashboardSection = 'notes' | 'tests' | 'profile' | 'progress';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('notes');
  const { user } = useAuth();
  const [, setLocation] = useLocation();

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Hi, {user?.name || 'Student'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your learning journey</p>
            </div>
            {/* Home Button and User Avatar */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Home Button */}
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                size="sm"
                className="border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white transition-colors text-xs sm:text-sm"
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              
              {/* User Avatar with Profile Picture Viewer */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
                    {user?.profilePic ? (
                      <img 
                        src={user.profilePic} 
                        alt="Profile" 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#F26B1D]/20 hover:border-[#F26B1D] transition-colors"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center hover:shadow-lg transition-shadow">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                    )}
                  </div>
                </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-6">
                  {user?.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[#F26B1D]/20"
                    />
                  ) : (
                    <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 sm:h-24 sm:w-24 text-white" />
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Tab Navigation - Visible only on small screens */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-lg shadow-sm p-2">
            <div className="grid grid-cols-2 gap-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg text-center transition-colors ${
                      activeSection === item.id
                        ? 'bg-[#F26B1D] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
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
          <div className="flex-1 min-w-0">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;