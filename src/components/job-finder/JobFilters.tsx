
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Sparkles } from "lucide-react";

interface JobFiltersProps {
  onFilterChange: (filters: any) => void;
  onSearch: (term: string) => void;
  searchTerm: string;
  loading: boolean;
}

const JobFilters = ({ onFilterChange, onSearch, searchTerm, loading }: JobFiltersProps) => {
  const handleSalaryChange = (value: number[]) => {
    onFilterChange({ salary: value[0] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input 
          placeholder="Job title, skills, or company" 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1"
        />
        <Button size="icon" disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Separator />
      
      <div className="space-y-4">
        <div>
          <Label>Experience Level</Label>
          <Select onValueChange={(value) => onFilterChange({ experienceLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead/Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Employment Type</Label>
          <Select onValueChange={(value) => onFilterChange({ employmentType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Location Type</Label>
          <Select onValueChange={(value) => onFilterChange({ locationType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select location type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Salary Range (in thousands)</Label>
          <Slider 
            defaultValue={[50]} 
            max={200} 
            step={10}
            onValueChange={handleSalaryChange}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$50k</span>
            <span>$200k+</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Popular Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["React", "JavaScript", "TypeScript", "Node.js", "Python", "AWS"].map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => onSearch(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
