
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { WorkExperienceFormValues } from './WorkExperienceForm';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';

interface WorkExperienceItemProps {
  experience: WorkExperienceFormValues;
  onEdit: () => void;
  onDelete: () => void;
}

const WorkExperienceItem: React.FC<WorkExperienceItemProps> = ({
  experience,
  onEdit,
  onDelete
}) => {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Present';
    return format(date, 'MMM yyyy');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{experience.jobTitle}</CardTitle>
            <CardDescription className="text-base">
              {experience.company}
              {experience.location && ` • ${experience.location}`}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-3">
          {formatDate(experience.startDate)} — {experience.currentlyWorking ? 'Present' : formatDate(experience.endDate)}
        </div>
        <p className="text-sm whitespace-pre-line">{experience.description}</p>
      </CardContent>
    </Card>
  );
};

export default WorkExperienceItem;
