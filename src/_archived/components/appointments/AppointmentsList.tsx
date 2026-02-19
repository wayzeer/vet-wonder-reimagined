import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

// Map API status to display
const statusDisplayMap: Record<string, { text: string; color: string }> = {
  'programada': { text: 'Programada', color: 'bg-yellow-500' },
  'confirmada': { text: 'Confirmada', color: 'bg-green-500' },
  'completada': { text: 'Completada', color: 'bg-blue-500' },
  'cancelada': { text: 'Cancelada', color: 'bg-red-500' },
  'en_curso': { text: 'En Curso', color: 'bg-purple-500' },
  'no_asistio': { text: 'No Asistió', color: 'bg-gray-500' },
};

// Map API type to display
const typeDisplayMap: Record<string, string> = {
  'consulta': 'Consulta general',
  'vacunacion': 'Vacunación',
  'cirugia': 'Cirugía',
  'revision': 'Revisión',
  'urgencia': 'Urgencia',
  'otro': 'Otro',
};

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const { data, error } = await api.getAppointments();
      if (error) throw new Error(error);
      setAppointments(data?.appointments || []);
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
      const { error } = await api.cancelAppointment(id);
      if (error) throw new Error(error);
      toast.success("Cita cancelada");
      loadAppointments();
    } catch (error: any) {
      toast.error(error.message || "Error al cancelar cita");
    }
  };

  const getStatusInfo = (status: string) => {
    return statusDisplayMap[status] || { text: status, color: 'bg-gray-500' };
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.scheduledAt) >= new Date() && !['cancelada', 'completada'].includes(apt.status)
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.scheduledAt) < new Date() || ['completada', 'cancelada'].includes(apt.status)
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
            {upcomingAppointments.map((apt) => {
              const statusInfo = getStatusInfo(apt.status);
              return (
                <Card key={apt.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={statusInfo.color}>
                            {statusInfo.text}
                          </Badge>
                          <span className="font-semibold">
                            {typeDisplayMap[apt.type] || apt.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(apt.scheduledAt), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {format(new Date(apt.scheduledAt), "HH:mm")}
                        </div>
                        {apt.Animal && (
                          <p className="text-sm">
                            <strong>Mascota:</strong> {apt.Animal.name} ({apt.Animal.species})
                          </p>
                        )}
                        {apt.User && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Veterinario:</strong> {apt.User.name}
                          </p>
                        )}
                        {apt.notes && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Notas:</strong> {apt.notes}
                          </p>
                        )}
                      </div>
                      {['programada', 'confirmada'].includes(apt.status) && (
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
              );
            })}
          </div>
        )}
      </div>

      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Historial</h3>
          <div className="space-y-4">
            {pastAppointments.map((apt) => {
              const statusInfo = getStatusInfo(apt.status);
              return (
                <Card key={apt.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusInfo.color}>
                        {statusInfo.text}
                      </Badge>
                      <span className="font-semibold">
                        {typeDisplayMap[apt.type] || apt.type}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(apt.scheduledAt), "d 'de' MMMM 'de' yyyy - HH:mm", { locale: es })}
                      {apt.Animal && ` - ${apt.Animal.name}`}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
