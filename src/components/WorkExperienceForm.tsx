
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Briefcase, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

const workExperienceSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title must be at least 2 characters" }),
  company: z.string().min(2, { message: "Company name is required" }),
  location: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional().nullable(),
  currentlyWorking: z.boolean().default(false),
  description: z.string().min(10, { message: "Description should be at least 10 characters" }),
});

export type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;

interface WorkExperienceFormProps {
  onSubmit: (data: WorkExperienceFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<WorkExperienceFormValues>;
  isEdit?: boolean;
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false
}) => {
  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      jobTitle: defaultValues?.jobTitle || '',
      company: defaultValues?.company || '',
      location: defaultValues?.location || '',
      startDate: defaultValues?.startDate || new Date(),
      endDate: defaultValues?.endDate || null,
      currentlyWorking: defaultValues?.currentlyWorking || false,
      description: defaultValues?.description || '',
    },
  });

  const handleGenerateDescription = () => {
    const jobTitle = form.getValues('jobTitle');
    const company = form.getValues('company');
    
    // Simulate AI generation of job description
    setTimeout(() => {
      form.setValue('description', 
        `As a ${jobTitle} at ${company}, I was responsible for developing and maintaining software applications. I collaborated with cross-functional teams to deliver high-quality solutions that met business requirements and enhanced user experience.`
      );
    }, 1000);
  };

  const watchCurrentlyWorking = form.watch('currentlyWorking');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="New York, NY (Remote)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                          <span>Select date</span>
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
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="currentlyWorking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <FormLabel className="font-normal">I currently work here</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {!watchCurrentlyWorking && (
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
                          <span>Select date</span>
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
                      disabled={(date) => {
                        const startDate = form.getValues('startDate');
                        return date < startDate;
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Job Description</FormLabel>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary text-xs gap-1"
                  onClick={handleGenerateDescription}
                >
                  <Sparkles className="h-3 w-3" />
                  Generate with AI
                </Button>
              </div>
              <FormControl>
                <Textarea 
                  placeholder="Describe your responsibilities, achievements, and skills utilized in this role..." 
                  className="min-h-32"
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
            {isEdit ? 'Update Experience' : 'Add Experience'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkExperienceForm;
