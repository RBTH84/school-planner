import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Course, WeekType } from "@/types/course";
import { useToast } from "@/components/ui/use-toast";
import { CourseBasicInfo } from "./course/CourseBasicInfo";
import { CourseMaterials } from "./course/CourseMaterials";
import { CourseWeekType } from "./course/CourseWeekType";

interface AddCourseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCourse: (course: Course) => void;
}

export const AddCourseSheet = ({
  open,
  onOpenChange,
  onAddCourse,
}: AddCourseSheetProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [weekType, setWeekType] = useState<WeekType>("both");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startTime || !endTime || !dayOfWeek) {
      toast({
        title: "Erreur",
        description: "Merci de remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const newCourse: Course = {
      id: crypto.randomUUID(),
      title,
      startTime,
      endTime,
      dayOfWeek: parseInt(dayOfWeek),
      materials,
      weekType,
    };

    onAddCourse(newCourse);
    onOpenChange(false);
    
    toast({
      title: "Cours ajouté !",
      description: "Le cours a bien été ajouté à votre planning",
    });

    // Reset form
    setTitle("");
    setStartTime("");
    setEndTime("");
    setDayOfWeek("1");
    setMaterials([]);
    setNewMaterial("");
    setWeekType("both");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle className="text-primary">Ajouter un cours</SheetTitle>
          <SheetDescription>
            Remplissez les informations pour ajouter un nouveau cours à votre
            planning
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <CourseBasicInfo
            title={title}
            setTitle={setTitle}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            dayOfWeek={dayOfWeek}
            setDayOfWeek={setDayOfWeek}
          />

          <CourseWeekType weekType={weekType} setWeekType={setWeekType} />

          <CourseMaterials
            materials={materials}
            setMaterials={setMaterials}
            newMaterial={newMaterial}
            setNewMaterial={setNewMaterial}
          />

          <Button type="submit" className="w-full bg-pink-400 hover:bg-pink-500">
            Ajouter le cours
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};