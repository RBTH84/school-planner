import { useState, useEffect } from "react";
import { Plus, Settings } from "lucide-react";
import { Course } from "@/types/course";
import { AddCourseSheet } from "@/components/AddCourseSheet";
import { CustomizationDialog } from "@/components/CustomizationDialog";
import { getCurrentWeekType } from "@/utils/weekUtils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CourseDialog } from "@/components/calendar/CourseDialog";

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
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    localStorage.setItem("customTitle", title);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    document.documentElement.style.setProperty("--custom-primary", primaryColor);
    document.documentElement.style.setProperty("--custom-secondary", secondaryColor);
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
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setSelectedCourse(null);
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <CalendarHeader
        title={title}
        primaryColor={primaryColor}
        showNextWeek={showNextWeek}
        setShowNextWeek={setShowNextWeek}
        currentWeekType={currentWeekType}
        setIsAddCourseOpen={setIsAddCourseOpen}
      />

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

      <CourseDialog
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        onDeleteCourse={handleDeleteCourse}
      />

      <CustomizationDialog
        open={isCustomizationOpen}
        onOpenChange={setIsCustomizationOpen}
        title={title}
        onTitleChange={setTitle}
        primaryColor={primaryColor}
        onPrimaryColorChange={setPrimaryColor}
        secondaryColor={secondaryColor}
        onSecondaryColorChange={setSecondaryColor}
      />

      <div className="fixed bottom-20 right-4 md:bottom-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCustomizationOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Calendar;