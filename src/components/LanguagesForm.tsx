
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateRecommendation } from '@/utils/aiRecommendations';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languagesFormSchema = z.object({
  languages: z.array(z.object({
    name: z.string().min(1, { message: "Language name is required" }),
    proficiency: z.enum(["Native", "Fluent", "Advanced", "Intermediate", "Basic"]).optional(),
  })).min(1, { message: "At least one language is required" }),
});

export type LanguageFormValues = z.infer<typeof languagesFormSchema>;

interface LanguagesFormProps {
  onSubmit: (data: LanguageFormValues) => void;
  onCancel: () => void;
  defaultValues?: LanguageFormValues;
  isEdit?: boolean;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false
}) => {
  const { toast } = useToast();
  const [languageInput, setLanguageInput] = useState('');
  const [isGeneratingLanguages, setIsGeneratingLanguages] = useState(false);
  
  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languagesFormSchema),
    defaultValues: defaultValues || {
      languages: [],
    },
  });

  const watchLanguages = form.watch('languages');

  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      const updatedLanguages = [...(watchLanguages || []), { name: languageInput.trim(), proficiency: "Intermediate" as const }];
      form.setValue('languages', updatedLanguages);
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = [...watchLanguages];
    updatedLanguages.splice(index, 1);
    form.setValue('languages', updatedLanguages);
  };

  const handleUpdateLanguageProficiency = (index: number, proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic") => {
    const updatedLanguages = [...watchLanguages];
    updatedLanguages[index] = { ...updatedLanguages[index], proficiency };
    form.setValue('languages', updatedLanguages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLanguage();
    }
  };

  const generateCommonLanguages = async () => {
    setIsGeneratingLanguages(true);
    try {
      const recommendations = await generateRecommendation({
        query: "list of 5 most common languages in the professional world separated by commas",
        maxLength: 200
      });
      
      // Parse comma-separated languages
      const languagesArray = recommendations
        .split(/,|\n/)
        .map(language => language.trim())
        .filter(language => language.length > 0 && language.length < 50) // Basic validation
        .map(name => ({ 
          name, 
          proficiency: "Intermediate" as const 
        }));
      
      if (languagesArray.length > 0) {
        form.setValue('languages', [...watchLanguages, ...languagesArray]);
        toast({
          title: "Languages Generated",
          description: `${languagesArray.length} common languages have been added.`,
        });
      } else {
        toast({
          title: "No Languages Generated",
          description: "Could not parse languages from AI response. Please try adding languages manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating languages:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate languages. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingLanguages(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormLabel>Languages</FormLabel>
          <div className="flex flex-col space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a language (e.g., English, Spanish)"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" size="icon" variant="outline" onClick={handleAddLanguage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full gap-1"
              onClick={generateCommonLanguages}
              disabled={isGeneratingLanguages}
            >
              <Sparkles className="h-4 w-4" />
              {isGeneratingLanguages ? "Generating..." : "Add Common Languages"}
            </Button>

            {form.formState.errors.languages?.message && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.languages.message}</p>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            {watchLanguages?.length > 0 ? (
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground mb-2">Select proficiency level for each language:</p>
                <ul className="space-y-2">
                  {watchLanguages.map((language, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex-1 mr-2">{language.name}</div>
                      <div className="flex items-center">
                        <Select
                          value={language.proficiency}
                          onValueChange={(value: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic") => 
                            handleUpdateLanguageProficiency(index, value)
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Proficiency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Native">Native</SelectItem>
                            <SelectItem value="Fluent">Fluent</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Basic">Basic</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveLanguage(index)}
                          className="ml-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md border-dashed">
                <p className="text-muted-foreground">No languages added yet. Add languages above or use the common languages feature.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Languages' : 'Add Languages'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LanguagesForm;
