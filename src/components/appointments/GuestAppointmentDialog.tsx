import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useHoneypot } from "@/hooks/useHoneypot";
import { logSecurityEvent } from "@/lib/security-logger";
import {
  isClinicClosed,
  getAvailableTimeSlotsForDate,
  getClosureReason,
  isTimeSlotPassed,
} from "@/lib/businessHours";
import { z } from "zod";
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
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Validation schema
const guestAppointmentSchema = z.object({
  guestName: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  guestEmail: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "El email no puede exceder 255 caracteres"),
  guestPhone: z.string()
    .trim()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .optional(),
  petName: z.string()
    .trim()
    .min(1, "El nombre de la mascota es requerido")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  petSpecies: z.string()
    .min(1, "La especie es requerida"),
  appointmentType: z.string()
    .min(1, "El tipo de consulta es requerido"),
  preferredDate: z.string()
    .min(1, "La fecha es requerida"),
  preferredTime: z.string()
    .min(1, "La hora es requerida"),
  notes: z.string()
    .trim()
    .max(1000, "Las notas no pueden exceder 1000 caracteres")
    .optional(),
});

type GuestAppointmentForm = z.infer<typeof guestAppointmentSchema>;

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

  // Rate limiting: 3 intentos cada 15 minutos
  const { checkRateLimit, isRateLimited, remainingTime } = useRateLimit({
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutos
    storageKey: 'guest_appointment_rate_limit',
  });

  // Honeypot anti-bot
  const { honeypotField, honeypotValue, setHoneypotValue, checkHoneypot } = useHoneypot({
    fieldName: 'company_website',
    minSubmitTime: 2000,
  });

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

  // Compute available time slots based on selected date
  const availableTimeSlots = useMemo(() => {
    if (!formData.preferredDate) return [];
    const date = new Date(formData.preferredDate);
    const slots = getAvailableTimeSlotsForDate(date);

    // Filter out past slots if selecting today
    const today = new Date().toISOString().split("T")[0];
    if (formData.preferredDate === today) {
      return slots.filter(slot => !isTimeSlotPassed(date, slot));
    }
    return slots;
  }, [formData.preferredDate]);

  // Check if selected date is closed
  const dateClosureInfo = useMemo(() => {
    if (!formData.preferredDate) return null;
    const date = new Date(formData.preferredDate);
    if (isClinicClosed(date)) {
      return getClosureReason(date) || "La clínica está cerrada";
    }
    return null;
  }, [formData.preferredDate]);

  // Reset time when date changes
  useEffect(() => {
    if (formData.preferredTime && !availableTimeSlots.includes(formData.preferredTime)) {
      setFormData(prev => ({ ...prev, preferredTime: "" }));
    }
  }, [formData.preferredDate, availableTimeSlots]);

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot first (silent bot detection)
    const honeypotCheck = checkHoneypot();
    if (honeypotCheck.isBot) {
      // Log silenciosamente y simular éxito
      await logSecurityEvent('honeypot_triggered', 'guest_appointment', {
        reason: honeypotCheck.reason,
      });
      // Simular éxito para confundir al bot
      setStep("success");
      return;
    }

    // Validate form data
    try {
      guestAppointmentSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    // Check rate limit
    if (!checkRateLimit()) {
      await logSecurityEvent('rate_limit_hit', 'guest_appointment');
      toast({
        title: "Demasiados intentos",
        description: `Por favor, espera ${remainingTime} segundos antes de intentar de nuevo. Para urgencias, llama al 918 57 43 79.`,
        variant: "destructive",
      });
      return;
    }

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
              {/* Honeypot field - invisible to humans, filled by bots */}
              <div
                className="absolute left-[-9999px] opacity-0 pointer-events-none"
                aria-hidden="true"
              >
                <label htmlFor={honeypotField}>Leave this empty</label>
                <input
                  id={honeypotField}
                  name={honeypotField}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypotValue}
                  onChange={(e) => setHoneypotValue(e.target.value)}
                />
              </div>

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
                      setFormData({ ...formData, preferredDate: e.target.value, preferredTime: "" })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Hora *</Label>
                  <Select
                    required
                    value={formData.preferredTime}
                    onValueChange={(value) =>
                      setFormData({ ...formData, preferredTime: value })
                    }
                    disabled={!formData.preferredDate || dateClosureInfo !== null || availableTimeSlots.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !formData.preferredDate ? "Elige fecha primero" :
                          dateClosureInfo ? "Cerrado" :
                            availableTimeSlots.length === 0 ? "Sin disponibilidad" :
                              "Selecciona hora"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {dateClosureInfo && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {dateClosureInfo}. Por favor, selecciona otra fecha.
                  </AlertDescription>
                </Alert>
              )}

              {formData.preferredDate && !dateClosureInfo && availableTimeSlots.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay huecos disponibles para hoy. Por favor, selecciona otra fecha.
                  </AlertDescription>
                </Alert>
              )}

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

              <Button type="submit" disabled={loading || isRateLimited} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : isRateLimited ? (
                  <>
                    Espera {remainingTime}s
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
