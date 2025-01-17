import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

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
  return (
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
  );
}