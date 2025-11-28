import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Bell, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const RemindersManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load upcoming appointments that need reminders
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          pets(name),
          profiles:pets(owner_id)
        `)
        .gte("appointment_date", new Date().toISOString())
        .order("appointment_date", { ascending: true })
        .limit(20);

      if (error) throw error;
      setAppointments(data || []);
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

  const saveWebhookUrl = () => {
    // In production, this would save to a settings table
    toast({
      title: "Webhook guardado",
      description: "Actualiza el edge function con esta URL",
    });
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
      <h2 className="text-2xl font-bold">Gestión de Recordatorios</h2>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de n8n Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook">URL del Webhook n8n</Label>
            <div className="flex gap-2">
              <Input
                id="webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://tu-n8n-instance.app/webhook/..."
              />
              <Button onClick={saveWebhookUrl}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Esta URL se usará para enviar recordatorios por email/SMS
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Instrucciones:</p>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Crea un workflow en n8n con un webhook trigger</li>
              <li>Configura acciones para enviar emails (Resend, SendGrid, etc.)</li>
              <li>Copia la URL del webhook y pégala arriba</li>
              <li>
                Actualiza el edge function send-reminders con la URL
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Próximas Citas (Recordatorios Pendientes)</h3>
        {appointments.map((apt) => (
          <Card key={apt.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    {apt.pets?.name || "Mascota"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {apt.appointment_type}
                  </p>
                </div>
                <Badge>
                  {format(new Date(apt.appointment_date), "PPP", { locale: es })}
                </Badge>
              </div>
            </CardHeader>
            {apt.reminder_sent ? (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Recordatorio enviado:{" "}
                  {format(new Date(apt.reminder_sent), "PPp", { locale: es })}
                </p>
              </CardContent>
            ) : (
              <CardContent>
                <Badge variant="secondary">Recordatorio pendiente</Badge>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
