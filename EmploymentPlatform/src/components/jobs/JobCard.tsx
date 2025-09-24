
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BriefcaseIcon } from 'lucide-react';
import { Job } from '@/contexts/JobContext';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-hiresphere-light p-3 rounded-md">
              <BriefcaseIcon className="h-6 w-6 text-hiresphere-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <p className="text-sm mt-1">{job.location}</p>
            </div>
          </div>
          <Badge variant={job.type === 'full-time' ? 'default' : 'outline'}>
            {job.type.replace('-', ' ')}
          </Badge>
        </div>
        
        <div className="mt-4">
          <p className="text-sm line-clamp-3">{job.description}</p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {job.requirements.slice(0, 3).map((requirement, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {requirement}
            </Badge>
          ))}
          {job.requirements.length > 3 && (
            <Badge variant="secondary" className="text-xs">+{job.requirements.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/30 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Posted {formatDate(job.postedDate)}
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm font-medium text-hiresphere-primary hover:underline"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
