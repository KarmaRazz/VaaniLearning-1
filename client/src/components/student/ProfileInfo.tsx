import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Phone, Target, Shield, Camera, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  username: string;
  profilePic?: string | null;
  phoneNumber?: string | null;
  goalName?: string | null;
  totalNotesAccessed: number;
  totalTestsTaken: number;
  averageScore: number;
}

const ProfileInfo = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['/api/student/profile'],
    queryFn: async () => {
      const response = await fetch('/api/student/profile', {
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login to view your profile');
        }
        throw new Error('Failed to fetch profile');
      }
      return response.json() as StudentProfile;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Info</h2>
        <div className="animate-pulse">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Info</h2>
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Please login to view your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Profile Info</h2>
        <Button
          onClick={() => setShowChangePassword(true)}
          variant="outline"
          className="border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white"
        >
          <Shield className="h-4 w-4 mr-2" />
          Change Password
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-1 bg-[#F26B1D] text-white rounded-full hover:bg-[#D72638] transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
          <div className="flex items-center space-x-2 text-gray-600 mt-1">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
            <UserCheck className="h-4 w-4" />
            <span>Student Member</span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserCheck className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-gray-900">{profile?.username || 'Not available'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-gray-900">{profile?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Target className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Goal</p>
                <p className="text-gray-900">{profile?.goalName || 'Not selected'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Statistics */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Learning Statistics</h4>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">Notes Accessed</span>
                <span className="text-2xl font-bold text-blue-600">{profile?.totalNotesAccessed || 0}</span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-900">Tests Taken</span>
                <span className="text-2xl font-bold text-green-600">{profile?.totalTestsTaken || 0}</span>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-orange-900">Average Score</span>
                <span className="text-2xl font-bold text-orange-600">{profile?.averageScore || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal Placeholder */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
            <p className="text-gray-600 mb-4">Password change functionality will be available soon.</p>
            <Button
              onClick={() => setShowChangePassword(false)}
              className="bg-[#F26B1D] hover:bg-[#D72638] text-white w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;