
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useJobs, Application } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";

const ApplicationBadge = ({ status }: { status: Application["status"] }) => {
  const variants: Record<Application["status"], { bg: string; text: string }> = {
    pending: { bg: "bg-yellow-50", text: "text-yellow-600" },
    reviewed: { bg: "bg-blue-50", text: "text-blue-600" },
    interview: { bg: "bg-purple-50", text: "text-purple-600" },
    hired: { bg: "bg-green-50", text: "text-green-600" },
    rejected: { bg: "bg-red-50", text: "text-red-600" },
  };

  const { bg, text } = variants[status];

  return (
    <Badge variant="outline" className={`${bg} ${text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const ApplicationsList = () => {
  const { getUserApplications, jobs } = useJobs();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState<
    (Application & { jobTitle: string; company: string })[]
  >([]);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user && user.role !== "jobseeker") {
      navigate("/");
    }
  }, [user, isLoading, navigate]);
  
  useEffect(() => {
    if (user) {
      const userApplications = getUserApplications();
      
      const enrichedApplications = userApplications.map((app) => {
        const job = jobs.find((j) => j.id === app.jobId);
        return {
          ...app,
          jobTitle: job?.title || "Unknown Position",
          company: job?.company || "Unknown Company",
        };
      });
      
      setApplications(enrichedApplications);
    }
  }, [user, getUserApplications, jobs]);
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
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
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground">
              Track all your job applications in one place
            </p>
          </div>
          
          <div className="mt-8">
            {applications.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No applications yet</CardTitle>
                  <CardDescription>
                    You haven't applied to any jobs yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    to="/jobs" 
                    className="text-hiresphere-primary hover:underline"
                  >
                    Browse jobs and start applying
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <Link 
                            to={`/jobs/${application.jobId}`} 
                            className="text-xl font-semibold hover:text-hiresphere-primary transition-colors"
                          >
                            {application.jobTitle}
                          </Link>
                          <p className="text-muted-foreground">
                            {application.company}
                          </p>
                          <p className="text-sm mt-2">
                            Applied {formatDate(application.appliedDate)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col md:items-end gap-2">
                          <ApplicationBadge status={application.status} />
                          
                          {application.coverLetter && (
                            <div className="text-sm text-muted-foreground">
                              Cover letter submitted
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationsList;
