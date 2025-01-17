import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

interface AppearanceTabProps {
  customTitle: string;
  setCustomTitle: (value: string) => void;
  selectedFont: string;
  setSelectedFont: (value: string) => void;
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
  fontColor: string;
  setFontColor: (value: string) => void;
  handleBackgroundImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentBackgroundUrl: string;
  overrideWeekType: boolean;
  setOverrideWeekType: (value: boolean) => void;
  manualWeekType: "A" | "B";
  setManualWeekType: (value: "A" | "B") => void;
}

export function AppearanceTab({
  customTitle,
  setCustomTitle,
  selectedFont,
  setSelectedFont,
  backgroundColor,
  setBackgroundColor,
  fontColor,
  setFontColor,
  handleBackgroundImageChange,
  currentBackgroundUrl,
  overrideWeekType,
  setOverrideWeekType,
  manualWeekType,
  setManualWeekType,
}: AppearanceTabProps) {
  return (
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
  );
}