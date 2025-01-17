import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface NotificationsTabProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  bagNotificationTime: string;
  setBagNotificationTime: (value: string) => void;
}

export function NotificationsTab({
  notificationsEnabled,
  setNotificationsEnabled,
  bagNotificationTime,
  setBagNotificationTime,
}: NotificationsTabProps) {
  useEffect(() => {
    // Vérifier si le navigateur supporte les notifications
    if (!("Notification" in window)) {
      toast({
        title: "Notifications non supportées",
        description: "Votre navigateur ne supporte pas les notifications",
        variant: "destructive",
      });
      setNotificationsEnabled(false);
      return;
    }

    // Vérifier l'état actuel des permissions
    if (Notification.permission === "granted") {
      console.log("Notifications already permitted");
    }
  }, [setNotificationsEnabled]);

  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        // Demander la permission si pas encore accordée
        if (Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            toast({
              title: "Permission refusée",
              description: "Vous devez autoriser les notifications dans les paramètres de votre navigateur",
              variant: "destructive",
            });
            setNotificationsEnabled(false);
            return;
          }
        }

        // Enregistrer le service worker si pas déjà fait
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service Worker registered:', registration);

          // Planifier la notification
          if (registration.active) {
            registration.active.postMessage({
              type: 'SCHEDULE_NOTIFICATION',
              time: bagNotificationTime
            });
            
            toast({
              title: "Notifications activées",
              description: `Vous recevrez une notification quotidienne à ${bagNotificationTime}`,
            });
          }
        }
      }
      
      setNotificationsEnabled(enabled);
      localStorage.setItem("notificationsEnabled", enabled.toString());
      
    } catch (error) {
      console.error('Error setting up notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive",
      });
      setNotificationsEnabled(false);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setBagNotificationTime(newTime);
    localStorage.setItem("bagNotificationTime", newTime);
    
    if (notificationsEnabled && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          time: newTime
        });
      });
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notifications" className="text-right">
          Notifications du sac
        </Label>
        <div className="col-span-3">
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={handleNotificationToggle}
          />
        </div>
      </div>
      {notificationsEnabled && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notificationTime" className="text-right">
            Heure de notification
          </Label>
          <Input
            id="notificationTime"
            type="time"
            value={bagNotificationTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="col-span-3"
          />
        </div>
      )}
    </div>
  );
}