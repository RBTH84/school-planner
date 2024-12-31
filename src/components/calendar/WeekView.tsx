import { Course } from "@/types/course";
import { shouldShowCourse } from "@/utils/weekUtils";

interface WeekViewProps {
  courses: Course[];
  currentWeekType: "A" | "B";
  showNextWeek: boolean;
  onCourseClick: (course: Course) => void;
  primaryColor: string;
  secondaryColor: string;
}

export const WeekView = ({
  courses,
  currentWeekType,
  showNextWeek,
  onCourseClick,
  primaryColor,
  secondaryColor,
}: WeekViewProps) => {
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  const getCourseForTimeSlot = (hour: number, dayIndex: number) => {
    const nextWeekType = currentWeekType === "A" ? "B" : "A";
    return courses.find(
      (course) => {
        const courseHour = parseInt(course.startTime.split(":")[0]);
        return courseHour === hour && 
               course.dayOfWeek === dayIndex + 1 && 
               shouldShowCourse(course.weekType, showNextWeek ? nextWeekType : currentWeekType);
      }
    );
  };

  return (
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
                  onClick={() => course && onCourseClick(course)}
                >
                  {course && (
                    <div 
                      className="p-1 text-xs font-bold truncate"
                      style={{ color: showNextWeek ? '#8E9196' : primaryColor }}
                    >
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
  );
};