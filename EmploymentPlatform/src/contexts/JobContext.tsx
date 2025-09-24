
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from './AuthContext';
import { api } from "@/lib/api";

// Define types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  postedBy: string; // User ID
  postedDate: string;
  isActive: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  coverLetter?: string;
  resume?: string;
  status: 'pending' | 'reviewed' | 'interview' | 'hired' | 'rejected';
  appliedDate: string;
}

interface JobContextType {
  jobs: Job[];
  applications: Application[];
  isLoading: boolean;
  getJob: (id: string) => Job | undefined;
  getApplicationsForJob: (jobId: string) => Application[];
  getUserApplications: () => Application[];
  createJob: (jobData: Omit<Job, 'id' | 'postedBy' | 'postedDate' | 'isActive'>) => Promise<Job>;
  updateJob: (id: string, jobData: Partial<Job>) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  applyForJob: (jobId: string, applicationData: { coverLetter?: string, resume?: string }) => Promise<Application>;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => Promise<Application>;
}

// Create context
const JobContext = createContext<JobContextType | undefined>(undefined);

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load jobs and applications from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const list = await api<Job[]>(`/jobs`);
        setJobs(list);
        // If authenticated, try to load my applications
        try {
          const myApps = await api<Application[]>(`/applications/my`);
          setApplications(myApps);
        } catch (_) {}
      } catch (error) {
        console.error('Failed to load jobs', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Get a specific job by ID
  const getJob = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  // Get applications for a specific job
  const getApplicationsForJob = (jobId: string) => {
    // Proactively fetch employer job applications in background
    if (user?.role === 'employer') {
      api<Application[]>(`/jobs/${jobId}/applications`).then(remote => {
        setApplications(prev => {
          const byId = new Map(prev.map(a => [a.id, a] as const));
          for (const a of remote) byId.set(a.id, a);
          return Array.from(byId.values());
        });
      }).catch(() => {});
    }
    return applications.filter(app => app.jobId === jobId);
  };

  // Get applications for the current user
  const getUserApplications = () => {
    return applications;
  };

  // Create a new job
  const createJob = async (jobData: Omit<Job, 'id' | 'postedBy' | 'postedDate' | 'isActive'>) => {
    if (!user) throw new Error('You must be logged in to post a job');
    if (user.role !== 'employer') throw new Error('Only employers can post jobs');
    try {
      const created = await api<Job>(`/jobs`, { method: 'POST', body: JSON.stringify(jobData) });
      setJobs(prev => [...prev, created]);
      toast({ title: "Job created", description: "Your job listing has been posted successfully" });
      return created;
    } catch (error) {
      toast({ title: "Failed to create job", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
      throw error;
    }
  };

  // Update an existing job
  const updateJob = async (id: string, jobData: Partial<Job>) => {
    if (!user) throw new Error('You must be logged in to update a job');
    try {
      const updated = await api<Job>(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(jobData) });
      setJobs(prev => prev.map(j => j.id === id ? updated : j));
      toast({ title: "Job updated", description: "Your job listing has been updated successfully" });
      return updated;
    } catch (error) {
      toast({ title: "Failed to update job", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
      throw error;
    }
  };

  // Delete a job
  const deleteJob = async (id: string) => {
    if (!user) throw new Error('You must be logged in to delete a job');
    try {
      await api<void>(`/jobs/${id}`, { method: 'DELETE' });
      setJobs(prev => prev.filter(job => job.id !== id));
      // remove related applications from cache
      setApplications(prev => prev.filter(app => app.jobId !== id));
      toast({ title: "Job deleted", description: "Your job listing has been removed" });
    } catch (error) {
      toast({ title: "Failed to delete job", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
      throw error;
    }
  };

  // Apply for a job
  const applyForJob = async (jobId: string, applicationData: { coverLetter?: string, resume?: string }) => {
    if (!user) throw new Error('You must be logged in to apply for a job');
    if (user.role !== 'jobseeker') throw new Error('Only job seekers can apply for jobs');
    try {
      const app = await api<Application>(`/applications`, { method: 'POST', body: JSON.stringify({ jobId, ...applicationData }) });
      setApplications(prev => [app, ...prev]);
      toast({ title: "Application submitted", description: "Your application has been submitted successfully" });
      return app;
    } catch (error) {
      toast({ title: "Failed to apply", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
      throw error;
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    if (!user) throw new Error('You must be logged in to update an application');
    try {
      const app = await api<Application>(`/applications/${applicationId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setApplications(prev => prev.map(a => a.id === applicationId ? app : a));
      toast({ title: "Status updated", description: `Application status changed to ${status}` });
      return app;
    } catch (error) {
      toast({ title: "Failed to update status", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
      throw error;
    }
  };

  return (
    <JobContext.Provider value={{
      jobs,
      applications,
      isLoading,
      getJob,
      getApplicationsForJob,
      getUserApplications,
      createJob,
      updateJob,
      deleteJob,
      applyForJob,
      updateApplicationStatus
    }}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook for using job context
export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
