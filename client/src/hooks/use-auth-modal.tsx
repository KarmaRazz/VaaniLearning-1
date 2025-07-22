import { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface AuthModalContextType {
  showAuthModal: (returnUrl?: string, noteId?: string) => void;
  hideAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const showAuthModal = (returnUrl?: string, noteId?: string) => {
    // Store return information in sessionStorage for after login
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }
    if (noteId) {
      sessionStorage.setItem('returnNoteId', noteId);
    }
    setIsOpen(true);
  };

  const hideAuthModal = () => {
    setIsOpen(false);
  };

  const handleSignUp = () => {
    setIsOpen(false);
    setLocation('/auth?mode=signup');
  };

  const handleLogin = () => {
    setIsOpen(false);
    setLocation('/auth?mode=login');
  };

  return (
    <AuthModalContext.Provider value={{ showAuthModal, hideAuthModal }}>
      {children}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Sign in Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-center text-gray-600">
              You need to sign up or log in to view this content.
            </p>
            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleSignUp}
                className="w-full bg-[#F26B1D] hover:bg-[#D72638] text-white"
              >
                Sign Up
              </Button>
              <Button
                onClick={handleLogin}
                variant="outline"
                className="w-full border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white"
              >
                Log In
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}