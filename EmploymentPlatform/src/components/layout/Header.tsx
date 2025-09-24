
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, BriefcaseIcon, LogOut } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-hiresphere-primary" />
            <span className="text-xl font-bold">HireSphere</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/jobs" className="text-sm font-medium hover:text-hiresphere-primary transition-colors">
            Browse Jobs
          </Link>
          {user?.role === "employer" && (
            <Link to="/employer/dashboard" className="text-sm font-medium hover:text-hiresphere-primary transition-colors">
              Employer Dashboard
            </Link>
          )}
          {user?.role === "jobseeker" && (
            <Link to="/applications" className="text-sm font-medium hover:text-hiresphere-primary transition-colors">
              My Applications
            </Link>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMobileMenuOpen ? "hidden" : "block"}
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMobileMenuOpen ? "block" : "hidden"}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-3 p-4 border-t">
            <Link
              to="/jobs"
              className="text-sm font-medium hover:text-hiresphere-primary transition-colors"
              onClick={toggleMobileMenu}
            >
              Browse Jobs
            </Link>
            {user?.role === "employer" && (
              <Link
                to="/employer/dashboard"
                className="text-sm font-medium hover:text-hiresphere-primary transition-colors"
                onClick={toggleMobileMenu}
              >
                Employer Dashboard
              </Link>
            )}
            {user?.role === "jobseeker" && (
              <Link
                to="/applications"
                className="text-sm font-medium hover:text-hiresphere-primary transition-colors"
                onClick={toggleMobileMenu}
              >
                My Applications
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-medium hover:text-hiresphere-primary transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start px-2"
                  onClick={() => {
                    logout();
                    navigate("/");
                    toggleMobileMenu();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="outline" onClick={() => {
                  navigate("/login");
                  toggleMobileMenu();
                }}>
                  Log in
                </Button>
                <Button onClick={() => {
                  navigate("/register");
                  toggleMobileMenu();
                }}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
