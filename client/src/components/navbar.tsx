import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import logoImage from "@assets/Logo Png_1749717205842.png";
import { useAuth } from "@/hooks/use-auth";
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/notes", label: "Notes" },
    { href: "/mock-test", label: "Mock Test" },
  ];

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
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                Admin
              </Button>
            </Link>
            
            {isAuthenticated && user ? (
              <>
                <Link href="/student-dashboard">
                  <Button variant="outline" className="border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/student-dashboard" className="w-full">
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
              </>
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
            <div className="pt-2 space-y-2">
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Button>
              </Link>
              
              {isAuthenticated && user ? (
                <>
                  <Link href="/student-dashboard">
                    <Button
                      variant="outline"
                      className="w-full border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between w-full p-2 text-sm text-gray-600">
                    <span>Welcome, {user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
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
