import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Pencil, Trash2 } from "lucide-react";
import { Course } from "@/types/course";
import { AddCourseSheet } from "@/components/AddCourseSheet";
import { CustomizationDialog } from "@/components/CustomizationDialog";
import { getCurrentWeekType, shouldShowCourse } from "@/utils/weekUtils";
import { Badge } from "@/components/ui/badge";
import { addWeeks, format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Calendar = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [title, setTitle] = useState(() => {
    return localStorage.getItem("customTitle") || "Planning de mon chaton";
  });
  
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("primaryColor") || "#ff69b4";
  });
  
  const [secondaryColor, setSecondaryColor] = useState(() => {
    return localStorage.getItem("secondaryColor") || "#fce7f3";
  });

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [currentWeekType, setCurrentWeekType] = useState<"A" | "B">(getCurrentWeekType());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showNextWeek, setShowNextWeek] = useState(false);

  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  useEffect(() => {
    localStorage.setItem("customTitle", title);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    document.documentElement.style.setProperty('--custom-primary', primaryColor);
    document.documentElement.style.setProperty('--custom-secondary', secondaryColor);
  }, [title, primaryColor, secondaryColor]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeekType(getCurrentWeekType());
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  const handleAddCourse = (course: Course) => {
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setSelectedCourse(null);
    toast.success("Cours supprimé avec succès");
  };

  const getCourseForTimeSlot = (hour: number, dayIndex: number) => {
    const nextWeekType = currentWeekType === "A" ? "B" : "A";
    return courses.find(
      (course) => {
        const courseHour = parseInt(course.startTime.split(":")[0]);
        return courseHour === hour && 
               course.dayOfWeek === dayIndex + 1 && 
               (shouldShowCourse(course.weekType, showNextWeek ? nextWeekType : currentWeekType));
      }
    );
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <CustomizationDialog
        title={title}
        onTitleChange={setTitle}
        primaryColor={primaryColor}
        onPrimaryColorChange={setPrimaryColor}
        secondaryColor={secondaryColor}
        onSecondaryColorChange={setSecondaryColor}
      />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6" style={{ color: primaryColor }} />
          <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>{title}</h1>
          <Heart className="w-6 h-6" style={{ color: primaryColor }} />
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowNextWeek(!showNextWeek)}
            className="text-sm"
          >
            {showNextWeek ? "Voir cette semaine" : "Voir semaine prochaine"}
          </Button>
          <Badge variant="outline" className="text-sm">
            Semaine {showNextWeek ? (currentWeekType === "A" ? "B" : "A") : currentWeekType}
          </Badge>
          <Button 
            className="shadow-md hover:shadow-lg transition-all"
            style={{ 
              backgroundColor: primaryColor,
              color: 'white'
            }}
            onClick={() => setIsAddCourseOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un cours
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-2 min-w-[800px]">
          <div className="sticky left-0 bg-white"></div>
          {daysOfWeek.map((day) => (
            <div 
              key={day} 
              className="text-center font-bold py-3 rounded-xl shadow-sm"
              style={{ 
                backgroundColor: secondaryColor,
                color: primaryColor
              }}
            >
              {day}
            </div>
          ))}

          {hours.map((hour) => (
            <>
              <div key={`time-${hour}`} className="sticky left-0 bg-white text-right pr-2 py-2 text-sm text-gray-600 font-bold">
                {hour}:00
              </div>
              {daysOfWeek.map((_, dayIndex) => {
                const course = getCourseForTimeSlot(hour, dayIndex);
                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className={`border rounded-xl h-12 transition-colors ${course ? 'cursor-pointer hover:opacity-80' : ''}`}
                    style={{
                      borderColor: primaryColor + '20',
                      backgroundColor: course 
                        ? showNextWeek 
                          ? '#F1F0FB' 
                          : secondaryColor 
                        : 'transparent',
                    }}
                    onClick={() => course && setSelectedCourse(course)}
                  >
                    {course && (
                      <div className="p-1 text-xs font-bold truncate" style={{ color: showNextWeek ? '#8E9196' : primaryColor }}>
                        {course.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      <AddCourseSheet
        open={isAddCourseOpen}
        onOpenChange={setIsAddCourseOpen}
        onAddCourse={handleAddCourse}
      />

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
                    <li key={index} className="font-bold">{material}</li>
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
    </div>
  );
};

export default Calendar;