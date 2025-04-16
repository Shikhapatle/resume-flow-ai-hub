
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { SkillFormValues } from './SkillsForm';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillsItemProps {
  skillsGroup: SkillFormValues;
  onEdit: () => void;
  onDelete: () => void;
}

const SkillsItem: React.FC<SkillsItemProps> = ({
  skillsGroup,
  onEdit,
  onDelete
}) => {
  // Helper function to get badge color based on skill level
  const getBadgeVariant = (level?: string) => {
    switch(level) {
      case 'Beginner': return 'outline';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'default';
      case 'Expert': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{skillsGroup.category}</CardTitle>
            <CardDescription className="text-base">
              {skillsGroup.skills.length} skills
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
        <div className="flex flex-wrap gap-2">
          {skillsGroup.skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant={getBadgeVariant(skill.level)}
              className="px-2 py-1"
            >
              {skill.name} {skill.level && `• ${skill.level}`}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsItem;
