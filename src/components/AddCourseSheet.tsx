import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Course, WeekType } from "@/types/course";
import { useToast } from "@/components/ui/use-toast";
import { Plus, X } from "lucide-react";

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

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials([...materials, newMaterial.trim()]);
      setNewMaterial("");
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

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
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Nom du cours
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Mathématiques"
              className="border-pink-200 focus-visible:ring-pink-200"
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
            <label className="text-sm font-medium">Type de semaine</label>
            <RadioGroup
              defaultValue="both"
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

          <div className="space-y-2">
            <label htmlFor="startTime" className="text-sm font-medium">
              Heure de début
            </label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border-pink-200 focus-visible:ring-pink-200"
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
              className="border-pink-200 focus-visible:ring-pink-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Matériel nécessaire</label>
            <div className="flex gap-2">
              <Input
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Ex: Cahier, livre..."
                className="border-pink-200 focus-visible:ring-pink-200"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMaterial();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddMaterial}
                className="bg-pink-400 hover:bg-pink-500"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {materials.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-pink-50 p-2 rounded-md"
                >
                  <span>{material}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-pink-400 hover:bg-pink-500">
            Ajouter le cours
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};