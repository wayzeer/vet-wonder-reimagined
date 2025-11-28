import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Loader2 } from "lucide-react";

interface GuestAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GuestAppointmentDialog = ({
  open,
  onOpenChange,
}: GuestAppointmentDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"choice" | "guest" | "success">("choice");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    petName: "",
    petSpecies: "",
    appointmentType: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the first clinic (in production, you'd select the right one)
      const { data: clinics } = await supabase
        .from("clinics")
        .select("id")
        .limit(1)
        .single();

      if (!clinics) {
        throw new Error("No clinic found");
      }

      const { error } = await supabase.from("guest_appointments").insert({
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        pet_name: formData.petName,
        pet_species: formData.petSpecies,
        appointment_type: formData.appointmentType,
        preferred_date: `${formData.preferredDate}T${formData.preferredTime}:00`,
        preferred_time: formData.preferredTime,
        notes: formData.notes,
        clinic_id: clinics.id,
      });

      if (error) throw error;

      setStep("success");
      toast({
        title: "¡Cita solicitada!",
        description: "Nos pondremos en contacto contigo pronto para confirmar.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la cita",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  const resetAndClose = () => {
    setStep("choice");
    setFormData({
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      petName: "",
      petSpecies: "",
      appointmentType: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === "choice" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Pedir una cita</DialogTitle>
              <DialogDescription>
                ¿Tienes cuenta con nosotros?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => navigate("/auth")}
                className="w-full"
                size="lg"
              >
                Sí, iniciar sesión
              </Button>
              <Button
                onClick={() => setStep("guest")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                No, pedir cita como invitado
              </Button>
              <p className="text-sm text-muted-foreground text-center pt-2">
                ¡No te preocupes! Puedes pedir cita sin crear una cuenta.
              </p>
            </div>
          </>
        )}

        {step === "guest" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Cita como invitado</DialogTitle>
              <DialogDescription>
                Rellena los datos y nos pondremos en contacto contigo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGuestSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="guestName">Nombre completo *</Label>
                <Input
                  id="guestName"
                  required
                  value={formData.guestName}
                  onChange={(e) =>
                    setFormData({ ...formData, guestName: e.target.value })
                  }
                  placeholder="Tu nombre"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email *</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, guestEmail: e.target.value })
                  }
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPhone">Teléfono</Label>
                <Input
                  id="guestPhone"
                  type="tel"
                  value={formData.guestPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, guestPhone: e.target.value })
                  }
                  placeholder="651 50 38 27"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="petName">Nombre de la mascota *</Label>
                <Input
                  id="petName"
                  required
                  value={formData.petName}
                  onChange={(e) =>
                    setFormData({ ...formData, petName: e.target.value })
                  }
                  placeholder="Nombre de tu mascota"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="petSpecies">Especie *</Label>
                <Select
                  required
                  value={formData.petSpecies}
                  onValueChange={(value) =>
                    setFormData({ ...formData, petSpecies: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona especie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Perro</SelectItem>
                    <SelectItem value="cat">Gato</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentType">Tipo de consulta *</Label>
                <Select
                  required
                  value={formData.appointmentType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, appointmentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkup">Revisión</SelectItem>
                    <SelectItem value="vaccination">Vacunación</SelectItem>
                    <SelectItem value="emergency">Urgencia</SelectItem>
                    <SelectItem value="consultation">Consulta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Fecha preferida *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Hora *</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    required
                    value={formData.preferredTime}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas/Síntomas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Describe los síntomas o motivo de la consulta"
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Solicitar cita
                  </>
                )}
              </Button>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">
                ¡Cita solicitada! ✅
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                Nos pondremos en contacto contigo pronto para confirmar la cita.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-center mb-3">
                  ¿Quieres crear una cuenta para gestionar tus citas más fácilmente?
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Solo te enviaremos recordatorios de citas, ¡nada de spam!
                </p>
              </div>
              <Button onClick={handleCreateAccount} className="w-full">
                Crear cuenta
              </Button>
              <Button
                onClick={resetAndClose}
                variant="outline"
                className="w-full"
              >
                Cerrar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
