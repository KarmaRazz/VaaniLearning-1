import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Calendar, Edit2, Save, X, Camera } from 'lucide-react';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
  joinDate: string;
  goals: string[];
  totalNotesAccessed: number;
  totalTestsTaken: number;
  averageScore: number;
}

const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    goals: [] as string[]
  });

  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['/api/student/profile'],
    queryFn: async () => {
      const response = await fetch('/api/student/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json() as StudentProfile;
    }
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name,
        email: profile.email,
        goals: profile.goals
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<StudentProfile>) => {
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student/profile'] });
      setIsEditing(false);
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        name: profile.name,
        email: profile.email,
        goals: profile.goals
      });
    }
    setIsEditing(false);
  };

  const goalOptions = ['CEE', 'IOE', 'Lok Sewa', 'ACCA', 'Language'];

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

  if (error || !profile) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Info</h2>
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Failed to load profile information. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Profile Info</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 px-3 py-2 text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white border border-[#F26B1D] rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 p-1 bg-[#F26B1D] text-white rounded-full hover:bg-[#D72638] transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          )}
        </div>
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              className="text-2xl font-bold text-gray-900 border-b-2 border-[#F26B1D] bg-transparent focus:outline-none"
            />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
          )}
          <div className="flex items-center space-x-2 text-gray-600 mt-1">
            <Mail className="h-4 w-4" />
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-[#F26B1D]"
              />
            ) : (
              <span>{profile.email}</span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons for Edit Mode */}
      {isEditing && (
        <div className="flex space-x-2 mb-6">
          <button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="flex items-center space-x-1 px-4 py-2 bg-[#F26B1D] hover:bg-[#D72638] text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save'}</span>
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center space-x-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="text-gray-900">{profile.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Learning Goals</label>
              {isEditing ? (
                <div className="space-y-2">
                  {goalOptions.map((goal) => (
                    <label key={goal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editForm.goals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditForm({...editForm, goals: [...editForm.goals, goal]});
                          } else {
                            setEditForm({...editForm, goals: editForm.goals.filter(g => g !== goal)});
                          }
                        }}
                        className="rounded border-gray-300 text-[#F26B1D] focus:ring-[#F26B1D]"
                      />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.goals.map((goal) => (
                    <span
                      key={goal}
                      className="px-3 py-1 bg-[#F26B1D] bg-opacity-10 text-[#F26B1D] text-sm font-medium rounded-full"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Learning Statistics</h4>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">Notes Accessed</span>
                <span className="text-xl font-bold text-blue-600">{profile.totalNotesAccessed}</span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-900">Tests Taken</span>
                <span className="text-xl font-bold text-green-600">{profile.totalTestsTaken}</span>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-yellow-900">Average Score</span>
                <span className="text-xl font-bold text-yellow-600">{profile.averageScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;