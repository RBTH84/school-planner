import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Course } from "@/types/course";
import { useToast } from "@/components/ui/use-toast";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startTime || !endTime || !dayOfWeek) {
      toast({
        title: "Erreur",
        description: "Merci de remplir tous les champs",
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
      materials: [],
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
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ajouter un cours</SheetTitle>
          <SheetDescription>
            Remplissez les informations pour ajouter un nouveau cours à votre
            planning
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Nom du cours
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Mathématiques"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="day" className="text-sm font-medium">
              Jour
            </label>
            <select
              id="day"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <label htmlFor="startTime" className="text-sm font-medium">
              Heure de début
            </label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="text-sm font-medium">
              Heure de fin
            </label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Ajouter le cours
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};