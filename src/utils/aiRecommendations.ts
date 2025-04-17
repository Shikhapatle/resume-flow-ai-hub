
// AI recommendation utilities for resume building
import { toast } from "@/components/ui/use-toast";

// API keys
const NVAPI_KEY = "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";
const GROQ_API_KEY = "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";

export interface AIRecommendationOptions {
  query: string;
  context?: string;
  maxLength?: number;
}

export const generateRecommendation = async ({ 
  query, 
  context = "",
  maxLength = 500 
}: AIRecommendationOptions): Promise<string> => {
  try {
    // For now, we'll use a simple implementation with NVAPI
    const response = await fetch("https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions/f5dcb2de-7282-4ac9-9d8a-fcc5db59cd8e", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVAPI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: {
          prompt: `Generate a professional ${query}. ${context}`,
          max_tokens: maxLength
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.output?.text || "Unable to generate recommendation at this time.";
  } catch (error) {
    console.error("AI recommendation error:", error);
    toast({
      title: "AI Recommendation Failed",
      description: "Unable to generate recommendation. Please try again later.",
      variant: "destructive"
    });
    return "Unable to generate recommendation. Please try again later.";
  }
};

export const generateResumeSummary = async (resumeData: any): Promise<string> => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a professional resume specialist. Generate a concise, professional executive summary based on the provided resume information."
          },
          {
            role: "user",
            content: `Please create a professional executive summary based on this resume data: ${JSON.stringify(resumeData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 
      "Experienced professional with a proven track record of success in the industry. Skilled in technical implementation and team leadership, with strong communication and problem-solving abilities. Committed to delivering high-quality results and continuous improvement.";
    
  } catch (error) {
    console.error("Resume summary generation error:", error);
    toast({
      title: "Summary Generation Failed",
      description: "Unable to generate resume summary. Please try again later.",
      variant: "destructive"
    });
    return "Experienced professional with a proven track record of success in the industry. Skilled in technical implementation and team leadership, with strong communication and problem-solving abilities. Committed to delivering high-quality results and continuous improvement.";
  }
};

export const scoreResume = async (resumeData: any): Promise<{
  score: number;
  feedback: string;
  suggestions: string[];
}> => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a professional resume reviewer. Analyze the resume data provided and generate a score from 0-100, detailed feedback, and specific suggestions for improvement."
          },
          {
            role: "user",
            content: `Please review this resume data and provide scoring, feedback, and suggestions: ${JSON.stringify(resumeData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the AI response into structured data
    // This is a simple implementation and might need improvements
    const scoreMatch = content.match(/score[:\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;
    
    // Extract feedback and suggestions
    const parts = content.split(/suggestions:/i);
    const feedback = parts[0].replace(/score[:\s]*\d+/i, "").trim();
    
    const suggestionsText = parts[1] || "";
    const suggestions = suggestionsText
      .split(/\d+\.|\n-|\*/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return {
      score,
      feedback,
      suggestions: suggestions.length ? suggestions : ["Add more details to your work experience", "Include relevant skills for your target position"]
    };
  } catch (error) {
    console.error("Resume scoring error:", error);
    toast({
      title: "Resume Scoring Failed",
      description: "Unable to score your resume. Please try again later.",
      variant: "destructive"
    });
    return {
      score: 70,
      feedback: "Unable to generate detailed feedback at this time.",
      suggestions: ["Add more details to your work experience", "Include relevant skills for your target position"]
    };
  }
};
