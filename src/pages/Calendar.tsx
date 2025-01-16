import { useEffect, useState } from "react";
import { AddCourseSheet } from "@/components/AddCourseSheet";
import { CustomizationDialog } from "@/components/CustomizationDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CourseDialog } from "@/components/calendar/CourseDialog";
import { CustomizationButton } from "@/components/calendar/CustomizationButton";
import { useCalendar } from "@/hooks/use-calendar";
import { getCurrentWeekType } from "@/utils/weekUtils";

const Calendar = () => {
  const {
    courses,
    isAddCourseOpen,
    setIsAddCourseOpen,
    selectedCourse,
    setSelectedCourse,
    showNextWeek,
    setShowNextWeek,
    selectedDay,
    setSelectedDay,
    isCustomizationOpen,
    setIsCustomizationOpen,
    addCourseMutation,
    deleteCourseMutation,
  } = useCalendar();

  const isMobile = useIsMobile();

  const [title, setTitle] = useState(() => {
    return localStorage.getItem("customTitle") || "Planning de mon chaton";
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("primaryColor") || "#ff69b4";
  });

  const [secondaryColor, setSecondaryColor] = useState(() => {
    return localStorage.getItem("secondaryColor") || "#fce7f3";
  });

  const [currentWeekType, setCurrentWeekType] = useState<"A" | "B">(() => {
    const override = localStorage.getItem("overrideWeekType") === "true";
    if (override) {
      return (localStorage.getItem("manualWeekType") as "A" | "B") || "A";
    }
    return getCurrentWeekType();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const override = localStorage.getItem("overrideWeekType") === "true";
      if (!override) {
        setCurrentWeekType(getCurrentWeekType());
      }
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "overrideWeekType" || e.key === "manualWeekType") {
        const override = localStorage.getItem("overrideWeekType") === "true";
        if (override) {
          setCurrentWeekType((localStorage.getItem("manualWeekType") as "A" | "B") || "A");
        } else {
          setCurrentWeekType(getCurrentWeekType());
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
        onAddCourse={(course) => addCourseMutation.mutate(course)}
      />

      <CourseDialog
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        onDeleteCourse={(courseId) => deleteCourseMutation.mutate(courseId)}
      />

      <CustomizationDialog
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
      />

      <CustomizationButton onClick={() => setIsCustomizationOpen(true)} />
    </div>
  );
};

export default Calendar;