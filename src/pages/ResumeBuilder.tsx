import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Save,
  Plus,
  Eye,
  CheckCircle
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import WorkExperienceForm, { WorkExperienceFormValues } from '@/components/WorkExperienceForm';
import WorkExperienceItem from '@/components/WorkExperienceItem';
import EducationForm, { EducationFormValues } from '@/components/EducationForm';
import EducationItem from '@/components/EducationItem';
import SkillsForm, { SkillFormValues } from '@/components/SkillsForm';
import SkillsItem from '@/components/SkillsItem';
import LanguagesForm, { LanguageFormValues } from '@/components/LanguagesForm';
import LanguagesItem from '@/components/LanguagesItem';
import ResumeScorecard from '@/components/ResumeScorecard';
import { 
  generateRecommendation, 
  generateResumeSummary 
} from '@/utils/aiRecommendations';
import { 
  saveResumeDraft, 
  loadResumeDraft, 
  downloadResumePDF, 
  generateResumePDF 
} from '@/utils/pdfGenerator';

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  title: z.string().min(2, { message: "Job title is required" }),
  summary: z.string().min(10, { message: "Summary should be at least 10 characters" }),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

type ResumeData = {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  workExperiences: {
    description: string;
    location: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
  }[];
  education: {
    description: string;
    location: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    currentlyStudying: boolean;
    gpa: string;
  }[];
  skills: {
    category: string;
    skills: {
      name: string;
      level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    }[];
  }[];
  languages: {
    name: string;
    proficiency: "Basic" | "Fluent" | "Intermediate" | "Advanced" | "Native";
  }[];
};

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal-info');
  const [aiLoading, setAiLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // Work Experience state
  const [isWorkExpDialogOpen, setIsWorkExpDialogOpen] = useState(false);
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceFormValues[]>([]);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  
  // Education state
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [educations, setEducations] = useState<EducationFormValues[]>([]);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  
  // Skills state
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
  const [skillsGroups, setSkillsGroups] = useState<SkillFormValues[]>([]);
  const [editingSkillsIndex, setEditingSkillsIndex] = useState<number | null>(null);
  
  // Languages state
  const [isLanguagesDialogOpen, setIsLanguagesDialogOpen] = useState(false);
  const [languagesList, setLanguagesList] = useState<LanguageFormValues[]>([]);
  const [editingLanguagesIndex, setEditingLanguagesIndex] = useState<number | null>(null);
  
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

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = loadResumeDraft();
    if (savedDraft) {
      // Update personal info form
      if (savedDraft.personalInfo) {
        form.reset(savedDraft.personalInfo);
      }
      
      // Update work experiences
      if (savedDraft.workExperiences) {
        setWorkExperiences(savedDraft.workExperiences);
      }
      
      // Update education
      if (savedDraft.education) {
        setEducations(savedDraft.education);
      }
      
      // Update skills
      if (savedDraft.skills) {
        setSkillsGroups(savedDraft.skills);
      }
      
      // Update languages
      if (savedDraft.languages) {
        setLanguagesList(savedDraft.languages);
      }
      
      toast({
        title: "Draft Loaded",
        description: "Your previously saved resume draft has been loaded.",
      });
    }
  }, []);

  const handleAIGenerate = async () => {
    setAiLoading(true);
    
    try {
      const name = form.getValues('name');
      const title = form.getValues('title');
      const context = `Name: ${name || 'Professional'}, Job Title: ${title || 'Software Developer'}`;
      
      const summary = await generateRecommendation({
        query: "professional resume summary",
        context,
        maxLength: 300
      });
      
      form.setValue('summary', summary);
      
      toast({
        title: "Summary Generated",
        description: "AI has created a professional summary based on your profile.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate summary. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateFullSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryLoading(true);
    
    try {
      const resumeData = getResumeData();
      
      const summary = await generateResumeSummary(resumeData);
      
      form.setValue('summary', summary);
      
      toast({
        title: "Executive Summary Generated",
        description: "AI has analyzed your entire resume and created a comprehensive executive summary.",
      });
    } catch (error) {
      console.error("Error generating executive summary:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate executive summary. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSummaryLoading(false);
      setIsGeneratingSummary(false);
    }
  };

  const handleSaveDraft = () => {
    const resumeData = getResumeData();
    saveResumeDraft(resumeData);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const handleDownloadPDF = async () => {
    const resumeData = getResumeData();
    await downloadResumePDF(resumeData);
  };

  const handlePreviewPDF = async () => {
    const resumeData = getResumeData();
    const pdfUrl = await generateResumePDF(resumeData);
    
    if (pdfUrl) {
      setPdfPreviewUrl(pdfUrl);
      setIsPdfPreviewOpen(true);
    }
  };

  const onSubmit = (data: PersonalInfoValues) => {
    toast({
      title: "Information Saved",
      description: "Your personal information has been saved successfully.",
    });
    handleSaveDraft();
    setActiveTab('experience');
  };

  // Work Experience handlers
  const handleAddWorkExperience = (data: WorkExperienceFormValues) => {
    if (editingExperienceIndex !== null) {
      // Update existing experience
      const updatedExperiences = [...workExperiences];
      updatedExperiences[editingExperienceIndex] = data;
      setWorkExperiences(updatedExperiences);
      toast({
        title: "Experience Updated",
        description: "Your work experience has been updated successfully.",
      });
    } else {
      // Add new experience
      setWorkExperiences([...workExperiences, data]);
      toast({
        title: "Experience Added",
        description: "Your work experience has been added successfully.",
      });
    }
    setIsWorkExpDialogOpen(false);
    setEditingExperienceIndex(null);
  };

  const handleEditExperience = (index: number) => {
    setEditingExperienceIndex(index);
    setIsWorkExpDialogOpen(true);
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperiences = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(updatedExperiences);
    toast({
      title: "Experience Deleted",
      description: "Your work experience has been deleted successfully.",
    });
  };

  const handleCancelWorkExpForm = () => {
    setIsWorkExpDialogOpen(false);
    setEditingExperienceIndex(null);
  };

  // Education handlers
  const handleAddEducation = (data: EducationFormValues) => {
    if (editingEducationIndex !== null) {
      // Update existing education
      const updatedEducations = [...educations];
      updatedEducations[editingEducationIndex] = data;
      setEducations(updatedEducations);
      toast({
        title: "Education Updated",
        description: "Your education has been updated successfully.",
      });
    } else {
      // Add new education
      setEducations([...educations, data]);
      toast({
        title: "Education Added",
        description: "Your education has been added successfully.",
      });
    }
    setIsEducationDialogOpen(false);
    setEditingEducationIndex(null);
  };

  const handleEditEducation = (index: number) => {
    setEditingEducationIndex(index);
    setIsEducationDialogOpen(true);
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
    toast({
      title: "Education Deleted",
      description: "Your education has been deleted successfully.",
    });
  };

  const handleCancelEducationForm = () => {
    setIsEducationDialogOpen(false);
    setEditingEducationIndex(null);
  };

  // Skills handlers
  const handleAddSkills = (data: SkillFormValues) => {
    if (editingSkillsIndex !== null) {
      // Update existing skills
      const updatedSkillsGroups = [...skillsGroups];
      updatedSkillsGroups[editingSkillsIndex] = data;
      setSkillsGroups(updatedSkillsGroups);
      toast({
        title: "Skills Updated",
        description: "Your skills have been updated successfully.",
      });
    } else {
      // Add new skills
      setSkillsGroups([...skillsGroups, data]);
      toast({
        title: "Skills Added",
        description: "Your skills have been added successfully.",
      });
    }
    setIsSkillsDialogOpen(false);
    setEditingSkillsIndex(null);
  };

  const handleEditSkills = (index: number) => {
    setEditingSkillsIndex(index);
    setIsSkillsDialogOpen(true);
  };

  const handleDeleteSkills = (index: number) => {
    const updatedSkillsGroups = skillsGroups.filter((_, i) => i !== index);
    setSkillsGroups(updatedSkillsGroups);
    toast({
      title: "Skills Deleted",
      description: "Your skills have been deleted successfully.",
    });
  };

  const handleCancelSkillsForm = () => {
    setIsSkillsDialogOpen(false);
    setEditingSkillsIndex(null);
  };

  // Languages handlers
  const handleAddLanguages = (data: LanguageFormValues) => {
    if (editingLanguagesIndex !== null) {
      // Update existing languages
      const updatedLanguagesList = [...languagesList];
      updatedLanguagesList[editingLanguagesIndex] = data;
      setLanguagesList(updatedLanguagesList);
      toast({
        title: "Languages Updated",
        description: "Your languages have been updated successfully.",
      });
    } else {
      // Add new languages
      setLanguagesList([...languagesList, data]);
      toast({
        title: "Languages Added",
        description: "Your languages have been added successfully.",
      });
    }
    setIsLanguagesDialogOpen(false);
    setEditingLanguagesIndex(null);
  };

  const handleEditLanguages = (index: number) => {
    setEditingLanguagesIndex(index);
    setIsLanguagesDialogOpen(true);
  };

  const handleDeleteLanguages = (index: number) => {
    const updatedLanguagesList = languagesList.filter((_, i) => i !== index);
    setLanguagesList(updatedLanguagesList);
    toast({
      title: "Languages Deleted",
      description: "Your languages have been deleted successfully.",
    });
  };

  const handleCancelLanguagesForm = () => {
    setIsLanguagesDialogOpen(false);
    setEditingLanguagesIndex(null);
  };

  // Assemble resume data for AI analysis and PDF generation
  const getResumeData = (): ResumeData => {
    return {
      personalInfo: {
        name: form.getValues('name') || '',
        email: form.getValues('email') || '',
        phone: form.getValues('phone') || '',
        location: form.getValues('location') || '',
        title: form.getValues('title') || '',
        summary: form.getValues('summary') || '',
      },
      workExperiences: workExperiences.map(exp => ({
        description: exp.description || '',
        location: exp.location || '',
        jobTitle: exp.position || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        currentlyWorking: exp.current || false,
      })),
      education: educations.map(edu => ({
        description: edu.description || '',
        location: edu.location || '',
        institution: edu.institution || '',
        degree: edu.degree || '',
        fieldOfStudy: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        currentlyStudying: edu.current || false,
        gpa: edu.gpa || '',
      })),
      skills: skillsGroups.map(group => ({
        category: group.category || '',
        skills: group.skills.map(skill => ({
          name: skill.name || '',
          level: skill.level as "Beginner" | "Intermediate" | "Advanced" | "Expert",
        })),
      })),
      languages: languagesList.map(lang => ({
        name: lang.name || '',
        proficiency: lang.proficiency as "Basic" | "Fluent" | "Intermediate" | "Advanced" | "Native",
      })),
    };
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
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2" onClick={handleSaveDraft}>
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="space-y-4">
                  <h4 className="font-medium">Resume PDF Options</h4>
                  <div className="grid gap-2">
                    <Button onClick={handlePreviewPDF} variant="outline" className="gap-2 w-full">
                      <Eye className="h-4 w-4" /> Preview PDF
                    </Button>
                    <Button onClick={handleDownloadPDF} className="gap-2 w-full">
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {lastSaved && (
              <div className="flex items-center text-sm text-muted-foreground ml-2">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span>Last saved: {lastSaved}</span>
              </div>
            )}
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

            <ResumeScorecard resumeData={getResumeData()} />

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
                <div className="space-y-3">
                  <Button 
                    onClick={handleAIGenerate} 
                    className="w-full"
                    disabled={aiLoading}
                  >
                    {aiLoading ? "Generating..." : "Generate Summary"}
                  </Button>
                  
                  <Button 
                    onClick={handleGenerateFullSummary} 
                    variant="outline"
                    className="w-full"
                    disabled={summaryLoading || workExperiences.length === 0}
                  >
                    {summaryLoading ? "Analyzing resume..." : "Generate Executive Summary"}
                  </Button>
                  
                  {workExperiences.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Add work experience to enable executive summary generation
                    </p>
                  )}
                </div>
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
                              <div className="flex gap-2">
                                {isGeneratingSummary ? (
                                  <Badge variant="success" className="text-xs gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    AI Analyzing Resume...
                                  </Badge>
                                ) : null}
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
                  {workExperiences.length > 0 ? (
                    <div className="space-y-4">
                      {workExperiences.map((experience, index) => (
                        <WorkExperienceItem 
                          key={index}
                          experience={experience}
                          onEdit={() => handleEditExperience(index)}
                          onDelete={() => handleDeleteExperience(index)}
                        />
                      ))}
                      <div className="flex justify-center mt-6">
                        <Button 
                          onClick={() => setIsWorkExpDialogOpen(true)}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Experience
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No work experience added yet</h3>
                      <p className="text-muted-foreground mb-6">Add your work history to enhance your resume</p>
                      <Button 
                        className="gap-2"
                        onClick={() => setIsWorkExpDialogOpen(true)}
                      >
                        <Briefcase className="h-4 w-4" />
                        Add Work Experience
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end pt-0">
                  <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Progress
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === 'education' && (
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Add your educational background</CardDescription>
                </CardHeader>
                <CardContent>
                  {educations.length > 0 ? (
                    <div className="space-y-4">
                      {educations.map((education, index) => (
                        <EducationItem 
                          key={index}
                          education={education}
                          onEdit={() => handleEditEducation(index)}
                          onDelete={() => handleDeleteEducation(index)}
                        />
                      ))}
                      <div className="flex justify-center mt-6">
                        <Button 
                          onClick={() => setIsEducationDialogOpen(true)}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Education
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No education added yet</h3>
                      <p className="text-muted-foreground mb-6">Add your educational background to showcase your qualifications</p>
                      <Button 
                        className="gap-2"
                        onClick={() => setIsEducationDialogOpen(true)}
                      >
                        <GraduationCap className="h-4 w-4" />
                        Add Education
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end pt-0">
                  <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Progress
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === 'skills' && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Add your technical and soft skills</CardDescription>
                </CardHeader>
                <CardContent>
                  {skillsGroups.length > 0 ? (
                    <div className="space-y-4">
                      {skillsGroups.map((skillsGroup, index) => (
                        <SkillsItem 
                          key={index}
                          skillsGroup={skillsGroup}
                          onEdit={() => handleEditSkills(index)}
                          onDelete={() => handleDeleteSkills(index)}
                        />
                      ))}
                      <div className="flex justify-center mt-6">
                        <Button 
                          onClick={() => setIsSkillsDialogOpen(true)}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Skills Group
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No skills added yet</h3>
                      <p className="text-muted-foreground mb-6">Add your skills to showcase your expertise</p>
                      <Button 
                        className="gap-2"
                        onClick={() => setIsSkillsDialogOpen(true)}
                      >
                        <Award className="h-4 w-4" />
                        Add Skills
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end pt-0">
                  <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Progress
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === 'languages' && (
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                  <CardDescription>Add languages you speak</CardDescription>
                </CardHeader>
                <CardContent>
                  {languagesList.length > 0 ? (
                    <div className="space-y-4">
                      {languagesList.map((languages, index) => (
                        <LanguagesItem 
                          key={index}
                          languages={languages}
                          onEdit={() => handleEditLanguages(index)}
                          onDelete={() => handleDeleteLanguages(index)}
                        />
                      ))}
                      <div className="flex justify-center mt-6">
                        <Button 
                          onClick={() => setIsLanguagesDialogOpen(true)}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Update Languages
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Languages className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No languages added yet</h3>
                      <p className="text-muted-foreground mb-6">Add languages to showcase your communication skills</p>
                      <Button 
                        className="gap-2"
                        onClick={() => setIsLanguagesDialogOpen(true)}
                      >
                        <Languages className="h-4 w-4" />
                        Add Languages
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end pt-0">
                  <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Progress
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Work Experience Dialog */}
      <Dialog open={isWorkExpDialogOpen} onOpenChange={setIsWorkExpDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExperienceIndex !== null ? 'Edit Work Experience' : 'Add Work Experience'}</DialogTitle>
            <DialogDescription>
              Add details about your work history, responsibilities, and achievements.
            </DialogDescription>
          </DialogHeader>
          <WorkExperienceForm 
            onSubmit={handleAddWorkExperience}
            onCancel={handleCancelWorkExpForm}
            defaultValues={editingExperienceIndex !== null ? workExperiences[editingExperienceIndex] : undefined}
            isEdit={editingExperienceIndex !== null}
          />
        </DialogContent>
      </Dialog>

      {/* Education Dialog */}
      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEducationIndex !== null ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription>
              Add details about your educational background.
            </DialogDescription>
          </DialogHeader>
          <EducationForm 
            onSubmit={handleAddEducation}
            onCancel={handleCancelEducationForm}
            defaultValues={editingEducationIndex !== null ? educations[editingEducationIndex] : undefined}
            isEdit={editingEducationIndex !== null}
          />
        </DialogContent>
      </Dialog>

      {/* Skills Dialog */}
      <Dialog open={isSkillsDialogOpen} onOpenChange={setIsSkillsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSkillsIndex !== null ? 'Edit Skills' : 'Add Skills'}</DialogTitle>
            <DialogDescription>
              Add your technical and soft skills with proficiency levels.
            </DialogDescription>
          </DialogHeader>
          <SkillsForm 
            onSubmit={handleAddSkills}
            onCancel={handleCancelSkillsForm}
            defaultValues={editingSkillsIndex !== null ? skillsGroups[editingSkillsIndex] : undefined}
            isEdit={editingSkillsIndex !== null}
          />
        </DialogContent>
      </Dialog>

      {/* Languages Dialog */}
      <Dialog open={isLanguagesDialogOpen} onOpenChange={setIsLanguagesDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLanguagesIndex !== null ? 'Edit Languages' : 'Add Languages'}</DialogTitle>
            <DialogDescription>
              Add languages you speak with proficiency levels.
            </DialogDescription>
          </DialogHeader>
          <LanguagesForm 
            onSubmit={handleAddLanguages}
            onCancel={handleCancelLanguagesForm}
            defaultValues={editingLanguagesIndex !== null ? languagesList[editingLanguagesIndex] : undefined}
            isEdit={editingLanguagesIndex !== null}
          />
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={isPdfPreviewOpen} onOpenChange={setIsPdfPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Resume PDF Preview</DialogTitle>
          </DialogHeader>
          {pdfPreviewUrl && (
            <div className="w-full h-[80vh]">
              <iframe 
                src={pdfPreviewUrl} 
                className="w-full h-full" 
                title="Resume PDF preview"
              />
            </div>
          )}
          <div className="p-4 bg-background border-t flex justify-between">
            <Button variant="outline" onClick={() => setIsPdfPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeBuilder;
