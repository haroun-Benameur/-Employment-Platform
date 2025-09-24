
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useJobs, Job } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, Edit, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Layout from "@/components/layout/Layout";

const Dashboard = () => {
  const { jobs, applications, getApplicationsForJob, deleteJob } = useJobs();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [employerJobs, setEmployerJobs] = useState<Job[]>([]);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user && user.role !== "employer") {
      navigate("/");
    }
  }, [user, isLoading, navigate]);
  
  useEffect(() => {
    if (user) {
      // Filter jobs posted by this employer
      const filteredJobs = jobs.filter((job) => job.postedBy === user.id);
      setEmployerJobs(filteredJobs);
    }
  }, [user, jobs]);
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteJob(jobToDelete);
      setJobToDelete(null);
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading || !user) {
    return (
      <Layout>
        <div className="container py-12">Loading...</div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-12">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Employer Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your job listings and view applications
              </p>
            </div>
            <Button 
              className="bg-hiresphere-primary hover:bg-hiresphere-secondary"
              onClick={() => navigate("/employer/post-job")}
            >
              Post New Job
            </Button>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Job Listings</h2>
          
          {employerJobs.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No job listings</CardTitle>
                <CardDescription>
                  You haven't posted any jobs yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Start attracting candidates by posting your first job listing.
                </p>
                <Button 
                  onClick={() => navigate("/employer/post-job")}
                  className="bg-hiresphere-primary hover:bg-hiresphere-secondary"
                >
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {employerJobs.map((job) => {
                const jobApplications = getApplicationsForJob(job.id);
                
                return (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-hiresphere-light p-3 rounded-md">
                          <BriefcaseIcon className="h-6 w-6 text-hiresphere-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Posted {formatDate(job.postedDate)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={job.isActive ? "default" : "outline"}>
                                {job.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="secondary">
                                {jobApplications.length} applications
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/jobs/${job.id}`)}
                            >
                              View Listing
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/employer/edit-job/${job.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog
                              open={jobToDelete === job.id}
                              onOpenChange={(open) => {
                                if (!open) setJobToDelete(null);
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-500 border-red-200 hover:bg-red-50"
                                  onClick={() => setJobToDelete(job.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the job listing and all
                                    associated applications. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={handleDeleteJob}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    {jobApplications.length > 0 && (
                      <CardFooter className="bg-muted/30 p-6 block">
                        <h4 className="font-medium mb-3">Recent Applications</h4>
                        <div className="space-y-3">
                          {jobApplications.slice(0, 3).map((application) => (
                            <div 
                              key={application.id}
                              className="p-3 bg-white rounded-md shadow-sm flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{application.applicantName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Applied {formatDate(application.appliedDate)}
                                </p>
                              </div>
                              <Link
                                to={`/employer/applications/${job.id}`}
                                className="text-sm text-hiresphere-primary hover:underline"
                              >
                                Review
                              </Link>
                            </div>
                          ))}
                          {jobApplications.length > 3 && (
                            <Link
                              to={`/employer/applications/${job.id}`}
                              className="text-sm text-hiresphere-primary hover:underline block text-center mt-4"
                            >
                              View all {jobApplications.length} applications
                            </Link>
                          )}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
