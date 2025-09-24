
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/Layout";

const PostJob = () => {
  const { createJob } = useJobs();
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
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user && user.role !== "employer") {
      navigate("/");
    } else if (user && user.company) {
      // Pre-fill company name if available
      setFormData((prev) => ({ ...prev, company: user.company || "" }));
    }
  }, [user, isLoading, navigate]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      
      await createJob({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: requirementsArray,
        salary: formData.salary,
        type: formData.type,
      });
      
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job listing");
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
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>
              Fill out the form below to create a new job listing
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
                    placeholder="e.g. Senior Frontend Developer"
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
                    placeholder="e.g. Acme Inc."
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
                    placeholder="e.g. New York, NY or Remote"
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
                    placeholder="Provide a detailed description of the role, responsibilities, and company..."
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
                    placeholder="e.g. 
3+ years of React experience
TypeScript knowledge
CSS/Tailwind skills"
                    rows={5}
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                  />
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
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PostJob;
