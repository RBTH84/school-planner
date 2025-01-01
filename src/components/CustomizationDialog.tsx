import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomizationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  secondaryColor: string;
  onSecondaryColorChange: (color: string) => void;
}

export const CustomizationDialog = ({
  open,
  onOpenChange,
  title,
  onTitleChange,
  primaryColor,
  onPrimaryColorChange,
  secondaryColor,
  onSecondaryColorChange,
}: CustomizationProps) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localPrimaryColor, setLocalPrimaryColor] = useState(primaryColor);
  const [localSecondaryColor, setLocalSecondaryColor] = useState(secondaryColor);

  const handleSave = () => {
    onTitleChange(localTitle);
    onPrimaryColorChange(localPrimaryColor);
    onSecondaryColorChange(localSecondaryColor);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Personnalisation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="primaryColor">Couleur principale</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={localPrimaryColor}
                onChange={(e) => setLocalPrimaryColor(e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                value={localPrimaryColor}
                onChange={(e) => setLocalPrimaryColor(e.target.value)}
                placeholder="#FF69B4"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="secondaryColor">Couleur secondaire</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={localSecondaryColor}
                onChange={(e) => setLocalSecondaryColor(e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                value={localSecondaryColor}
                onChange={(e) => setLocalSecondaryColor(e.target.value)}
                placeholder="#FFB6C1"
              />
            </div>
          </div>
        </div>
        <Button onClick={handleSave}>Sauvegarder</Button>
      </DialogContent>
    </Dialog>
  );
};