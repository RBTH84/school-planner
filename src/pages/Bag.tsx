import { useEffect, useState } from "react";
import { Course } from "@/types/course";
import { CheckCircle2 } from "lucide-react";

const Bag = () => {
  const [tomorrowCourses, setTomorrowCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadTomorrowCourses = () => {
      const savedCourses = localStorage.getItem("courses");
      if (!savedCourses) return;

      const allCourses: Course[] = JSON.parse(savedCourses);
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
      const tomorrow = today === 6 ? 0 : today + 1;
      // Convert from JS day (0-6, Sunday-Saturday) to our day (1-7, Monday-Sunday)
      const tomorrowConverted = tomorrow === 0 ? 7 : tomorrow;
      
      const coursesForTomorrow = allCourses.filter(
        course => course.dayOfWeek === tomorrowConverted
      ).sort((a, b) => a.startTime.localeCompare(b.startTime));

      setTomorrowCourses(coursesForTomorrow);
    };

    loadTomorrowCourses();
  }, []);

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold text-pink-500 mb-6">Mon Sac pour Demain</h1>
      
      {tomorrowCourses.length === 0 ? (
        <div className="text-center py-12 px-4 bg-pink-50 rounded-2xl shadow-sm">
          <p className="text-gray-600">Pas de cours prévus pour demain</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tomorrowCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-pink-100">
              <h2 className="font-semibold text-lg mb-2 text-pink-600">{course.title}</h2>
              <div className="text-sm text-gray-600 mb-4">
                {course.startTime} - {course.endTime}
              </div>
              <div className="space-y-3">
                {course.materials.length === 0 ? (
                  <p className="text-gray-500 italic">Aucun matériel requis</p>
                ) : (
                  course.materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-pink-400" />
                      <span>{material}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bag;