
import { useState, useEffect } from "react";
import { useJobs } from "@/contexts/JobContext";
import JobCard from "@/components/jobs/JobCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/Layout";

const JobsList = () => {
  const { jobs, isLoading } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let result = jobs;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      );
    }

    // Filter by job type
    if (typeFilter !== "all") {
      result = result.filter((job) => job.type === typeFilter);
    }

    // Only show active jobs
    result = result.filter((job) => job.isActive);

    setFilteredJobs(result);
  }, [jobs, searchQuery, typeFilter]);

  return (
    <Layout>
      <div className="container py-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
          <p className="text-muted-foreground">
            Browse through our curated list of opportunities to find your perfect match
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 grid gap-4 md:grid-cols-[2fr_1fr]">
          <div>
            <Input
              placeholder="Search for jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-12">Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobsList;
