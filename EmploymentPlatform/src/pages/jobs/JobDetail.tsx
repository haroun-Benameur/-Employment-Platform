
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useJobs } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BriefcaseIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getJob, applyForJob, getUserApplications } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(id ? getJob(id) : undefined);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const jobData = getJob(id);
      if (!jobData) {
        navigate("/jobs");
        return;
      }
      setJob(jobData);
      
      // Check if user has already applied
      if (user) {
        const userApplications = getUserApplications();
        const existingApplication = userApplications.find(app => app.jobId === id);
        setHasApplied(!!existingApplication);
      }
    }
  }, [id, getJob, navigate, user, getUserApplications]);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    setIsApplying(true);
    try {
      await applyForJob(id!, { coverLetter });
      setHasApplied(true);
      setDialogOpen(false);
    } catch (error) {
      console.error("Application error:", error);
    } finally {
      setIsApplying(false);
    }
  };

  if (!job) {
    return (
      <Layout>
        <div className="container py-12 text-center">Job not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-hiresphere-light overflow-hidden">
            <div className="bg-hiresphere-light p-6">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <BriefcaseIcon className="h-10 w-10 text-hiresphere-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-muted-foreground">{job.company}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant={job.type === 'full-time' ? 'default' : 'outline'}>
                      {job.type.replace('-', ' ')}
                    </Badge>
                    {job.salary && (
                      <Badge variant="secondary">{job.salary}</Badge>
                    )}
                    <Badge variant="outline">Posted {formatDate(job.postedDate)}</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6 space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="p-6 flex items-center justify-between bg-muted/30">
              <div>
                {hasApplied && (
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    You've already applied
                  </Badge>
                )}
              </div>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    disabled={hasApplied || user?.role === 'employer' || user?.id === job.postedBy}
                  >
                    {user?.role === 'employer' ? 'Employers Cannot Apply' : hasApplied ? 'Applied' : 'Apply Now'}
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                      Submit your application for this position at {job.company}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="coverLetter" className="text-sm font-medium">
                        Cover Letter (Optional)
                      </label>
                      <Textarea
                        id="coverLetter"
                        placeholder="Explain why you're a good fit for this position..."
                        rows={6}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button 
                      onClick={handleApply}
                      disabled={isApplying}
                    >
                      {isApplying ? "Submitting..." : "Submit Application"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
