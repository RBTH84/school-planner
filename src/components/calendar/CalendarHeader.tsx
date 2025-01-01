import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarHeaderProps {
  title: string;
  primaryColor: string;
  showNextWeek: boolean;
  setShowNextWeek: (show: boolean) => void;
  currentWeekType: "A" | "B";
  setIsAddCourseOpen: (open: boolean) => void;
}

export const CalendarHeader = ({
  title,
  primaryColor,
  showNextWeek,
  setShowNextWeek,
  currentWeekType,
  setIsAddCourseOpen,
}: CalendarHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6" style={{ color: primaryColor }} />
          <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
            {title}
          </h1>
          <Heart className="w-6 h-6" style={{ color: primaryColor }} />
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && (
            <Button
              variant="outline"
              onClick={() => setShowNextWeek(!showNextWeek)}
              className="text-sm hidden md:flex"
            >
              {showNextWeek ? "Voir cette semaine" : "Voir semaine prochaine"}
            </Button>
          )}
          <Badge variant="outline" className="text-sm">
            Semaine {showNextWeek ? (currentWeekType === "A" ? "B" : "A") : currentWeekType}
          </Badge>
          <Button
            className="shadow-md hover:shadow-lg transition-all"
            style={{
              backgroundColor: primaryColor,
              color: "white",
            }}
            onClick={() => setIsAddCourseOpen(true)}
          >
            <Plus className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">Ajouter un cours</span>
          </Button>
        </div>
      </div>

      {isMobile && (
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowNextWeek(!showNextWeek)}
            className="w-full"
          >
            {showNextWeek ? "Voir cette semaine" : "Voir semaine prochaine"}
          </Button>
        </div>
      )}
    </>
  );
};