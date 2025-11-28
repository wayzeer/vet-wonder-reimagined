import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, MoreVertical, Trash2, Sparkles, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  date_of_birth?: string;
  photo_url?: string;
  gender?: string;
}

export function PetCard({ pet, onDeleted }: { pet: Pet; onDeleted?: () => void }) {
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [advice, setAdvice] = useState("");
  const [daysUntilNext, setDaysUntilNext] = useState(0);

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
      const { error } = await supabase.from('pets').delete().eq('id', pet.id);
      if (error) throw error;
      toast.success(`${pet.name} ha sido eliminado`);
      onDeleted?.();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar mascota");
    }
  };

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const { data, error } = await supabase.functions.invoke('pet-advice', {
        body: { petId: pet.id }
      });

      if (error) throw error;

      setAdvice(data.advice);
      setDaysUntilNext(data.daysUntilNext);
      setShowAdvice(true);

      if (data.cached) {
        toast.info(`Próximos consejos disponibles en ${data.daysUntilNext} días`);
      } else {
        toast.success("Consejos generados correctamente");
      }
    } catch (error: any) {
      toast.error(error.message || "No se pudieron obtener consejos");
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-muted relative">
          {pet.photo_url ? (
            <img
              src={pet.photo_url}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {pet.species === "Perro" && "🐕"}
              {pet.species === "Gato" && "🐈"}
              {pet.species === "Ave" && "🦜"}
              {pet.species === "Reptil" && "🦎"}
              {pet.species === "Roedor" && "🐹"}
              {!["Perro", "Gato", "Ave", "Reptil", "Roedor"].includes(pet.species) && "🐾"}
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
              {pet.breed ? `${pet.breed} · ` : ""}{pet.species}
              {pet.gender && ` · ${pet.gender}`}
            </p>
            {calculateAge(pet.date_of_birth) && (
              <p className="text-sm text-muted-foreground">
                {calculateAge(pet.date_of_birth)}
              </p>
            )}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:bg-primary/20"
            onClick={handleGetAdvice}
            disabled={loadingAdvice}
          >
            {loadingAdvice ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Consejos IA
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" className="w-full gap-2">
            <Calendar className="h-4 w-4" />
            Pedir Cita
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showAdvice} onOpenChange={setShowAdvice}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Consejos personalizados para {pet.name}
            </DialogTitle>
            <DialogDescription>
              Próximos consejos disponibles en {daysUntilNext} días
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{advice}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
