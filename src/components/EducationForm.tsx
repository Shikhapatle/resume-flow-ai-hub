
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Sparkles } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { generateRecommendation } from '@/utils/aiRecommendations';
import { useToast } from '@/components/ui/use-toast';

const educationFormSchema = z.object({
  institution: z.string().min(2, { message: "Institution name is required" }),
  degree: z.string().min(2, { message: "Degree is required" }),
  fieldOfStudy: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional().nullable(),
  currentlyStudying: z.boolean().default(false),
  description: z.string().optional(),
  gpa: z.string().optional(),
});

export type EducationFormValues = z.infer<typeof educationFormSchema>;

interface EducationFormProps {
  onSubmit: (data: EducationFormValues) => void;
  onCancel: () => void;
  defaultValues?: EducationFormValues;
  isEdit?: boolean;
}

const EducationForm: React.FC<EducationFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false
}) => {
  const { toast } = useToast();
  const [isGeneratingDescription, setIsGeneratingDescription] = React.useState(false);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: defaultValues || {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: new Date(),
      endDate: null,
      currentlyStudying: false,
      description: '',
      gpa: '',
    },
  });

  const watchCurrentlyStudying = form.watch('currentlyStudying');
  const watchInstitution = form.watch('institution');
  const watchDegree = form.watch('degree');
  const watchFieldOfStudy = form.watch('fieldOfStudy');

  const handleGenerateDescription = async () => {
    if (!watchInstitution || !watchDegree) {
      toast({
        title: "Missing Information",
        description: "Please fill in the institution and degree fields first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const context = `Institution: ${watchInstitution}, Degree: ${watchDegree}${watchFieldOfStudy ? `, Field of Study: ${watchFieldOfStudy}` : ''}`;
      
      const description = await generateRecommendation({
        query: "education description for a resume",
        context,
        maxLength: 300
      });
      
      form.setValue('description', description);
      toast({
        title: "Description Generated",
        description: "AI has created an education description based on your inputs.",
      });
    } catch (error) {
      console.error("Error generating description:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate description. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input placeholder="University or School Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location <span className="text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="City, State, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Input placeholder="Bachelor's, Master's, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fieldOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field of Study <span className="text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science, Business, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {!watchCurrentlyStudying && (
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MMM yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="currentlyStudying"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I am currently studying here
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gpa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GPA <span className="text-muted-foreground">(Optional)</span></FormLabel>
              <FormControl>
                <Input placeholder="3.8/4.0, 4.0, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Description <span className="text-muted-foreground">(Optional)</span></FormLabel>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary text-xs gap-1"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription}
                >
                  <Sparkles className="h-3 w-3" />
                  {isGeneratingDescription ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <FormControl>
                <Textarea 
                  placeholder="Describe your studies, achievements, projects, etc." 
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Education' : 'Add Education'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EducationForm;
