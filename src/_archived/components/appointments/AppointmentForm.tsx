import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AppointmentFormProps {
  selectedDate?: Date;
  availableSlots?: string[];
  isClosed?: boolean;
  onSuccess?: () => void;
  initialAnimalId?: string;
  clinicId?: string;
}

// Map UI type to API type
const typeMap: Record<string, 'consulta' | 'vacunacion' | 'cirugia' | 'revision' | 'urgencia' | 'otro'> = {
  'Consulta general': 'consulta',
  'Vacunación': 'vacunacion',
  'Revisión': 'revision',
  'Urgencia': 'urgencia',
  'Cirugía': 'cirugia',
  'Peluquería': 'otro',
};

export function AppointmentForm({ selectedDate, availableSlots, isClosed, onSuccess, initialAnimalId, clinicId }: AppointmentFormProps) {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    animalId: initialAnimalId || "",
    appointmentType: "",
    time: "",
    notes: "",
  });

  // Update animalId if initialAnimalId changes
  useEffect(() => {
    if (initialAnimalId) {
      setFormData(prev => ({ ...prev, animalId: initialAnimalId }));
    }
  }, [initialAnimalId]);

  useEffect(() => {
    loadPets();
  }, []);

  // Update slots when availableSlots prop changes or when date changes
  useEffect(() => {
    if (availableSlots !== undefined) {
      setSlots(availableSlots);
      // Reset time selection if current time is no longer available
      if (formData.time && !availableSlots.includes(formData.time)) {
        setFormData(prev => ({ ...prev, time: "" }));
      }
    } else if (selectedDate) {
      // Fetch slots if not provided via prop
      loadSlotsForDate(selectedDate);
    }
  }, [availableSlots, selectedDate]);

  const loadPets = async () => {
    try {
      const { data, error } = await api.getPets();
      if (error) throw new Error(error);
      setPets(data?.pets || []);
    } catch (error) {
      console.error("Error cargando mascotas:", error);
    }
  };

  const loadSlotsForDate = async (date: Date) => {
    setLoadingSlots(true);
    try {
      const dateStr = date.toISOString().split("T")[0];
      const { data, error } = await api.getAvailability(dateStr, clinicId);
      if (error) throw new Error(error);
      setSlots(data?.availableSlots || []);
    } catch (error) {
      console.error("Error cargando disponibilidad:", error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Por favor, selecciona una fecha");
      return;
    }

    if (!formData.time) {
      toast.error("Por favor, selecciona una hora");
      return;
    }

    setLoading(true);
    try {
      const [hours, minutes] = formData.time.split(':');
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { data, error } = await api.createAppointment({
        animalId: formData.animalId,
        scheduledAt: appointmentDate.toISOString(),
        type: typeMap[formData.appointmentType] || 'consulta',
        notes: formData.notes || undefined,
        clinicId: clinicId,
      });

      if (error) throw new Error(error);

      toast.success("¡Cita solicitada con éxito! Te confirmaremos pronto.");
      setFormData({
        animalId: "",
        appointmentType: "",
        time: "",
        notes: "",
      });
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Error al reservar cita");
    } finally {
      setLoading(false);
    }
  };

  // Map species for display
  const speciesDisplay: Record<string, string> = {
    'perro': 'Perro',
    'gato': 'Gato',
    'otro': 'Otro',
  };

  const isDateClosed = isClosed || false;
  const hasAvailableSlots = slots.length > 0;
  const canSubmit = selectedDate && !isDateClosed && hasAvailableSlots && pets.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de la cita</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedDate && (
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">
                {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
            </div>
          )}

          {isDateClosed && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                La clínica está cerrada en esta fecha. Por favor selecciona otro día.
              </AlertDescription>
            </Alert>
          )}

          {!isDateClosed && selectedDate && !hasAvailableSlots && !loadingSlots && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay huecos disponibles para esta fecha. Por favor selecciona otro día.
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="pet">Mascota *</Label>
            <Select
              value={formData.animalId}
              onValueChange={(value) => setFormData({ ...formData, animalId: value })}
              disabled={!canSubmit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu mascota" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} ({speciesDisplay[pet.species] || pet.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {pets.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                No tienes mascotas registradas. Añade una primero.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Tipo de consulta *</Label>
            <Select
              value={formData.appointmentType}
              onValueChange={(value) => setFormData({ ...formData, appointmentType: value })}
              disabled={!canSubmit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consulta general">Consulta general</SelectItem>
                <SelectItem value="Vacunación">Vacunación</SelectItem>
                <SelectItem value="Revisión">Revisión</SelectItem>
                <SelectItem value="Urgencia">Urgencia</SelectItem>
                <SelectItem value="Cirugía">Cirugía</SelectItem>
                <SelectItem value="Peluquería">Peluquería</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time">
              Hora disponible *
              {loadingSlots && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />}
            </Label>
            <Select
              value={formData.time}
              onValueChange={(value) => setFormData({ ...formData, time: value })}
              disabled={!canSubmit || loadingSlots}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  loadingSlots ? "Cargando..." :
                  !hasAvailableSlots ? "Sin disponibilidad" :
                  "Selecciona hora"
                } />
              </SelectTrigger>
              <SelectContent>
                {slots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasAvailableSlots && (
              <p className="text-xs text-muted-foreground mt-1">
                {slots.length} huecos disponibles
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Motivo de la consulta / Síntomas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe brevemente el motivo de la consulta..."
              rows={3}
              disabled={!canSubmit}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !canSubmit || !formData.animalId || !formData.appointmentType || !formData.time}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reservando...
              </>
            ) : (
              "Solicitar Cita"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
