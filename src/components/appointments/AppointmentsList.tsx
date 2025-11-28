import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (name, species),
          clinics (name, address, phone)
        `)
        .eq('client_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error("Error cargando citas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres cancelar esta cita?")) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      toast.success("Cita cancelada");
      loadAppointments();
    } catch (error: any) {
      toast.error(error.message || "Error al cancelar cita");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) < new Date() || apt.status === 'completed' || apt.status === 'cancelled'
  );

  if (loading) return <div className="text-center py-8">Cargando citas...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Próximas Citas</h3>
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No tienes citas programadas
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(apt.status)}>
                          {getStatusText(apt.status)}
                        </Badge>
                        <span className="font-semibold">{apt.appointment_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(apt.appointment_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {format(new Date(apt.appointment_date), "HH:mm")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {apt.clinics?.name}
                      </div>
                      <p className="text-sm">
                        <strong>Mascota:</strong> {apt.pets?.name} ({apt.pets?.species})
                      </p>
                      {apt.notes && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Notas:</strong> {apt.notes}
                        </p>
                      )}
                    </div>
                    {apt.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancel(apt.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Historial</h3>
          <div className="space-y-4">
            {pastAppointments.map((apt) => (
              <Card key={apt.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(apt.status)}>
                      {getStatusText(apt.status)}
                    </Badge>
                    <span className="font-semibold">{apt.appointment_type}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(apt.appointment_date), "d 'de' MMMM 'de' yyyy - HH:mm", { locale: es })} - {apt.pets?.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
