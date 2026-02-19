import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  notes: string | null;
  pet_id?: string;
  pets?: { name: string; owner_id: string };
}

interface GuestAppointment {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  pet_name: string;
  pet_species: string;
  appointment_type: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export const AppointmentsManager = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [guestAppointments, setGuestAppointments] = useState<GuestAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // Load regular appointments
      const { data: regularData, error: regularError } = await supabase
        .from("appointments")
        .select(`
          *,
          pets(name, owner_id)
        `)
        .order("appointment_date", { ascending: true });

      if (regularError) throw regularError;

      // Load guest appointments
      const { data: guestData, error: guestError } = await supabase
        .from("guest_appointments")
        .select("*")
        .order("preferred_date", { ascending: true });

      if (guestError) throw guestError;

      setAppointments(regularData || []);
      setGuestAppointments(guestData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, isGuest: boolean) => {
    try {
      const table = isGuest ? "guest_appointments" : "appointments";
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Estado actualizado" });
      loadAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      confirmed: "default",
      completed: "default",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      completed: "Completada",
      cancelled: "Cancelada",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Citas</h2>

      {guestAppointments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Citas de Invitados
          </h3>
          {guestAppointments.map((apt) => (
            <Card key={apt.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {apt.guest_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {apt.guest_email} {apt.guest_phone && `• ${apt.guest_phone}`}
                    </p>
                    <p className="text-sm">
                      Mascota: <strong>{apt.pet_name}</strong> ({apt.pet_species})
                    </p>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(apt.preferred_date), "PPP", { locale: es })} •{" "}
                    {apt.preferred_time}
                  </div>
                  <p className="text-sm">
                    <strong>Tipo:</strong> {apt.appointment_type}
                  </p>
                  {apt.notes && (
                    <p className="text-sm text-muted-foreground">{apt.notes}</p>
                  )}
                  <div className="pt-2">
                    <Select
                      value={apt.status}
                      onValueChange={(value) => updateStatus(apt.id, value, true)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="confirmed">Confirmada</SelectItem>
                        <SelectItem value="completed">Completada</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Citas de Usuarios Registrados
        </h3>
        {appointments.map((apt) => (
          <Card key={apt.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {apt.pets?.name || "Mascota"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {apt.appointment_type}
                  </p>
                </div>
                {getStatusBadge(apt.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(apt.appointment_date), "PPP", { locale: es })}
                </div>
                {apt.notes && (
                  <p className="text-sm text-muted-foreground">{apt.notes}</p>
                )}
                <div className="pt-2">
                  <Select
                    value={apt.status}
                    onValueChange={(value) => updateStatus(apt.id, value, false)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
