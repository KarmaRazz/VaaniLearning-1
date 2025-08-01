import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { AuthModalProvider } from "@/hooks/use-auth-modal";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import About from "@/pages/about";
import Notes from "@/pages/notes";
import MockTest from "@/pages/mock-test";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Auth from "@/pages/auth";
import AdminPanel from "@/pages/admin";
import CourseDetails from "@/pages/course-details";
import StudentDashboardPage from "@/pages/student-dashboard";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import CEEPage from "@/pages/explore/cee";
import IOEPage from "@/pages/explore/ioe";
import LokSewaPage from "@/pages/explore/loksewa";
import ACCAPage from "@/pages/explore/acca";
import OthersPage from "@/pages/explore/others";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={Courses} />
      <Route path="/course/:id" component={CourseDetails} />
      <Route path="/about" component={About} />
      <Route path="/notes" component={Notes} />
      <Route path="/mock-test" component={MockTest} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/auth" component={Auth} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/student-dashboard" component={StudentDashboardPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/explore/cee" component={CEEPage} />
      <Route path="/explore/ioe" component={IOEPage} />
      <Route path="/explore/loksewa" component={LokSewaPage} />
      <Route path="/explore/acca" component={ACCAPage} />
      <Route path="/explore/others" component={OthersPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthModalProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
