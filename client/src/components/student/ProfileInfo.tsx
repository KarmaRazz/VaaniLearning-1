import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Phone, Target, Shield, UserCheck, Camera, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      return response.json() as Promise<StudentProfile>;
    },
    retry: false
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await fetch('/api/student/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      setShowChangePassword(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Profile picture upload mutation
  const uploadProfilePicMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profilePic', file);
      
      const response = await fetch('/api/auth/upload-profile-pic', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload profile picture');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/student/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handlePasswordSubmit = () => {
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character',
        variant: 'destructive',
      });
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirmation do not match',
        variant: 'destructive',
      });
      return;
    }
    
    changePasswordMutation.mutate({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }
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

  const handleProfilePicUpload = () => {
    if (selectedFile) {
      uploadProfilePicMutation.mutate(selectedFile);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Profile Info</h2>
        <div className="animate-pulse">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 text-center sm:text-left">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-48 mx-auto sm:mx-0"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-40 sm:w-64 mx-auto sm:mx-0"></div>
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
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Profile Info</h2>
        <div className="text-center py-8">
          <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-500">Please login to view your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Profile Info</h2>
        <Button
          onClick={() => setShowChangePassword(true)}
          variant="outline"
          size="sm"
          className="border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white text-xs sm:text-sm w-full sm:w-auto"
        >
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Change Password
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
        <div className="relative">
          {profile?.profilePic ? (
            <img 
              src={profile.profilePic} 
              alt="Profile" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#F26B1D]/20"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center">
              <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-[#F26B1D] hover:bg-[#D72638] text-white rounded-full p-1.5 sm:p-2 shadow-lg transition-colors">
                <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-center">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#F26B1D]/20"
                    />
                  ) : profile?.profilePic ? (
                    <img
                      src={profile.profilePic}
                      alt="Current"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#F26B1D]/20"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-pic">Choose Image</Label>
                  <Input
                    id="profile-pic"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleProfilePicUpload}
                    disabled={!selectedFile || uploadProfilePicMutation.isPending}
                    className="flex-1"
                  >
                    {uploadProfilePicMutation.isPending ? 'Uploading...' : 'Update Picture'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h3>
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 mt-1 text-sm sm:text-base">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="break-all">{user.email}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-500 text-xs sm:text-sm mt-1">
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Student Member</span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Personal Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Personal Information</h4>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Username</p>
                <p className="text-sm sm:text-base text-gray-900 truncate">{profile?.username || 'Not available'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm sm:text-base text-gray-900 break-all">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Phone Number</p>
                <p className="text-sm sm:text-base text-gray-900">{profile?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Goal</p>
                <p className="text-sm sm:text-base text-gray-900">{profile?.goalName || 'Not selected'}</p>
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

      {/* Change Password Modal */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="old-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="old-password"
                  type={showOldPassword ? "text" : "password"}
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                At least 8 characters, 1 uppercase, 1 number, 1 special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={() => setShowChangePassword(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                disabled={changePasswordMutation.isPending || !passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                className="flex-1"
              >
                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileInfo;