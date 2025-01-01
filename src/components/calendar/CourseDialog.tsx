import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CourseDialogProps {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const CourseDialog = ({
  selectedCourse,
  setSelectedCourse,
  onDeleteCourse,
}: CourseDialogProps) => {
  const handleDeleteCourse = (courseId: string) => {
    onDeleteCourse(courseId);
    toast.success("Cours supprimé avec succès");
  };

  return (
    <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">{selectedCourse?.title}</DialogTitle>
          <DialogDescription className="font-bold">
            {selectedCourse?.startTime} - {selectedCourse?.endTime}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {selectedCourse?.materials && selectedCourse.materials.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Matériel requis :</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedCourse.materials.map((material, index) => (
                  <li key={index} className="font-bold">
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => selectedCourse && handleDeleteCourse(selectedCourse.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};