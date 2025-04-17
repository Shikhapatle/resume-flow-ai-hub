
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/use-toast';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  workExperiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description?: string;
  }>;
  skills: Array<{
    category: string;
    skills: Array<{
      name: string;
      level: string;
    }>;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
}

// Function to generate resume preview component
const ResumePreview = (data: ResumeData): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'resume-preview bg-white p-8 w-[816px] min-h-[1054px] text-gray-800';
  container.style.fontFamily = 'Arial, sans-serif';
  
  // Header
  const header = document.createElement('div');
  header.className = 'mb-6 border-b pb-6';
  header.innerHTML = `
    <h1 class="text-3xl font-bold text-gray-900">${data.personalInfo.name || 'Your Name'}</h1>
    <h2 class="text-xl text-primary mt-1">${data.personalInfo.title || 'Professional Title'}</h2>
    <div class="flex flex-wrap gap-4 mt-3 text-sm">
      ${data.personalInfo.email ? `<div>${data.personalInfo.email}</div>` : ''}
      ${data.personalInfo.phone ? `<div>${data.personalInfo.phone}</div>` : ''}
      ${data.personalInfo.location ? `<div>${data.personalInfo.location}</div>` : ''}
    </div>
  `;
  container.appendChild(header);
  
  // Summary
  if (data.personalInfo.summary) {
    const summary = document.createElement('div');
    summary.className = 'mb-6';
    summary.innerHTML = `
      <h3 class="text-lg font-semibold mb-2 text-gray-900">Professional Summary</h3>
      <p class="text-sm">${data.personalInfo.summary}</p>
    `;
    container.appendChild(summary);
  }
  
  // Work Experience
  if (data.workExperiences && data.workExperiences.length > 0) {
    const experience = document.createElement('div');
    experience.className = 'mb-6';
    experience.innerHTML = `
      <h3 class="text-lg font-semibold mb-3 text-gray-900">Work Experience</h3>
      <div class="space-y-4">
        ${data.workExperiences.map(job => `
          <div class="ml-1">
            <div class="flex justify-between">
              <h4 class="font-semibold text-sm">${job.position}</h4>
              <span class="text-xs text-gray-600">
                ${job.startDate} - ${job.current ? 'Present' : job.endDate}
              </span>
            </div>
            <div class="text-sm text-primary font-medium">${job.company}</div>
            <p class="text-xs mt-1">${job.description}</p>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(experience);
  }
  
  // Education
  if (data.education && data.education.length > 0) {
    const education = document.createElement('div');
    education.className = 'mb-6';
    education.innerHTML = `
      <h3 class="text-lg font-semibold mb-3 text-gray-900">Education</h3>
      <div class="space-y-4">
        ${data.education.map(edu => `
          <div class="ml-1">
            <div class="flex justify-between">
              <h4 class="font-semibold text-sm">${edu.degree} ${edu.field ? `in ${edu.field}` : ''}</h4>
              <span class="text-xs text-gray-600">
                ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}
              </span>
            </div>
            <div class="text-sm text-primary font-medium">${edu.institution}</div>
            ${edu.description ? `<p class="text-xs mt-1">${edu.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(education);
  }
  
  // Skills
  if (data.skills && data.skills.length > 0) {
    const skills = document.createElement('div');
    skills.className = 'mb-6';
    skills.innerHTML = `
      <h3 class="text-lg font-semibold mb-3 text-gray-900">Skills</h3>
      <div class="space-y-3">
        ${data.skills.map(skillGroup => `
          <div>
            <h4 class="font-medium text-sm mb-1">${skillGroup.category}</h4>
            <div class="flex flex-wrap gap-2">
              ${skillGroup.skills.map(skill => `
                <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">${skill.name} ${skill.level ? `(${skill.level})` : ''}</span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(skills);
  }
  
  // Languages
  if (data.languages && data.languages.length > 0) {
    const languages = document.createElement('div');
    languages.className = 'mb-6';
    languages.innerHTML = `
      <h3 class="text-lg font-semibold mb-3 text-gray-900">Languages</h3>
      <div class="flex flex-wrap gap-3">
        ${data.languages.map(lang => `
          <div class="text-xs px-3 py-1 bg-gray-100 rounded-full">
            ${lang.name} ${lang.proficiency ? `(${lang.proficiency})` : ''}
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(languages);
  }
  
  return container;
}

// Function to generate and download PDF
export const generateResumePDF = async (resumeData: ResumeData): Promise<string | null> => {
  try {
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);
    
    // Generate the resume preview
    const resumePreview = ResumePreview(resumeData);
    container.appendChild(resumePreview);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate canvas from the preview
    const canvas = await html2canvas(resumePreview, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Generate a blob URL for preview purposes
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Clean up
    document.body.removeChild(container);
    
    // Generate a name for the file
    const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
    
    // Return the pdf blob URL for preview
    return pdfUrl;
  } catch (error) {
    console.error('Error generating resume PDF:', error);
    toast({
      title: "PDF Generation Failed",
      description: "There was an error generating your resume PDF. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
};

// Function to download the generated PDF
export const downloadResumePDF = async (resumeData: ResumeData): Promise<void> => {
  try {
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);
    
    // Generate the resume preview
    const resumePreview = ResumePreview(resumeData);
    container.appendChild(resumePreview);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate canvas from the preview
    const canvas = await html2canvas(resumePreview, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Generate a name for the file
    const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf` || 'resume.pdf';
    
    // Download the file
    pdf.save(fileName);
    
    // Clean up
    document.body.removeChild(container);
    
    toast({
      title: "Success",
      description: "Resume PDF downloaded successfully!",
      variant: "default"
    });
  } catch (error) {
    console.error('Error downloading resume PDF:', error);
    toast({
      title: "Download Failed",
      description: "There was an error downloading your resume. Please try again later.",
      variant: "destructive"
    });
  }
};

// Function to save resume data to local storage
export const saveResumeDraft = (resumeData: ResumeData): void => {
  try {
    localStorage.setItem('resumeDraft', JSON.stringify(resumeData));
    
    toast({
      title: "Draft Saved",
      description: "Your resume draft has been saved successfully!",
      variant: "default"
    });
  } catch (error) {
    console.error('Error saving resume draft:', error);
    toast({
      title: "Save Failed",
      description: "There was an error saving your resume draft. Please try again.",
      variant: "destructive"
    });
  }
};

// Function to load resume data from local storage
export const loadResumeDraft = (): ResumeData | null => {
  try {
    const savedDraft = localStorage.getItem('resumeDraft');
    if (savedDraft) {
      return JSON.parse(savedDraft);
    }
    return null;
  } catch (error) {
    console.error('Error loading resume draft:', error);
    toast({
      title: "Load Failed",
      description: "There was an error loading your saved resume draft.",
      variant: "destructive"
    });
    return null;
  }
};
