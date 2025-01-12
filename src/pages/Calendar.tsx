import { useState, useEffect } from "react";
import { Plus, Settings } from "lucide-react";
import { Course, DatabaseCourse, WeekType } from "@/types/course";
import { AddCourseSheet } from "@/components/AddCourseSheet";
import { CustomizationDialog } from "@/components/CustomizationDialog";
import { getCurrentWeekType } from "@/utils/weekUtils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CourseDialog } from "@/components/calendar/CourseDialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const mapDatabaseCourseToFrontend = (dbCourse: DatabaseCourse): Course => ({
  id: dbCourse.id,
  title: dbCourse.title,
  startTime: dbCourse.start_time,
  endTime: dbCourse.end_time,
  dayOfWeek: dbCourse.day_of_week,
  materials: dbCourse.materials,
  weekType: dbCourse.week_type as WeekType,
});

const mapFrontendCourseToDatabase = (course: Course, userId: string): Omit<DatabaseCourse, 'id' | 'created_at'> => ({
  user_id: userId,
  title: course.title,
  start_time: course.startTime,
  end_time: course.endTime,
  day_of_week: course.dayOfWeek,
  materials: course.materials,
  week_type: course.weekType,
});

const Calendar = () => {
  const queryClient = useQueryClient();
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [currentWeekType, setCurrentWeekType] = useState<"A" | "B">(getCurrentWeekType());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showNextWeek, setShowNextWeek] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const [title, setTitle] = useState(() => {
    return localStorage.getItem("customTitle") || "Planning de mon chaton";
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("primaryColor") || "#ff69b4";
  });

  const [secondaryColor, setSecondaryColor] = useState(() => {
    return localStorage.getItem("secondaryColor") || "#fce7f3";
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

  const isMobile = useIsMobile();

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les cours",
          variant: "destructive",
        });
        throw error;
      }
      
      return (data as DatabaseCourse[]).map(mapDatabaseCourseToFrontend);
    },
  });

  // Add course mutation
  const addCourseMutation = useMutation({
    mutationFn: async (course: Course) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('courses')
        .insert([mapFrontendCourseToDatabase(course, user.id)]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Cours ajouté !",
        description: "Le cours a bien été ajouté à votre planning",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le cours",
        variant: "destructive",
      });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Cours supprimé",
        description: "Le cours a bien été supprimé de votre planning",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    localStorage.setItem("customTitle", title);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    localStorage.setItem("notificationsEnabled", notificationsEnabled.toString());
    localStorage.setItem("notificationTime", notificationTime);
    localStorage.setItem("userName", userName);
    document.documentElement.style.setProperty("--custom-primary", primaryColor);
    document.documentElement.style.setProperty("--custom-secondary", secondaryColor);
  }, [title, primaryColor, secondaryColor, notificationsEnabled, notificationTime, userName]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeekType(getCurrentWeekType());
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

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

  const handleAddCourse = (course: Course) => {
    addCourseMutation.mutate(course);
  };

  const handleDeleteCourse = (courseId: string) => {
    deleteCourseMutation.mutate(courseId);
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
        notificationsEnabled={notificationsEnabled}
        onNotificationsEnabledChange={setNotificationsEnabled}
        notificationTime={notificationTime}
        onNotificationTimeChange={setNotificationTime}
        userName={userName}
        onUserNameChange={setUserName}
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