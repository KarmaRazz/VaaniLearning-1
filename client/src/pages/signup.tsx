import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Check, X, Eye, EyeOff } from "lucide-react";

interface Goal {
  id: number;
  name: string;
}

export default function Signup() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    gender: '',
    goalId: '',
    phoneNumber: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation states
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);

  // Fetch goals from API
  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
    queryFn: async () => {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json();
    },
  });

  // Redirect if already logged in or after successful signup
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if there's a return URL stored
      const returnUrl = sessionStorage.getItem('returnUrl');
      const returnNoteId = sessionStorage.getItem('returnNoteId');
      
      if (returnUrl) {
        // Clear stored return information
        sessionStorage.removeItem('returnUrl');
        sessionStorage.removeItem('returnNoteId');
        setLocation(returnUrl);
      } else {
        setLocation('/');
      }
    }
  }, [isAuthenticated, user, setLocation]);

  // Username validation
  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-z_]{3,20}$/;
    const isValid = usernameRegex.test(username);
    setUsernameValid(username ? isValid : null);
    return isValid;
  };

  // Password validation
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValid = passwordRegex.test(password);
    setPasswordValid(password ? isValid : null);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (field === 'username') {
      validateUsername(value);
    } else if (field === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!formData.name || !formData.username || !formData.email || 
        !formData.password || !formData.goalId || !formData.phoneNumber) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate username format
    if (!validateUsername(formData.username)) {
      toast({
        title: 'Invalid Username',
        description: 'Username must be lowercase, no spaces, no numbers. Use underscore _ if needed.',
        variant: 'destructive',
      });
      return;
    }

    // Validate password strength
    if (!validatePassword(formData.password)) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Phone number must be exactly 10 digits',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          goalId: parseInt(formData.goalId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      toast({
        title: 'Success',
        description: 'Signup successful. Please log in.',
        variant: 'default',
      });

      // Redirect to login page
      setLocation('/login');
      
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup Failed',
        description: error instanceof Error ? error.message : 'An error occurred during signup',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF7F3' }}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Column - Signup Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold" style={{ color: '#F26B1D' }}>
                  Join Vaani Learning
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Start your journey to academic excellence
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className={`mt-1 pr-10 ${usernameValid === true ? 'border-green-500' : usernameValid === false ? 'border-red-500' : ''}`}
                        placeholder="your_username"
                        required
                      />
                      {usernameValid !== null && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0.5">
                          {usernameValid ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Username must be lowercase, no spaces, no numbers. Use underscore _ if needed.
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`mt-1 pr-20 ${passwordValid === true ? 'border-green-500' : passwordValid === false ? 'border-red-500' : ''}`}
                        placeholder="Enter a strong password"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0.5 flex items-center space-x-2">
                        {passwordValid !== null && (
                          passwordValid ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      At least 8 characters with uppercase, lowercase, number, and special character
                    </p>
                  </div>

                  {/* Gender and Goal Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Gender */}
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Goal */}
                    <div>
                      <Label htmlFor="goal">Goal *</Label>
                      <Select 
                        value={formData.goalId} 
                        onValueChange={(value) => handleInputChange('goalId', value)}
                        disabled={goalsLoading}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={goalsLoading ? "Loading goals..." : "Select your goal"} />
                        </SelectTrigger>
                        <SelectContent>
                          {goals.map((goal) => (
                            <SelectItem key={goal.id} value={goal.id.toString()}>
                              {goal.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          handleInputChange('phoneNumber', value);
                        }
                      }}
                      className="mt-1"
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 10-digit phone number without country code
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-[#F26B1D] hover:bg-[#D72638] text-white py-3 mt-6"
                    disabled={isLoading || goalsLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setLocation('/login')}
                        className="text-[#F26B1D] hover:text-[#D72638] font-medium"
                      >
                        Log in here
                      </button>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Hero Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Your Success Journey Starts{' '}
              <span style={{ color: '#F26B1D' }}>Here</span>
            </h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#F26B1D] flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Expert Instruction</h3>
                  <p className="text-gray-600">Learn from Nepal's top educators and subject matter experts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#F26B1D] flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Comprehensive Study Materials</h3>
                  <p className="text-gray-600">Access 10,000+ notes, practice tests, and video lectures</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#F26B1D] flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Doubt Support</h3>
                  <p className="text-gray-600">Get instant help whenever you need it from our support team</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#F26B1D] to-[#D72638] rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Join 50,000+ Students</h3>
              <p className="text-orange-100">
                Who have achieved their dreams with Vaani Learning Platform
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}