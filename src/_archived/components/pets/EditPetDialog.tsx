import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  sex?: string;
  weight?: number;
  notes?: string;
}

interface EditPetDialogProps {
  pet: Pet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPetUpdated?: () => void;
}

// Map API species to UI format
const speciesUIMap: Record<string, string> = {
  'perro': 'Perro',
  'gato': 'Gato',
  'otro': 'Otro',
};

// Map UI species to API format
const speciesMap: Record<string, 'perro' | 'gato' | 'otro'> = {
  'Perro': 'perro',
  'Gato': 'gato',
  'Ave': 'otro',
  'Reptil': 'otro',
  'Roedor': 'otro',
  'Otro': 'otro',
};

// Map API sex to UI format
const sexUIMap: Record<string, string> = {
  'macho': 'Macho',
  'hembra': 'Hembra',
  'desconocido': '',
};

// Map UI sex to API format
const sexMap: Record<string, 'macho' | 'hembra' | 'desconocido'> = {
  'Macho': 'macho',
  'Hembra': 'hembra',
};

export function EditPetDialog({ pet, open, onOpenChange, onPetUpdated }: EditPetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    sex: "",
    birthDate: "",
    weight: "",
    notes: "",
  });

  // Initialize form data when pet changes or dialog opens
  useEffect(() => {
    if (pet && open) {
      setFormData({
        name: pet.name || "",
        species: speciesUIMap[pet.species] || pet.species || "",
        breed: pet.breed || "",
        sex: pet.sex ? sexUIMap[pet.sex] || pet.sex : "",
        birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : "",
        weight: pet.weight ? String(pet.weight) : "",
        notes: pet.notes || "",
      });
    }
  }, [pet, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await api.updatePet(pet.id, {
        name: formData.name,
        species: speciesMap[formData.species] || 'otro',
        breed: formData.breed || undefined,
        sex: formData.sex ? sexMap[formData.sex] : undefined,
        birthDate: formData.birthDate || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        notes: formData.notes || undefined,
      });

      if (error) throw new Error(error);

      toast.success("Mascota actualizada con exito!");
      onOpenChange(false);
      onPetUpdated?.();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar mascota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Mascota</DialogTitle>
          <DialogDescription>Modifica la informacion de tu mascota</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="species">Especie *</Label>
              <Select
                value={formData.species}
                onValueChange={(value) => setFormData({ ...formData, species: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Ave">Ave</SelectItem>
                  <SelectItem value="Reptil">Reptil</SelectItem>
                  <SelectItem value="Roedor">Roedor</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="breed">Raza</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Ej: Labrador, Siames..."
              />
            </div>

            <div>
              <Label htmlFor="sex">Sexo</Label>
              <Select
                value={formData.sex}
                onValueChange={(value) => setFormData({ ...formData, sex: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Ej: 15.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Alergias, comportamiento, medicaciones..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
