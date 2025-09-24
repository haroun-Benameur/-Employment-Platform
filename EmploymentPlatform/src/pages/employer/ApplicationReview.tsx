
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";

const statusOptions: Application["status"][] = [
  "pending",
  "reviewed",
  "interview",
  "hired",
  "rejected",
];

const ApplicationStatusBadge = ({ status }: { status: Application["status"] }) => {
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

const ApplicationReview = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { getJob, getApplicationsForJob, updateApplicationStatus } = useJobs();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(jobId ? getJob(jobId) : undefined);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
    
    if (user && user.role !== "employer") {
      navigate("/");
      return;
    }
    
    if (jobId) {
      const jobData = getJob(jobId);
      if (!jobData) {
        navigate("/employer/dashboard");
        return;
      }
      
      if (jobData.postedBy !== user?.id) {
        navigate("/employer/dashboard");
        return;
      }
      
      setJob(jobData);
      setApplications(getApplicationsForJob(jobId));
    }
  }, [jobId, user, isLoading, getJob, getApplicationsForJob, navigate]);
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const handleStatusChange = async (applicationId: string, status: Application["status"]) => {
    setUpdatingStatus(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };
  
  const filteredApplications = activeTab === "all"
    ? applications
    : applications.filter((app) => app.status === activeTab);
  
  if (isLoading || !user || !job) {
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
          <div className="mb-8">
            <Link
              to="/employer/dashboard"
              className="text-sm text-hiresphere-primary hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Applications for: {job.title}</CardTitle>
              <CardDescription>
                Company: {job.company} • Location: {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Posted {formatDate(job.postedDate)}
                  </p>
                </div>
                <Badge variant={job.isActive ? "default" : "outline"}>
                  {job.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">
                  All ({applications.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({applications.filter(a => a.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="reviewed">
                  Reviewed ({applications.filter(a => a.status === "reviewed").length})
                </TabsTrigger>
                <TabsTrigger value="interview">
                  Interview ({applications.filter(a => a.status === "interview").length})
                </TabsTrigger>
                <TabsTrigger value="hired">
                  Hired ({applications.filter(a => a.status === "hired").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({applications.filter(a => a.status === "rejected").length})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab}>
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center p-6">
                    <p>No applications in this category</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredApplications.map((application) => (
                    <Card key={application.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {application.applicantName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Applied {formatDate(application.appliedDate)}
                            </p>
                            
                            {application.coverLetter && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Cover Letter:</h4>
                                <div className="border p-3 rounded-md bg-muted/30 whitespace-pre-wrap text-sm">
                                  {application.coverLetter}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-start md:items-end space-y-4">
                            <div className="flex flex-col md:items-end space-y-2">
                              <p className="text-sm font-medium">Status:</p>
                              <ApplicationStatusBadge status={application.status} />
                            </div>
                            
                            <div className="w-full md:w-44">
                              <Select
                                value={application.status}
                                onValueChange={(value) => 
                                  handleStatusChange(
                                    application.id, 
                                    value as Application["status"]
                                  )
                                }
                                disabled={updatingStatus === application.id}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationReview;
