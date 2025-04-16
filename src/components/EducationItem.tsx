
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { EducationFormValues } from './EducationForm';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';

interface EducationItemProps {
  education: EducationFormValues;
  onEdit: () => void;
  onDelete: () => void;
}

const EducationItem: React.FC<EducationItemProps> = ({
  education,
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
            <CardTitle className="text-lg">{education.degree}</CardTitle>
            <CardDescription className="text-base">
              {education.institution}
              {education.location && ` • ${education.location}`}
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
          {formatDate(education.startDate)} — {education.currentlyStudying ? 'Present' : formatDate(education.endDate)}
          {education.gpa && ` • GPA: ${education.gpa}`}
          {education.fieldOfStudy && ` • ${education.fieldOfStudy}`}
        </div>
        {education.description && (
          <p className="text-sm whitespace-pre-line">{education.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationItem;
