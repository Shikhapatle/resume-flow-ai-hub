
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

const skillsFormSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, { message: "Skill name is required" }),
    level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
  })).min(1, { message: "At least one skill is required" }),
  category: z.string().min(1, { message: "Category is required" }),
});

export type SkillFormValues = z.infer<typeof skillsFormSchema>;

interface SkillsFormProps {
  onSubmit: (data: SkillFormValues) => void;
  onCancel: () => void;
  defaultValues?: SkillFormValues;
  isEdit?: boolean;
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false
}) => {
  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState('');
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [jobTitle, setJobTitle] = useState('');

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: defaultValues || {
      skills: [],
      category: '',
    },
  });

  const watchSkills = form.watch('skills');
  const watchCategory = form.watch('category');

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const updatedSkills = [...(watchSkills || []), { name: skillInput.trim(), level: "Intermediate" }];
      form.setValue('skills', updatedSkills);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...watchSkills];
    updatedSkills.splice(index, 1);
    form.setValue('skills', updatedSkills);
  };

  const handleUpdateSkillLevel = (index: number, level: "Beginner" | "Intermediate" | "Advanced" | "Expert") => {
    const updatedSkills = [...watchSkills];
    updatedSkills[index] = { ...updatedSkills[index], level };
    form.setValue('skills', updatedSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const generateSkills = async () => {
    if (!watchCategory && !jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please enter a skill category or job title to generate relevant skills.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingSkills(true);
    try {
      const context = `${watchCategory ? `Skill category: ${watchCategory}` : ''}${jobTitle ? `, Job title: ${jobTitle}` : ''}`;
      
      const recommendations = await generateRecommendation({
        query: "list of 5-8 professional skills for a resume separated by commas",
        context,
        maxLength: 300
      });
      
      // Parse comma-separated skills
      const skillsArray = recommendations
        .split(/,|\n/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0 && skill.length < 50) // Basic validation
        .map(name => ({ name, level: "Intermediate" as const }));
      
      if (skillsArray.length > 0) {
        form.setValue('skills', [...watchSkills, ...skillsArray]);
        toast({
          title: "Skills Generated",
          description: `${skillsArray.length} skills have been added based on ${watchCategory || jobTitle}.`,
        });
      } else {
        toast({
          title: "No Skills Generated",
          description: "Could not parse skills from AI response. Please try adding skills manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating skills:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate skills. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Category</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Analysis">Analysis</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Skills</FormLabel>
          <div className="flex flex-col space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., JavaScript, Project Management)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" size="icon" variant="outline" onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Optional: Enter job title for skill suggestions"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="whitespace-nowrap gap-1"
                onClick={generateSkills}
                disabled={isGeneratingSkills}
              >
                <Sparkles className="h-4 w-4" />
                {isGeneratingSkills ? "Generating..." : "Suggest Skills"}
              </Button>
            </div>

            {form.formState.errors.skills?.message && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.skills.message}</p>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            {watchSkills?.length > 0 ? (
              <div className="border rounded-md p-4">
                <p className="text-sm text-muted-foreground mb-2">Select proficiency level for each skill:</p>
                <ul className="space-y-2">
                  {watchSkills.map((skill, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex-1 mr-2">{skill.name}</div>
                      <div className="flex items-center">
                        <Select
                          value={skill.level}
                          onValueChange={(value) => handleUpdateSkillLevel(index, value as any)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveSkill(index)}
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
                <p className="text-muted-foreground">No skills added yet. Add skills above or use the suggestion feature.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Skills' : 'Add Skills'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SkillsForm;
