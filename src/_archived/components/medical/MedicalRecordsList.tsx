import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
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
  const { isAuthenticated } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadPetsAndRecords();
    }
  }, [isAuthenticated]);

  const loadPetsAndRecords = async () => {
    try {
      // Load pets from API
      const { data: petsResponse, error: petsError } = await api.getPets();

      if (petsError) throw new Error(petsError);
      const petsData = petsResponse?.pets || [];
      setPets(petsData.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })));

      if (petsData.length > 0) {
        setSelectedPetId(petsData[0].id);

        // Load medical history from API
        const { data: historyResponse, error: historyError } = await api.getMedicalHistory();

        if (historyError) throw new Error(historyError);

        // Transform API response to match component's expected format
        const medicalHistory = historyResponse?.medicalHistory || {};
        const allRecords: MedicalRecord[] = [];

        // Process consultations
        if (medicalHistory.consultations) {
          medicalHistory.consultations.forEach((c: { id: string; date: string; reason?: string; diagnosis?: string; treatment?: string; notes?: string; animalId: string }) => {
            allRecords.push({
              id: c.id,
              title: c.reason || 'Consulta',
              record_type: 'consultation',
              description: c.notes || null,
              diagnosis: c.diagnosis || null,
              treatment: c.treatment || null,
              prescription: null,
              created_at: c.date,
              pet_id: c.animalId,
            });
          });
        }

        // Process vaccinations
        if (medicalHistory.vaccinations) {
          medicalHistory.vaccinations.forEach((v: { id: string; date: string; vaccine: string; batch?: string; animalId: string }) => {
            allRecords.push({
              id: v.id,
              title: v.vaccine,
              record_type: 'vaccination',
              description: v.batch ? `Lote: ${v.batch}` : null,
              diagnosis: null,
              treatment: null,
              prescription: null,
              created_at: v.date,
              pet_id: v.animalId,
            });
          });
        }

        // Process dewormings
        if (medicalHistory.dewormings) {
          medicalHistory.dewormings.forEach((d: { id: string; date: string; product: string; weight?: number; animalId: string }) => {
            allRecords.push({
              id: d.id,
              title: d.product,
              record_type: 'deworming',
              description: d.weight ? `Peso: ${d.weight} kg` : null,
              diagnosis: null,
              treatment: null,
              prescription: null,
              created_at: d.date,
              pet_id: d.animalId,
            });
          });
        }

        // Sort by date descending
        allRecords.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecords(allRecords);
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
