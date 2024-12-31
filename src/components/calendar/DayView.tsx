import { Course } from "@/types/course";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { shouldShowCourse } from "@/utils/weekUtils";

interface DayViewProps {
  courses: Course[];
  currentWeekType: "A" | "B";
  showNextWeek: boolean;
  selectedDay: number;
  onDayChange: (day: number) => void;
}

export const DayView = ({
  courses,
  currentWeekType,
  showNextWeek,
  selectedDay,
  onDayChange,
}: DayViewProps) => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  const getCourseForTimeSlot = (hour: number) => {
    const nextWeekType = currentWeekType === "A" ? "B" : "A";
    return courses.find(
      (course) => {
        const courseHour = parseInt(course.startTime.split(":")[0]);
        return courseHour === hour && 
               course.dayOfWeek === selectedDay && 
               shouldShowCourse(course.weekType, showNextWeek ? nextWeekType : currentWeekType);
      }
    );
  };

  const handlePreviousDay = () => {
    onDayChange(selectedDay === 1 ? 7 : selectedDay - 1);
  };

  const handleNextDay = () => {
    onDayChange(selectedDay === 7 ? 1 : selectedDay + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-pink-50 p-4 rounded-xl">
        <Button
          variant="ghost"
          onClick={handlePreviousDay}
          className="p-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold text-pink-500">
          {daysOfWeek[selectedDay - 1]}
        </h2>
        <Button
          variant="ghost"
          onClick={handleNextDay}
          className="p-2"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-2">
        {hours.map((hour) => {
          const course = getCourseForTimeSlot(hour);
          return (
            <div
              key={hour}
              className={`p-4 rounded-xl border ${
                course 
                  ? 'bg-pink-50 border-pink-200'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-bold">
                  {hour}:00
                </span>
                {course && (
                  <div className="flex-1 ml-4">
                    <h3 className="font-bold text-pink-500">{course.title}</h3>
                    <p className="text-sm text-gray-600">
                      {course.startTime} - {course.endTime}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};