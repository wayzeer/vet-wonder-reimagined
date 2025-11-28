import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AppointmentCalendar({ onDateSelect }: { onDateSelect: (date: Date | undefined) => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateSelect(newDate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona una fecha</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => date < new Date() || date.getDay() === 0}
          className="rounded-md border pointer-events-auto"
        />
        <p className="text-sm text-muted-foreground mt-4">
          * Domingos cerrados. Horario: L-V 9:00-20:00, S 10:00-14:00
        </p>
      </CardContent>
    </Card>
  );
}
