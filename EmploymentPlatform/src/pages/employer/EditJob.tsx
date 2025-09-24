
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/Layout";

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const { getJob, updateJob } = useJobs();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
    type: "full-time" as "full-time" | "part-time" | "contract" | "internship",
    isActive: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
    
    if (user && user.role !== "employer") {
      navigate("/");
      return;
    }
    
    if (id) {
      const job = getJob(id);
      if (!job) {
        navigate("/employer/dashboard");
        return;
      }
      
      if (job.postedBy !== user?.id) {
        navigate("/employer/dashboard");
        return;
      }
      
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements.join("\n"),
        salary: job.salary || "",
        type: job.type,
        isActive: job.isActive,
      });
    }
  }, [id, user, isLoading, getJob, navigate]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      // Split requirements into array
      const requirementsArray = formData.requirements
        .split("\n")
        .filter((req) => req.trim() !== "");
      
      await updateJob(id!, {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: requirementsArray,
        salary: formData.salary,
        type: formData.type,
        isActive: formData.isActive,
      });
      
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job listing");
    } finally {
      setIsSubmitting(false);
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
      <div className="container max-w-3xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Edit Job Listing</CardTitle>
            <CardDescription>
              Update your job listing details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Job Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company Name *
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location *
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Job Type *
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="salary" className="text-sm font-medium">
                      Salary Range (Optional)
                    </label>
                    <Input
                      id="salary"
                      name="salary"
                      placeholder="e.g. $70,000 - $90,000"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Job Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-sm font-medium">
                    Requirements * (one per line)
                  </label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    rows={5}
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active listing (visible to job seekers)
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/employer/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-hiresphere-primary hover:bg-hiresphere-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditJob;
