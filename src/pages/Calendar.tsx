import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Course } from "@/types/course";

const Calendar = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h à 21h

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon Planning</h1>
        <Button className="shadow-md hover:shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un cours
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-2 min-w-[800px]">
          <div className="sticky left-0 bg-white"></div>
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-medium py-3 bg-secondary rounded-xl shadow-sm">
              {day}
            </div>
          ))}

          {hours.map((hour) => (
            <>
              <div key={hour} className="sticky left-0 bg-white text-right pr-2 py-2 text-sm text-gray-600">
                {hour}:00
              </div>
              {daysOfWeek.map((_, dayIndex) => (
                <div
                  key={`${hour}-${dayIndex}`}
                  className="border border-gray-100 rounded-xl h-12 hover:bg-secondary/50 transition-colors cursor-pointer"
                ></div>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;