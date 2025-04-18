
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Edit } from "lucide-react";
import { generateResumePDF, downloadResumePDF } from "@/utils/pdfGenerator";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateResumeSummary } from "@/utils/aiRecommendations";

const ResumeViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleViewResume = async () => {
    setLoading(true);
    try {
      // This is a placeholder resume data - in a real app, you'd fetch this from your backend
      const resumeData = {
        personalInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "(555) 123-4567",
          location: "San Francisco, CA",
          title: "Senior Frontend Developer",
          summary: await generateResumeSummary({
            name: "John Doe",
            title: "Senior Frontend Developer",
            experience: "5 years"
          })
        },
        workExperiences: [
          {
            jobTitle: "Senior Frontend Developer",
            company: "Tech Corp",
            location: "San Francisco, CA",
            startDate: "2021",
            endDate: "Present",
            currentlyWorking: true,
            description: "Lead frontend development for multiple projects"
          }
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor's",
            fieldOfStudy: "Computer Science",
            startDate: "2015",
            endDate: "2019",
            currentlyStudying: false
          }
        ],
        skills: [
          {
            category: "Frontend",
            skills: [
              { name: "React", level: "Expert" },
              { name: "TypeScript", level: "Advanced" }
            ]
          }
        ],
        languages: [
          { name: "English", proficiency: "Native" },
          { name: "Spanish", proficiency: "Intermediate" }
        ]
      };

      const url = await generateResumePDF(resumeData);
      if (url) {
        setPdfUrl(url);
        toast({
          title: "Resume Generated",
          description: "Your resume has been generated successfully"
        });
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Your Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleViewResume}
            disabled={loading}
          >
            <FileText className="h-4 w-4" />
            View Resume
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => downloadResumePDF({
              personalInfo: {
                name: "John Doe",
                email: "john@example.com",
                phone: "(555) 123-4567",
                location: "San Francisco, CA",
                title: "Senior Frontend Developer",
                summary: "Experienced frontend developer..."
              },
              workExperiences: [],
              education: [],
              skills: [],
              languages: []
            })}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button className="gap-2" onClick={() => window.location.href = '/resume-builder'}>
            <Edit className="h-4 w-4" />
            Edit Resume
          </Button>
        </div>
        
        {pdfUrl && (
          <div className="mt-4 border rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Resume Preview"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeViewer;
