import { useState } from "react";
import { Course, DatabaseCourse, WeekType } from "@/types/course";
import { getCurrentWeekType } from "@/utils/weekUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

export const useCalendar = () => {
  const queryClient = useQueryClient();
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [currentWeekType, setCurrentWeekType] = useState<"A" | "B">(getCurrentWeekType());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showNextWeek, setShowNextWeek] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

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

  return {
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
  };
};