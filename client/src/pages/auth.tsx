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

export default function Auth() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, login } = useAuth();
  const { toast } = useToast();

  // Get mode from URL params (login or signup)
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    if (urlMode === 'signup') {
      setMode('signup');
    }
  }, [location]);

  // Form state for login
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  
  // Form state for signup
  const [signupForm, setSignupForm] = useState({
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

  // Validation states for signup
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  
  // Validation messages
  const [validationMessages, setValidationMessages] = useState<{[key: string]: string}>({});

  // Fetch goals from API for signup
  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
    queryFn: async () => {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json();
    },
    enabled: mode === 'signup'
  });

  // Redirect if already logged in or after successful auth
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

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      // Redirect will be handled by the useEffect above
    } catch (error) {
      // Error handling is done in the auth hook
    } finally {
      setIsLoading(false);
    }
  };

  // Signup validation functions
  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-z_]{3,20}$/;
    const isValid = usernameRegex.test(username);
    setUsernameValid(username ? isValid : null);
    return isValid;
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValid = passwordRegex.test(password);
    setPasswordValid(password ? isValid : null);
    return isValid;
  };

  // Check credential uniqueness with debounce for auth modal
  const checkCredentialUniqueness = async (field: string, value: string) => {
    if (!value) return;

    try {
      const response = await fetch('/api/auth/check-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      
      if (response.ok) {
        const data = await response.json();
        const exists = data.exists[field];
        
        if (field === 'username') {
          setUsernameValid(!exists && validateUsername(value));
          if (exists) {
            setValidationMessages(prev => ({ ...prev, username: 'Username already taken' }));
          } else {
            setValidationMessages(prev => ({ ...prev, username: '' }));
          }
        } else if (field === 'email') {
          setEmailValid(!exists);
          if (exists) {
            setValidationMessages(prev => ({ ...prev, email: 'Email already registered' }));
          } else {
            setValidationMessages(prev => ({ ...prev, email: '' }));
          }
        } else if (field === 'phoneNumber') {
          setPhoneValid(!exists);
          if (exists) {
            setValidationMessages(prev => ({ ...prev, phoneNumber: 'Phone number already in use' }));
          } else {
            setValidationMessages(prev => ({ ...prev, phoneNumber: '' }));
          }
        }
      }
    } catch (error) {
      console.error('Error checking credentials:', error);
    }
  };

  // Debounce credential checks for signup mode
  useEffect(() => {
    if (mode !== 'signup') return;
    
    const timer = setTimeout(() => {
      if (signupForm.username.length >= 3) {
        checkCredentialUniqueness('username', signupForm.username);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [signupForm.username, mode]);

  useEffect(() => {
    if (mode !== 'signup') return;
    
    const timer = setTimeout(() => {
      if (signupForm.email.length > 0 && signupForm.email.includes('@')) {
        checkCredentialUniqueness('email', signupForm.email);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [signupForm.email, mode]);

  useEffect(() => {
    if (mode !== 'signup') return;
    
    const timer = setTimeout(() => {
      if (signupForm.phoneNumber.length === 10) {
        checkCredentialUniqueness('phoneNumber', signupForm.phoneNumber);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [signupForm.phoneNumber, mode]);

  const handleSignupInputChange = (field: string, value: string) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    if (field === 'username') {
      if (value.length >= 3) {
        validateUsername(value);
      } else {
        setUsernameValid(null);
        setValidationMessages(prev => ({ ...prev, username: '' }));
      }
    } else if (field === 'password') {
      validatePassword(value);
    } else if (field === 'email') {
      setEmailValid(null);
      setValidationMessages(prev => ({ ...prev, email: '' }));
    } else if (field === 'phoneNumber') {
      setPhoneValid(null);
      setValidationMessages(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  // Signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, username, email, password, gender, goalId, phoneNumber } = signupForm;
    
    if (!name || !username || !email || !password || !gender || !goalId || !phoneNumber) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!validateUsername(username)) {
      toast({
        title: 'Invalid Username',
        description: 'Username must be lowercase, no spaces, no numbers. Use underscore _ if needed.',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        variant: 'destructive',
      });
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
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
          ...signupForm,
          goalId: parseInt(signupForm.goalId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      toast({
        title: 'Success',
        description: 'Account created successfully! Please log in.',
      });

      // Switch to login mode
      setMode('login');
      setSignupForm({
        name: '',
        username: '',
        email: '',
        password: '',
        gender: '',
        goalId: '',
        phoneNumber: ''
      });
      
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
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold" style={{ color: '#F26B1D' }}>
              {mode === 'login' ? 'Welcome Back' : 'Join Vaani Learning'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {mode === 'login' ? 'Sign in to your account' : 'Start your journey to academic excellence'}
            </p>
          </CardHeader>
          
          <CardContent>
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#F26B1D] hover:bg-[#D72638] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Signup form fields */}
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => handleSignupInputChange('name', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username *</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      value={signupForm.username}
                      onChange={(e) => handleSignupInputChange('username', e.target.value.toLowerCase())}
                      className={`mt-1 pr-8 ${usernameValid === null ? '' : usernameValid ? 'border-green-500' : 'border-red-500'}`}
                      placeholder="john_doe"
                      required
                    />
                    {usernameValid !== null && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {usernameValid ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {validationMessages.username ? (
                    <p className="text-xs text-red-500 mt-1">{validationMessages.username}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Lowercase only, no spaces or numbers. Use underscore _ if needed.
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => handleSignupInputChange('email', e.target.value)}
                      className={`mt-1 pr-10 ${emailValid === true ? 'border-green-500' : emailValid === false ? 'border-red-500' : ''}`}
                      required
                    />
                    {emailValid !== null && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0.5">
                        {emailValid ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {validationMessages.email && (
                    <p className="text-xs text-red-500 mt-1">{validationMessages.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={signupForm.password}
                      onChange={(e) => handleSignupInputChange('password', e.target.value)}
                      className={`mt-1 pr-16 ${passwordValid === null ? '' : passwordValid ? 'border-green-500' : 'border-red-500'}`}
                      required
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
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
                    Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
                  </p>
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={signupForm.gender} onValueChange={(value) => handleSignupInputChange('gender', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal">Study Goal *</Label>
                  <Select value={signupForm.goalId} onValueChange={(value) => handleSignupInputChange('goalId', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your study goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalsLoading ? (
                        <SelectItem value="" disabled>Loading goals...</SelectItem>
                      ) : (
                        goals.map((goal) => (
                          <SelectItem key={goal.id} value={goal.id.toString()}>
                            {goal.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <div className="relative">
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={signupForm.phoneNumber}
                      onChange={(e) => handleSignupInputChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`mt-1 pr-10 ${phoneValid === true ? 'border-green-500' : phoneValid === false ? 'border-red-500' : ''}`}
                      placeholder="9876543210"
                      required
                    />
                    {phoneValid !== null && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-0.5">
                        {phoneValid ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {validationMessages.phoneNumber ? (
                    <p className="text-xs text-red-500 mt-1">{validationMessages.phoneNumber}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 10-digit phone number
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#F26B1D] hover:bg-[#D72638] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-[#F26B1D] hover:text-[#D72638] font-medium"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}