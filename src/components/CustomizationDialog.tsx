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
}: CustomizationProps) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localPrimaryColor, setLocalPrimaryColor] = useState(primaryColor);
  const [localSecondaryColor, setLocalSecondaryColor] = useState(secondaryColor);
  const [localNotificationsEnabled, setLocalNotificationsEnabled] = useState(notificationsEnabled);
  const [localNotificationTime, setLocalNotificationTime] = useState(notificationTime);
  const [localUserName, setLocalUserName] = useState(userName);

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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
            </Label>
            <Switch
              id="notifications"
              checked={localNotificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
          {localNotificationsEnabled && (
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