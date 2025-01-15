import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomizationButtonProps {
  onClick: () => void;
}

export const CustomizationButton = ({ onClick }: CustomizationButtonProps) => {
  return (
    <div className="fixed bottom-20 right-4 md:bottom-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};