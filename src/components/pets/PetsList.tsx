import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PetCard } from "./PetCard";
import { AddPetDialog } from "./AddPetDialog";
import { Loader2 } from "lucide-react";

export function PetsList() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      console.error("Error cargando mascotas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mis Mascotas</h2>
          <p className="text-muted-foreground">Gestiona la información de tus compañeros</p>
        </div>
        <AddPetDialog onPetAdded={loadPets} />
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No tienes mascotas registradas todavía</p>
          <AddPetDialog onPetAdded={loadPets} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onDeleted={loadPets} />
          ))}
        </div>
      )}
    </div>
  );
}
