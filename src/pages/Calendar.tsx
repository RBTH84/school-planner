import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Heart } from "lucide-react";
import { Course } from "@/types/course";
import { AddCourseSheet } from "@/components/AddCourseSheet";
import { CustomizationDialog } from "@/components/CustomizationDialog";
import { getCurrentWeekType } from "@/utils/weekUtils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";

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
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);
  
  const isMobile = useIsMobile();

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
          {!isMobile && (
            <Button
              variant="outline"
              onClick={() => setShowNextWeek(!showNextWeek)}
              className="text-sm hidden md:flex"
            >
              {showNextWeek ? "Voir cette semaine" : "Voir semaine prochaine"}
            </Button>
          )}
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
            <Plus className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">Ajouter un cours</span>
          </Button>
        </div>
      </div>

      {isMobile && (
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowNextWeek(!showNextWeek)}
            className="w-full"
          >
            {showNextWeek ? "Voir cette semaine" : "Voir semaine prochaine"}
          </Button>
        </div>
      )}

      {isMobile ? (
        <DayView
          courses={courses}
          currentWeekType={currentWeekType}
          showNextWeek={showNextWeek}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
        />
      ) : (
        <WeekView
          courses={courses}
          currentWeekType={currentWeekType}
          showNextWeek={showNextWeek}
          onCourseClick={setSelectedCourse}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      )}

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