
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Sparkles,
  Download,
  Save
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  title: z.string().min(2, { message: "Job title is required" }),
  summary: z.string().min(10, { message: "Summary should be at least 10 characters" }),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal-info');
  const [aiLoading, setAiLoading] = useState(false);
  
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
    },
  });

  const handleAIGenerate = () => {
    setAiLoading(true);
    
    // Simulate AI generation
    setTimeout(() => {
      form.setValue('summary', 'Dedicated and versatile software engineer with 5+ years of experience in developing robust applications. Proficient in JavaScript, React, and Node.js with a strong foundation in algorithms and data structures. Passionate about creating efficient, scalable solutions that address complex business challenges.');
      setAiLoading(false);
      
      toast({
        title: "Summary Generated",
        description: "AI has created a professional summary based on your profile.",
      });
    }, 2000);
  };

  const onSubmit = (data: PersonalInfoValues) => {
    toast({
      title: "Information Saved",
      description: "Your personal information has been saved successfully.",
    });
    setActiveTab('experience');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <p className="text-muted-foreground mt-1">Create your professional resume with AI assistance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-muted rounded-lg overflow-hidden">
              <div className="p-6 bg-primary text-primary-foreground">
                <h2 className="text-2xl font-semibold">Resume Sections</h2>
                <p className="text-primary-foreground/80 mt-1">Complete each section to build your resume</p>
              </div>
              
              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Button 
                      variant={activeTab === 'personal-info' ? "default" : "ghost"} 
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveTab('personal-info')}
                    >
                      <User className="h-5 w-5" />
                      Personal Information
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeTab === 'experience' ? "default" : "ghost"} 
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveTab('experience')}
                    >
                      <Briefcase className="h-5 w-5" />
                      Work Experience
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeTab === 'education' ? "default" : "ghost"} 
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveTab('education')}
                    >
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeTab === 'skills' ? "default" : "ghost"} 
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveTab('skills')}
                    >
                      <Award className="h-5 w-5" />
                      Skills
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeTab === 'languages' ? "default" : "ghost"} 
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveTab('languages')}
                    >
                      <Languages className="h-5 w-5" />
                      Languages
                    </Button>
                  </li>
                </ul>
              </div>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Let AI help you create professional content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Our AI assistant can help you write professional content for your resume sections based on your input.</p>
                <Button 
                  onClick={handleAIGenerate} 
                  className="w-full"
                  disabled={aiLoading}
                >
                  {aiLoading ? "Generating..." : "Generate Professional Summary"}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {activeTab === 'personal-info' && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Provide your contact and basic information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 123 456 7890" {...field} />
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
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="New York, NY, USA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Senior Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="summary"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Professional Summary</FormLabel>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary text-xs gap-1"
                                onClick={handleAIGenerate}
                                disabled={aiLoading}
                              >
                                <Sparkles className="h-3 w-3" />
                                {aiLoading ? "Generating..." : "Generate with AI"}
                              </Button>
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="Write a professional summary highlighting your expertise and career goals..." 
                                className="min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button type="submit">
                          Save & Continue
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'experience' && (
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Add your professional work experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No work experience added yet</h3>
                    <p className="text-muted-foreground mb-6">Add your work history to enhance your resume</p>
                    <Button className="gap-2">
                      <Briefcase className="h-4 w-4" />
                      Add Work Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'education' && (
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Add your educational background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No education added yet</h3>
                    <p className="text-muted-foreground mb-6">Add your educational background to showcase your qualifications</p>
                    <Button className="gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Add Education
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'skills' && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Add your technical and soft skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No skills added yet</h3>
                    <p className="text-muted-foreground mb-6">Add your skills to showcase your expertise</p>
                    <Button className="gap-2">
                      <Award className="h-4 w-4" />
                      Add Skills
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'languages' && (
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                  <CardDescription>Add languages you speak</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Languages className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No languages added yet</h3>
                    <p className="text-muted-foreground mb-6">Add languages to showcase your communication skills</p>
                    <Button className="gap-2">
                      <Languages className="h-4 w-4" />
                      Add Languages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
