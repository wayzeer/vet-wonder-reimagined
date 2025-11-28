import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AppointmentFormProps {
  selectedDate?: Date;
  onSuccess?: () => void;
}

export function AppointmentForm({ selectedDate, onSuccess }: AppointmentFormProps) {
  const [pets, setPets] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pet_id: "",
    clinic_id: "",
    appointment_type: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [petsResponse, clinicsResponse] = await Promise.all([
        supabase.from('pets').select('*').eq('owner_id', user.id),
        supabase.from('clinics').select('*'),
      ]);

      if (petsResponse.data) setPets(petsResponse.data);
      if (clinicsResponse.data) setClinics(clinicsResponse.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Por favor, selecciona una fecha");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const [hours, minutes] = formData.time.split(':');
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await supabase.from('appointments').insert({
        client_id: user.id,
        pet_id: formData.pet_id,
        clinic_id: formData.clinic_id,
        appointment_type: formData.appointment_type,
        appointment_date: appointmentDate.toISOString(),
        notes: formData.notes || null,
        status: 'pending',
      });

      if (error) throw error;

      toast.success("¡Cita reservada con éxito! Te confirmaremos por email");
      setFormData({
        pet_id: "",
        clinic_id: "",
        appointment_type: "",
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

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30"
  ];

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

          <div>
            <Label htmlFor="pet">Mascota *</Label>
            <Select
              value={formData.pet_id}
              onValueChange={(value) => setFormData({ ...formData, pet_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu mascota" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} ({pet.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="clinic">Clínica *</Label>
            <Select
              value={formData.clinic_id}
              onValueChange={(value) => setFormData({ ...formData, clinic_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona clínica" />
              </SelectTrigger>
              <SelectContent>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Tipo de consulta *</Label>
            <Select
              value={formData.appointment_type}
              onValueChange={(value) => setFormData({ ...formData, appointment_type: value })}
              required
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
            <Label htmlFor="time">Hora *</Label>
            <Select
              value={formData.time}
              onValueChange={(value) => setFormData({ ...formData, time: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona hora" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Motivo de la consulta / Síntomas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe brevemente el motivo de la consulta..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading || !selectedDate} className="w-full">
            {loading ? "Reservando..." : "Confirmar Cita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
