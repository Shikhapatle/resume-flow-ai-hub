
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb } from 'lucide-react';
import { generateRecommendation } from '@/utils/aiRecommendations';

const ProfileSummary = () => {
  const [personalSummary, setPersonalSummary] = useState<string>("");
  const [workSummary, setWorkSummary] = useState<string>("");
  const [educationSummary, setEducationSummary] = useState<string>("");
  const [skillsSummary, setSkillsSummary] = useState<string>("");

  useEffect(() => {
    const generateSummaries = async () => {
      try {
        const personalQuery = "summary of a software professional's personal profile";
        const workQuery = "summary of relevant work experience in tech";
        const educationQuery = "summary of educational background";
        const skillsQuery = "summary of technical and soft skills";

        const [personal, work, education, skills] = await Promise.all([
          generateRecommendation({ query: personalQuery }),
          generateRecommendation({ query: workQuery }),
          generateRecommendation({ query: educationQuery }),
          generateRecommendation({ query: skillsQuery })
        ]);

        setPersonalSummary(personal);
        setWorkSummary(work);
        setEducationSummary(education);
        setSkillsSummary(skills);
      } catch (error) {
        console.error('Error generating summaries:', error);
      }
    };

    generateSummaries();
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI-Generated Profile Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Personal Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <p className="text-sm text-muted-foreground">{personalSummary}</p>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <p className="text-sm text-muted-foreground">{workSummary}</p>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Education</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <p className="text-sm text-muted-foreground">{educationSummary}</p>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Skills Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <p className="text-sm text-muted-foreground">{skillsSummary}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
