import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface CourseMaterialsProps {
  materials: string[];
  setMaterials: (materials: string[]) => void;
  newMaterial: string;
  setNewMaterial: (material: string) => void;
}

export const CourseMaterials = ({
  materials,
  setMaterials,
  newMaterial,
  setNewMaterial,
}: CourseMaterialsProps) => {
  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials([...materials, newMaterial.trim()]);
      setNewMaterial("");
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Matériel nécessaire</label>
      <div className="flex gap-2">
        <Input
          value={newMaterial}
          onChange={(e) => setNewMaterial(e.target.value)}
          placeholder="Ex: Cahier, livre..."
          className="border-pink-200 focus-visible:ring-pink-200"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddMaterial();
            }
          }}
        />
        <Button
          type="button"
          onClick={handleAddMaterial}
          className="bg-pink-400 hover:bg-pink-500"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2 mt-2">
        {materials.map((material, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-pink-50 p-2 rounded-md"
          >
            <span>{material}</span>
            <button
              type="button"
              onClick={() => handleRemoveMaterial(index)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};