import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MedicalRecordCard } from "./MedicalRecordCard";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MedicalRecord {
  id: string;
  title: string;
  record_type: string;
  description: string | null;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  created_at: string;
  pet_id: string;
}

interface Pet {
  id: string;
  name: string;
}

export const MedicalRecordsList = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    loadPetsAndRecords();
  }, []);

  const loadPetsAndRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load pets
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("id, name")
        .eq("owner_id", user.id)
        .order("name");

      if (petsError) throw petsError;
      setPets(petsData || []);

      if (petsData && petsData.length > 0) {
        setSelectedPetId(petsData[0].id);

        // Load medical records for all pets
        const { data: recordsData, error: recordsError } = await supabase
          .from("medical_records")
          .select("*")
          .in("pet_id", petsData.map(p => p.id))
          .order("created_at", { ascending: false });

        if (recordsError) throw recordsError;
        setRecords(recordsData || []);
      }
    } catch (error) {
      console.error("Error loading records:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No tienes mascotas registradas.</p>
        <p className="text-sm mt-2">Añade una mascota en la pestaña "Mis Mascotas".</p>
      </div>
    );
  }

  const filteredRecords = selectedPetId
    ? records.filter(r => r.pet_id === selectedPetId)
    : records;

  return (
    <div className="space-y-6">
      <Tabs value={selectedPetId || ""} onValueChange={setSelectedPetId}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${pets.length}, 1fr)` }}>
          {pets.map(pet => (
            <TabsTrigger key={pet.id} value={pet.id}>
              {pet.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {pets.map(pet => (
          <TabsContent key={pet.id} value={pet.id} className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay registros médicos para {pet.name}.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRecords.map(record => (
                  <MedicalRecordCard key={record.id} record={record} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
