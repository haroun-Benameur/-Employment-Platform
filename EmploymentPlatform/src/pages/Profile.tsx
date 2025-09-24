
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    about: "",
    skills: "",
  });
  
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect if not logged in
      navigate("/login");
    }
    
    if (user) {
      // Populate form with user data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        title: user.title || "",
        about: user.about || "",
        skills: user.skills ? user.skills.join(", ") : "",
      });
    }
  }, [user, isLoading, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    
    try {
      // Process skills from comma-separated string to array
      const skills = formData.skills
        ? formData.skills.split(",").map((skill) => skill.trim())
        : [];
      
      // Update user profile
      await updateProfile({
        name: formData.name,
        ...(user?.role === "employer" ? { company: formData.company } : {}),
        ...(user?.role === "jobseeker" ? { title: formData.title, skills } : {}),
        about: formData.about,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
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
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your profile information
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email (cannot be changed)
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                  </div>
                </div>
                
                {user.role === "employer" ? (
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Professional Title
                      </label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Senior Software Engineer"
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="skills" className="text-sm font-medium">
                        Skills (comma-separated)
                      </label>
                      <Input
                        id="skills"
                        name="skills"
                        placeholder="e.g. JavaScript, React, Node.js"
                        value={formData.skills}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="about" className="text-sm font-medium">
                    About
                  </label>
                  <Textarea
                    id="about"
                    name="about"
                    placeholder="Tell us about yourself or your company"
                    rows={5}
                    value={formData.about}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-hiresphere-primary hover:bg-hiresphere-secondary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
