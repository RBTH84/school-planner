import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WeekType } from "@/types/course";

interface CourseWeekTypeProps {
  weekType: WeekType;
  setWeekType: (type: WeekType) => void;
}

export const CourseWeekType = ({ weekType, setWeekType }: CourseWeekTypeProps) => {
  return (
    <div className="space-y-2">
      <Label>Type de semaine</Label>
      <RadioGroup
        value={weekType}
        onValueChange={(value) => setWeekType(value as WeekType)}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="both" id="both" />
          <Label htmlFor="both">Toutes les semaines</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="A" id="weekA" />
          <Label htmlFor="weekA">Semaine A</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="B" id="weekB" />
          <Label htmlFor="weekB">Semaine B</Label>
        </div>
      </RadioGroup>
    </div>
  );
};