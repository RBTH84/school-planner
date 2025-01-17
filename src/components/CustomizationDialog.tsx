import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AppearanceTab } from "./customization/AppearanceTab";
import { NotificationsTab } from "./customization/NotificationsTab";

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
      
      const objectUrl = URL.createObjectURL(file);
      setCurrentBackgroundUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    try {
      localStorage.setItem("backgroundColor", backgroundColor);
      localStorage.setItem("fontColor", fontColor);
      localStorage.setItem("overrideWeekType", overrideWeekType.toString());
      localStorage.setItem("manualWeekType", manualWeekType);
      localStorage.setItem("customTitle", customTitle);
      localStorage.setItem("selectedFont", selectedFont);
      localStorage.setItem("bagNotificationTime", bagNotificationTime);
      localStorage.setItem("notificationsEnabled", notificationsEnabled.toString());

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
          
          document.body.style.backgroundImage = `url(${publicUrl})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center';
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundAttachment = 'fixed';
        }
      }

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
          <TabsContent value="appearance">
            <AppearanceTab
              customTitle={customTitle}
              setCustomTitle={setCustomTitle}
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              fontColor={fontColor}
              setFontColor={setFontColor}
              handleBackgroundImageChange={handleBackgroundImageChange}
              currentBackgroundUrl={currentBackgroundUrl}
              overrideWeekType={overrideWeekType}
              setOverrideWeekType={setOverrideWeekType}
              manualWeekType={manualWeekType}
              setManualWeekType={setManualWeekType}
            />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsTab
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
              bagNotificationTime={bagNotificationTime}
              setBagNotificationTime={setBagNotificationTime}
            />
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