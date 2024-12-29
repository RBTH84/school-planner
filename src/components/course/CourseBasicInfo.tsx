import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseBasicInfoProps {
  title: string;
  setTitle: (title: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  dayOfWeek: string;
  setDayOfWeek: (day: string) => void;
}

export const CourseBasicInfo = ({
  title,
  setTitle,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  dayOfWeek,
  setDayOfWeek,
}: CourseBasicInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Nom du cours</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Mathématiques"
          className="border-pink-200 focus-visible:ring-pink-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="day">Jour</Label>
        <select
          id="day"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          className="w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
        >
          <option value="1">Lundi</option>
          <option value="2">Mardi</option>
          <option value="3">Mercredi</option>
          <option value="4">Jeudi</option>
          <option value="5">Vendredi</option>
          <option value="6">Samedi</option>
          <option value="7">Dimanche</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime">Heure de début</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border-pink-200 focus-visible:ring-pink-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endTime">Heure de fin</Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border-pink-200 focus-visible:ring-pink-200"
        />
      </div>
    </>
  );
};