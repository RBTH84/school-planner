import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Course } from "@/types/course";
import { AddCourseSheet } from "@/components/AddCourseSheet";

const Calendar = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h à 21h

  const handleAddCourse = (course: Course) => {
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  const getCourseForTimeSlot = (hour: number, dayIndex: number) => {
    return courses.find(
      (course) => {
        const courseHour = parseInt(course.startTime.split(":")[0]);
        return courseHour === hour && course.dayOfWeek === dayIndex + 1;
      }
    );
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-pink-500">Mon Planning</h1>
        <Button 
          className="bg-pink-400 hover:bg-pink-500 shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsAddCourseOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un cours
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-2 min-w-[800px]">
          <div className="sticky left-0 bg-white"></div>
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-medium py-3 bg-pink-50 text-pink-700 rounded-xl shadow-sm">
              {day}
            </div>
          ))}

          {hours.map((hour) => (
            <>
              <div key={`time-${hour}`} className="sticky left-0 bg-white text-right pr-2 py-2 text-sm text-gray-600">
                {hour}:00
              </div>
              {daysOfWeek.map((_, dayIndex) => {
                const course = getCourseForTimeSlot(hour, dayIndex);
                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className={`border border-pink-100 rounded-xl h-12 transition-colors ${
                      course 
                        ? "bg-pink-100 hover:bg-pink-200 cursor-pointer" 
                        : "hover:bg-pink-50 cursor-pointer"
                    }`}
                  >
                    {course && (
                      <div className="p-1 text-xs font-medium truncate text-pink-700">
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
    </div>
  );
};

export default Calendar;