import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Props {
  onDateSelect: (date: Date | undefined) => void;
  onAvailabilityLoad?: (availability: {
    availableSlots: string[];
    closed: boolean;
  }) => void;
}

export function AppointmentCalendar({ onDateSelect, onAvailabilityLoad }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<{
    availableSlots: string[];
    bookedSlots: string[];
    closed: boolean;
    hours?: { open: string; close: string };
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch availability when date changes
  useEffect(() => {
    if (date) {
      loadAvailability(date);
    }
  }, [date]);

  const loadAvailability = async (selectedDate: Date) => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const { data, error } = await api.getAvailability(dateStr);

      if (error) {
        console.error("Error loading availability:", error);
        setAvailability(null);
      } else if (data) {
        setAvailability({
          availableSlots: data.availableSlots,
          bookedSlots: data.bookedSlots,
          closed: data.closed,
          hours: data.hours,
        });
        onAvailabilityLoad?.({
          availableSlots: data.availableSlots,
          closed: data.closed,
        });
      }
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateSelect(newDate);
  };

  // Get status for selected date
  const getAvailabilityStatus = () => {
    if (!availability) return null;
    if (availability.closed) {
      return { text: "Cerrado", variant: "destructive" as const };
    }
    const available = availability.availableSlots.length;
    if (available === 0) {
      return { text: "Completo", variant: "destructive" as const };
    }
    if (available <= 3) {
      return { text: `${available} huecos`, variant: "secondary" as const };
    }
    return { text: "Disponible", variant: "default" as const };
  };

  const status = getAvailabilityStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Selecciona una fecha</span>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today || date.getDay() === 0;
          }}
          className="rounded-md border pointer-events-auto"
        />

        {date && availability && (
          <div className="mt-4 p-3 bg-muted rounded-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {date.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              {status && (
                <Badge variant={status.variant}>{status.text}</Badge>
              )}
            </div>

            {!availability.closed && availability.hours && (
              <p className="text-xs text-muted-foreground">
                Horario: {availability.hours.open} - {availability.hours.close}
              </p>
            )}

            {!availability.closed && availability.availableSlots.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {availability.availableSlots.length} huecos disponibles de{" "}
                {availability.availableSlots.length + availability.bookedSlots.length}
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-4">
          * Domingos cerrados. Horario: L-V 9:00-20:00, S 10:00-14:00
        </p>
      </CardContent>
    </Card>
  );
}
