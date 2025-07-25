import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, login } = useAuth();
  const { toast } = useToast();

  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in or after successful login
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

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary-orange">
              Welcome to Vaani
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-primary-orange hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            
            {/* Forgot password link */}
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setLocation('/forgot-password')}
                className="text-sm text-[#F26B1D] hover:text-[#D72638] font-medium transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Forgot your password?
              </button>
            </div>
            
            {/* New user signup link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                New user?{' '}
                <button
                  type="button"
                  onClick={() => setLocation('/signup')}
                  className="text-[#F26B1D] hover:text-[#D72638] font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  Sign Up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
