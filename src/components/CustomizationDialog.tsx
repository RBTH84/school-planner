import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface CustomizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationDialog({ isOpen, onClose }: CustomizationDialogProps) {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#000000");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [currentBackgroundUrl, setCurrentBackgroundUrl] = useState<string>("");

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedBg = localStorage.getItem("backgroundColor");
    const savedFont = localStorage.getItem("fontColor");
    const savedBgUrl = localStorage.getItem("backgroundUrl");

    if (savedBg) setBackgroundColor(savedBg);
    if (savedFont) setFontColor(savedFont);
    if (savedBgUrl) setCurrentBackgroundUrl(savedBgUrl);
  }, []);

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      // Save color preferences
      localStorage.setItem("backgroundColor", backgroundColor);
      localStorage.setItem("fontColor", fontColor);

      // Upload background image if selected
      if (backgroundImage) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const fileExt = backgroundImage.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('backgrounds')
          .upload(fileName, backgroundImage);

        if (error) throw error;

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('backgrounds')
            .getPublicUrl(fileName);

          localStorage.setItem("backgroundUrl", publicUrl);
          setCurrentBackgroundUrl(publicUrl);
        }
      }

      // Apply styles to body
      document.body.style.backgroundColor = backgroundColor;
      document.body.style.color = fontColor;
      if (currentBackgroundUrl) {
        document.body.style.backgroundImage = `url(${currentBackgroundUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
      }

      toast({
        title: "Customization saved",
        description: "Your preferences have been updated",
      });

      onClose();
    } catch (error) {
      console.error('Error saving customization:', error);
      toast({
        title: "Error",
        description: "Failed to save customization",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Appearance</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="backgroundColor" className="text-right">
              Background
            </Label>
            <Input
              id="backgroundColor"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fontColor" className="text-right">
              Font Color
            </Label>
            <Input
              id="fontColor"
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="backgroundImage" className="text-right">
              Background Image
            </Label>
            <Input
              id="backgroundImage"
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
              className="col-span-3"
            />
          </div>
          {currentBackgroundUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Current</Label>
              <div className="col-span-3">
                <img
                  src={currentBackgroundUrl}
                  alt="Current background"
                  className="w-full h-20 object-cover rounded"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}