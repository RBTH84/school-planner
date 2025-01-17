import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface CustomizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationDialog({ isOpen, onClose }: CustomizationDialogProps) {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#000000");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [currentBackgroundUrl, setCurrentBackgroundUrl] = useState<string>("");
  const [overrideWeekType, setOverrideWeekType] = useState(() => {
    return localStorage.getItem("overrideWeekType") === "true";
  });
  const [manualWeekType, setManualWeekType] = useState<"A" | "B">(() => {
    return (localStorage.getItem("manualWeekType") as "A" | "B") || "A";
  });
  const [customTitle, setCustomTitle] = useState(() => {
    return localStorage.getItem("customTitle") || "Planning de mon chaton";
  });
  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem("selectedFont") || "Inter";
  });
  const [bagNotificationTime, setBagNotificationTime] = useState(() => {
    return localStorage.getItem("bagNotificationTime") || "18:00";
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("notificationsEnabled") === "true";
  });

  useEffect(() => {
    const savedBg = localStorage.getItem("backgroundColor");
    const savedFont = localStorage.getItem("fontColor");
    const savedBgUrl = localStorage.getItem("backgroundUrl");
    const savedTitle = localStorage.getItem("customTitle");
    const savedFontFamily = localStorage.getItem("selectedFont");
    const savedNotificationTime = localStorage.getItem("bagNotificationTime");
    const savedNotificationsEnabled = localStorage.getItem("notificationsEnabled");

    if (savedBg) setBackgroundColor(savedBg);
    if (savedFont) setFontColor(savedFont);
    if (savedBgUrl) setCurrentBackgroundUrl(savedBgUrl);
    if (savedTitle) setCustomTitle(savedTitle);
    if (savedFontFamily) setSelectedFont(savedFontFamily);
    if (savedNotificationTime) setBagNotificationTime(savedNotificationTime);
    if (savedNotificationsEnabled) setNotificationsEnabled(savedNotificationsEnabled === "true");
  }, []);

  const handleBackgroundImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackgroundImage(file);
      
      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      setCurrentBackgroundUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    try {
      // Save basic preferences
      localStorage.setItem("backgroundColor", backgroundColor);
      localStorage.setItem("fontColor", fontColor);
      localStorage.setItem("overrideWeekType", overrideWeekType.toString());
      localStorage.setItem("manualWeekType", manualWeekType);
      localStorage.setItem("customTitle", customTitle);
      localStorage.setItem("selectedFont", selectedFont);
      localStorage.setItem("bagNotificationTime", bagNotificationTime);
      localStorage.setItem("notificationsEnabled", notificationsEnabled.toString());

      // Upload background image if selected
      if (backgroundImage) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const fileExt = backgroundImage.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('backgrounds')
          .upload(fileName, backgroundImage);

        if (error) {
          console.error('Upload error:', error);
          throw error;
        }

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('backgrounds')
            .getPublicUrl(fileName);

          localStorage.setItem("backgroundUrl", publicUrl);
          setCurrentBackgroundUrl(publicUrl);
          
          // Apply background image immediately
          document.body.style.backgroundImage = `url(${publicUrl})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center';
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundAttachment = 'fixed';
        }
      }

      // Apply other styles
      document.body.style.backgroundColor = backgroundColor;
      document.body.style.color = fontColor;
      document.body.style.fontFamily = selectedFont;

      toast({
        title: "Personnalisation sauvegardée",
        description: "Vos préférences ont été mises à jour",
      });

      onClose();
    } catch (error) {
      console.error('Error saving customization:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les personnalisations",
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
        <Tabs defaultValue="appearance">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="font" className="text-right">
                  Font
                </Label>
                <select
                  id="font"
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="col-span-3 p-2 border rounded"
                >
                  <option value="Inter">Inter</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="overrideWeek" className="text-right">
                  Override Week Type
                </Label>
                <div className="col-span-3 flex items-center space-x-4">
                  <Switch
                    id="overrideWeek"
                    checked={overrideWeekType}
                    onCheckedChange={setOverrideWeekType}
                  />
                  {overrideWeekType && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={manualWeekType === "A" ? "default" : "outline"}
                        onClick={() => setManualWeekType("A")}
                        className="w-12"
                      >
                        A
                      </Button>
                      <Button
                        variant={manualWeekType === "B" ? "default" : "outline"}
                        onClick={() => setManualWeekType("B")}
                        className="w-12"
                      >
                        B
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notifications" className="text-right">
                  Bag Notifications
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </div>
              {notificationsEnabled && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notificationTime" className="text-right">
                    Notification Time
                  </Label>
                  <Input
                    id="notificationTime"
                    type="time"
                    value={bagNotificationTime}
                    onChange={(e) => setBagNotificationTime(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
