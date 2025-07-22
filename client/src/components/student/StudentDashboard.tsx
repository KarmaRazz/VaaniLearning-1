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
  Camera,
  Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MyNotes from './MyNotes';
import TestHistory from './TestHistory';
import ProfileInfo from './ProfileInfo';
import ProgressTracker from './ProgressTracker';

type DashboardSection = 'notes' | 'tests' | 'profile' | 'progress';

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('notes');
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sidebarItems = [
    { id: 'notes' as const, label: 'My Notes', icon: BookOpen },
    { id: 'tests' as const, label: 'Test History', icon: ClipboardCheck },
    { id: 'profile' as const, label: 'Profile Info', icon: User },
    { id: 'progress' as const, label: 'Progress Tracker', icon: TrendingUp },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePic', selectedFile);

      const response = await fetch('/api/auth/upload-profile-pic', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      toast({
        title: 'Success',
        description: 'Profile picture uploaded successfully',
      });

      setIsProfilePicModalOpen(false);
      setSelectedFile(null);
      
      // Refresh the page to show new profile picture
      window.location.reload();
      
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-[#F26B1D]">
                <Award className="h-5 w-5" />
                <span className="font-semibold">Student Portal</span>
              </div>
              
              {/* Profile Picture */}
              <Dialog open={isProfilePicModalOpen} onOpenChange={setIsProfilePicModalOpen}>
                <DialogTrigger asChild>
                  <button className="relative group">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#F26B1D] group-hover:border-[#D72638] transition-colors"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#F26B1D] group-hover:bg-[#D72638] flex items-center justify-center transition-colors">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200 group-hover:bg-gray-50">
                      <Camera className="h-2.5 w-2.5 text-gray-600" />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Profile Picture</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profile-pic">Select Image</Label>
                      <Input
                        id="profile-pic"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 5MB. Supported formats: JPG, PNG, GIF
                      </p>
                    </div>
                    
                    {selectedFile && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleProfilePicUpload}
                            disabled={isUploading}
                            className="bg-[#F26B1D] hover:bg-[#D72638]"
                          >
                            {isUploading ? (
                              <>
                                <Upload className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setSelectedFile(null)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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