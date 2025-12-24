import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  AnimalPhoto?: { id: string; url: string; isPrimary: boolean }[];
}

// Map API species to display format
const speciesDisplayMap: Record<string, string> = {
  'perro': 'Perro',
  'gato': 'Gato',
  'otro': 'Otro',
};

// Map API sex to display format
const sexDisplayMap: Record<string, string> = {
  'macho': 'Macho',
  'hembra': 'Hembra',
  'desconocido': 'Desconocido',
};

export function PetCard({ pet, onDeleted }: { pet: Pet; onDeleted?: () => void }) {
  const speciesDisplay = speciesDisplayMap[pet.species] || pet.species;
  const sexDisplay = pet.sex ? sexDisplayMap[pet.sex] || pet.sex : null;

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    if (years === 0) return `${months} meses`;
    if (months < 0) return `${years - 1} años`;
    return `${years} años`;
  };

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) return;

    try {
      const { error } = await api.deletePet(pet.id);
      if (error) throw new Error(error);
      toast.success(`${pet.name} ha sido eliminado`);
      onDeleted?.();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar mascota");
    }
  };

  // Get primary photo or first photo
  const photoUrl = pet.AnimalPhoto?.find(p => p.isPrimary)?.url || pet.AnimalPhoto?.[0]?.url;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-muted relative">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={pet.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {speciesDisplay === "Perro" && "🐕"}
            {speciesDisplay === "Gato" && "🐈"}
            {!["Perro", "Gato"].includes(speciesDisplay) && "🐾"}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg mb-1">{pet.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {pet.breed ? `${pet.breed} · ` : ""}{speciesDisplay}
            {sexDisplay && ` · ${sexDisplay}`}
          </p>
          {calculateAge(pet.birthDate) && (
            <p className="text-sm text-muted-foreground">
              {calculateAge(pet.birthDate)}
            </p>
          )}
          {pet.weight && (
            <p className="text-sm text-muted-foreground">
              {pet.weight} kg
            </p>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full gap-2">
          <Calendar className="h-4 w-4" />
          Pedir Cita
        </Button>
      </CardContent>
    </Card>
  );
}
