import { useEffect, useState } from "react";
import { Course } from "@/types/course";
import { CheckCircle2 } from "lucide-react";

const Bag = () => {
  const [tomorrowCourses, setTomorrowCourses] = useState<Course[]>([]);

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Sac pour Demain</h1>
      
      {tomorrowCourses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Pas de cours prévus pour demain
        </div>
      ) : (
        <div className="space-y-4">
          {tomorrowCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg mb-2">{course.title}</h2>
              <div className="text-sm text-gray-600 mb-3">
                {course.startTime} - {course.endTime}
              </div>
              <div className="space-y-2">
                {course.materials.map((material, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{material}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bag;