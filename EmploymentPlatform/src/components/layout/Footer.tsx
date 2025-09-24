
import { Link } from "react-router-dom";
import { BriefcaseIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <BriefcaseIcon className="h-6 w-6 text-hiresphere-primary" />
              <span className="text-xl font-bold">HireSphere</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting talented professionals with their dream jobs. 
              The simplified employment platform for today's workforce.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">For Job Seekers</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/applications" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    My Applications
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">For Employers</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/employer/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/employer/post-job" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Post a Job
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} HireSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
