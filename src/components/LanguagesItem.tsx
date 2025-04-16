
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { LanguageFormValues } from './LanguagesForm';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LanguagesItemProps {
  languages: LanguageFormValues;
  onEdit: () => void;
  onDelete: () => void;
}

const LanguagesItem: React.FC<LanguagesItemProps> = ({
  languages,
  onEdit,
  onDelete
}) => {
  // Helper function to get badge color based on language proficiency
  const getBadgeVariant = (proficiency?: string) => {
    switch(proficiency) {
      case 'Native': return 'destructive';
      case 'Fluent': return 'default';
      case 'Advanced': return 'secondary';
      case 'Intermediate': return 'outline';
      case 'Basic': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Languages</CardTitle>
            <CardDescription className="text-base">
              {languages.languages.length} languages
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
          {languages.languages.map((language, index) => (
            <Badge 
              key={index} 
              variant={getBadgeVariant(language.proficiency)}
              className="px-2 py-1"
            >
              {language.name} {language.proficiency && `• ${language.proficiency}`}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguagesItem;
