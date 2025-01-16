import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CustomizationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  secondaryColor: string;
  onSecondaryColorChange: (color: string) => void;
  notificationsEnabled: boolean;
  onNotificationsEnabledChange: (enabled: boolean) => void;
  notificationTime: string;
  onNotificationTimeChange: (time: string) => void;
  userName: string;
  onUserNameChange: (name: string) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  fontColor: string;
  onFontColorChange: (color: string) => void;
  backgroundImage: string | null;
  onBackgroundImageChange: (url: string | null) => void;
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
  notificationsEnabled,
  onNotificationsEnabledChange,
  notificationTime,
  onNotificationTimeChange,
  userName,
  onUserNameChange,
  backgroundColor,
  onBackgroundColorChange,
  fontColor,
  onFontColorChange,
  backgroundImage,
  onBackgroundImageChange,
}: CustomizationProps) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localPrimaryColor, setLocalPrimaryColor] = useState(primaryColor);
  const [localSecondaryColor, setLocalSecondaryColor] = useState(secondaryColor);
  const [localNotificationsEnabled, setLocalNotificationsEnabled] = useState(notificationsEnabled);
  const [localNotificationTime, setLocalNotificationTime] = useState(notificationTime);
  const [localUserName, setLocalUserName] = useState(userName);
  const [localBackgroundColor, setLocalBackgroundColor] = useState(backgroundColor);
  const [localFontColor, setLocalFontColor] = useState(fontColor);
  const [isIOS, setIsIOS] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(filePath);

      onBackgroundImageChange(publicUrl);
      toast({
        title: "Image uploaded successfully",
        description: "Your background image has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveBackground = () => {
    onBackgroundImageChange(null);
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setLocalNotificationsEnabled(true);
        toast({
          title: "Notifications activées",
          description: "Vous recevrez des notifications pour préparer votre sac",
        });
      } else {
        setLocalNotificationsEnabled(false);
        toast({
          title: "Notifications refusées",
          description: "Vous ne recevrez pas de notifications. Vous pouvez changer cela dans les paramètres de votre navigateur.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive",
      });
    }
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (isIOS) {
      toast({
        title: "Notifications non disponibles",
        description: "Les notifications ne sont pas supportées sur iOS. Cette fonctionnalité est disponible sur Android et les navigateurs web desktop.",
        variant: "destructive",
      });
      return;
    }

    if (checked && Notification.permission !== "granted") {
      await requestNotificationPermission();
    } else {
      setLocalNotificationsEnabled(checked);
    }
  };

  const handleSave = () => {
    onTitleChange(localTitle);
    onPrimaryColorChange(localPrimaryColor);
    onSecondaryColorChange(localSecondaryColor);
    onNotificationsEnabledChange(localNotificationsEnabled);
    onNotificationTimeChange(localNotificationTime);
    onUserNameChange(localUserName);
    onBackgroundColorChange(localBackgroundColor);
    onFontColorChange(localFontColor);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personnalisation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="userName">Prénom</Label>
            <Input
              id="userName"
              value={localUserName}
              onChange={(e) => setLocalUserName(e.target.value)}
              placeholder="Ton prénom"
            />
          </div>
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
          <div className="grid gap-2">
            <Label htmlFor="backgroundColor">Couleur de fond</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={localBackgroundColor}
                onChange={(e) => setLocalBackgroundColor(e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                value={localBackgroundColor}
                onChange={(e) => setLocalBackgroundColor(e.target.value)}
                placeholder="#FFFFFF"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fontColor">Couleur du texte</Label>
            <div className="flex gap-2">
              <Input
                id="fontColor"
                type="color"
                value={localFontColor}
                onChange={(e) => setLocalFontColor(e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                value={localFontColor}
                onChange={(e) => setLocalFontColor(e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Image de fond</Label>
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              {backgroundImage && (
                <Button
                  variant="outline"
                  onClick={handleRemoveBackground}
                  className="mt-2"
                >
                  Supprimer l'image de fond
                </Button>
              )}
            </div>
          </div>
          <div 
            className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => handleNotificationToggle(!localNotificationsEnabled)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNotificationToggle(!localNotificationsEnabled);
              }
            }}
          >
            <Label htmlFor="notifications" className="cursor-pointer select-none">
              Notifications de préparation du sac
              {isIOS && (
                <span className="block text-xs text-red-500 mt-1">
                  Non disponible sur iOS
                </span>
              )}
            </Label>
            <Switch
              id="notifications"
              checked={localNotificationsEnabled}
              onCheckedChange={handleNotificationToggle}
              disabled={isIOS}
            />
          </div>
          {localNotificationsEnabled && !isIOS && (
            <div className="grid gap-2">
              <Label htmlFor="notificationTime">Heure de notification</Label>
              <Input
                id="notificationTime"
                type="time"
                value={localNotificationTime}
                onChange={(e) => setLocalNotificationTime(e.target.value)}
              />
            </div>
          )}
        </div>
        <Button onClick={handleSave}>Sauvegarder</Button>
      </DialogContent>
    </Dialog>
  );
};