
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useJobs } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobCard from "@/components/jobs/JobCard";
import Layout from "@/components/layout/Layout";
import { BriefcaseIcon } from "lucide-react";

const Index = () => {
  const { jobs } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  
  useEffect(() => {
    const recent = [...jobs]
      .filter(job => job.isActive)
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
      .slice(0, 4);
    
    setFeaturedJobs(recent);
  }, [jobs]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
  };
  
  return (
    <Layout>
      <div className="relative bg-hiresphere-background py-20 md:py-28">
        <div className="container max-w-6xl">
          <div className="text-center mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Find Your Dream Job With <span className="text-hiresphere-primary">HireSphere</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Connect with the best employers and discover opportunities that match your skills and career goals.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
              <Input
                placeholder="Search for jobs, skills, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="bg-hiresphere-primary hover:bg-hiresphere-secondary">
                Search Jobs
              </Button>
            </form>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Remote", "Full-Time", "Engineering", "Marketing", "Design"].map((tag) => (
                <Link key={tag} to={`/jobs?search=${tag}`}>
                  <Button variant="outline" size="sm">
                    {tag}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Opportunities</h2>
            <Link to="/jobs" className="text-hiresphere-primary hover:underline">
              View all jobs
            </Link>
          </div>
          
          {featuredJobs.length === 0 ? (
            <div className="text-center py-10">
              <p>No job listings available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="py-16 bg-hiresphere-light">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <BriefcaseIcon className="h-12 w-12 mx-auto mb-6 text-hiresphere-primary" />
            <h2 className="text-3xl font-bold mb-6">For Employers</h2>
            <p className="text-lg mb-8">
              Find the perfect candidate for your open positions. Post jobs, review applications, and connect with talent.
            </p>
            
            {user && user.role === "employer" ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={() => navigate("/employer/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button onClick={() => navigate("/employer/post-job")} variant="outline">
                  Post a New Job
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {user ? (
                  <Button onClick={() => navigate("/profile")}>
                    Switch to Employer Account
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/register")}>
                    Create Employer Account
                  </Button>
                )}
                <Button onClick={() => navigate("/jobs")} variant="outline">
                  Browse Jobs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">How HireSphere Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-hiresphere-light h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-hiresphere-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up as a job seeker to browse and apply for jobs, or as an employer to post openings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-hiresphere-light h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-hiresphere-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {user?.role === "employer" ? "Post Jobs" : "Browse Opportunities"}
              </h3>
              <p className="text-muted-foreground">
                {user?.role === "employer"
                  ? "Create detailed job listings and reach qualified candidates."
                  : "Search and filter through available positions to find your perfect match."}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-hiresphere-light h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-hiresphere-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {user?.role === "employer" ? "Review Applications" : "Apply and Connect"}
              </h3>
              <p className="text-muted-foreground">
                {user?.role === "employer"
                  ? "Review applicants and move candidates through your hiring pipeline."
                  : "Submit applications and track your status for each position."}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-hiresphere-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers on HireSphere today and take the next step in your career journey.
          </p>
          
          {user ? (
            <Button
              size="lg"
              className="bg-white text-hiresphere-primary hover:bg-gray-100"
              onClick={() => navigate(user.role === "employer" ? "/employer/dashboard" : "/jobs")}
            >
              {user.role === "employer" ? "Go to Dashboard" : "Browse Jobs"}
            </Button>
          ) : (
            <div className="flex text-dark flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-dark text-hiresphere-primary hover:bg-gray-100"
                onClick={() => navigate("/register")}
              >
                Create an Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-dark border-white bg-dark hover:bg-hiresphere-secondary"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
