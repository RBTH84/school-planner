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
import { WeekType } from "@/types/course";
import { toast } from "@/hooks/use-toast";
import { getCurrentWeekType } from "@/utils/weekUtils";

const Calendar = () => {
  const {
    courses,
    isAddCourseOpen,
    setIsAddCourseOpen,
    currentWeekType,
    setCurrentWeekType,
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

  const [backgroundColor, setBackgroundColor] = useState(() => {
    return localStorage.getItem("backgroundColor") || "#fff0f5";
  });

  const [fontColor, setFontColor] = useState(() => {
    return localStorage.getItem("fontColor") || "#000000";
  });

  const [backgroundImage, setBackgroundImage] = useState(() => {
    return localStorage.getItem("backgroundImage") || null;
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("notificationsEnabled") === "true";
  });

  const [notificationTime, setNotificationTime] = useState(() => {
    return localStorage.getItem("notificationTime") || "20:00";
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

  useEffect(() => {
    localStorage.setItem("customTitle", title);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    localStorage.setItem("backgroundColor", backgroundColor);
    localStorage.setItem("fontColor", fontColor);
    if (backgroundImage) {
      localStorage.setItem("backgroundImage", backgroundImage);
    } else {
      localStorage.removeItem("backgroundImage");
    }
    localStorage.setItem("notificationsEnabled", notificationsEnabled.toString());
    localStorage.setItem("notificationTime", notificationTime);
    localStorage.setItem("userName", userName);

    // Apply styles to body
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = fontColor;
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    } else {
      document.body.style.backgroundImage = 'none';
    }
  }, [title, primaryColor, secondaryColor, backgroundColor, fontColor, backgroundImage, notificationsEnabled, notificationTime, userName]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeekType(getCurrentWeekType());
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [setCurrentWeekType]);

  useEffect(() => {
    if (notificationsEnabled) {
      const checkNotificationTime = () => {
        const now = new Date();
        const [hours, minutes] = notificationTime.split(":").map(Number);
        
        if (now.getHours() === hours && now.getMinutes() === minutes) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowDay = tomorrow.getDay() || 7;
          
          if (tomorrowDay !== 6 && tomorrowDay !== 7) {
            toast({
              title: "Préparation du sac",
              description: `Bonsoir ${userName}, n'oublie pas de préparer ton sac pour demain ! Bonne nuit ! 🌙`,
              duration: 10000,
            });
          }
        }
      };

      const notificationInterval = setInterval(checkNotificationTime, 1000 * 60);
      return () => clearInterval(notificationInterval);
    }
  }, [notificationsEnabled, notificationTime, userName]);

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
        open={isCustomizationOpen}
        onOpenChange={setIsCustomizationOpen}
        title={title}
        onTitleChange={setTitle}
        primaryColor={primaryColor}
        onPrimaryColorChange={setPrimaryColor}
        secondaryColor={secondaryColor}
        onSecondaryColorChange={setSecondaryColor}
        notificationsEnabled={notificationsEnabled}
        onNotificationsEnabledChange={setNotificationsEnabled}
        notificationTime={notificationTime}
        onNotificationTimeChange={setNotificationTime}
        userName={userName}
        onUserNameChange={setUserName}
        backgroundColor={backgroundColor}
        onBackgroundColorChange={setBackgroundColor}
        fontColor={fontColor}
        onFontColorChange={setFontColor}
        backgroundImage={backgroundImage}
        onBackgroundImageChange={setBackgroundImage}
      />

      <CustomizationButton onClick={() => setIsCustomizationOpen(true)} />
    </div>
  );
};

export default Calendar;