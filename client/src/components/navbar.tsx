import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import logoImage from "@assets/Logo Png_1749717205842.png";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Fetch goals from database
  const { data: goals } = useQuery({
    queryKey: ["/api/goals"],
    queryFn: async () => {
      const response = await fetch("/api/goals");
      if (!response.ok) throw new Error("Failed to fetch goals");
      return response.json();
    },
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/notes", label: "Notes" },
    { href: "/mock-test", label: "Mock Test" },
  ];

  const formatGoalUrl = (goalName: string) => {
    return `/explore/${goalName.toLowerCase().replace(/\s+/g, "")}`;
  };

  const isActiveLink = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <img src={logoImage} alt="Vaani" className="h-10 w-10" />
                <h1 className="text-2xl font-bold text-primary-orange">
                  Vaani
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      isActiveLink(link.href)
                        ? "text-primary-orange"
                        : "text-gray-600 hover:text-primary-orange"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              
              {/* Courses Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-orange transition-colors duration-200 cursor-pointer flex items-center gap-1">
                    Courses
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {goals?.map((goal: any) => (
                    <DropdownMenuItem key={goal.id} asChild>
                      <Link href={formatGoalUrl(goal.name)}>
                        <span className="w-full cursor-pointer">{goal.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    {user.profilePic ? (
                      <img 
                        src={user.profilePic} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#F26B1D]/20"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/student-dashboard" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="outline" className="border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#F26B1D] hover:bg-[#D72638] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-primary-orange"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-3 py-2 text-base font-medium cursor-pointer ${
                    isActiveLink(link.href)
                      ? "text-primary-orange"
                      : "text-gray-600 hover:text-primary-orange"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            
            {/* Mobile Courses Section */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-2 text-base font-medium text-gray-900">Courses</div>
              {goals?.map((goal: any) => (
                <Link key={goal.id} href={formatGoalUrl(goal.name)}>
                  <span
                    className="block px-6 py-2 text-sm text-gray-600 hover:text-primary-orange cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {goal.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="pt-2 space-y-2 border-t border-gray-200 mt-2">
              {isAuthenticated && user ? (
                <>
                  {/* Mobile User Profile Section */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {user.profilePic ? (
                      <img 
                        src={user.profilePic} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#F26B1D]/20"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-[#F26B1D] to-[#D72638] rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">Student</p>
                    </div>
                  </div>
                  
                  <Link href="/student-dashboard">
                    <Button
                      variant="outline"
                      className="w-full border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button
                    className="w-full bg-primary-orange hover:bg-orange-600 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login / Register
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
