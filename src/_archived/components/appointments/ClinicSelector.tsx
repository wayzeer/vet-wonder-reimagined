import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, Clock } from "lucide-react";
import { CLINICS } from "@/data/clinics";

interface ClinicSelectorProps {
  value: string;
  onChange: (clinicId: string) => void;
}

export function ClinicSelector({ value, onChange }: ClinicSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Selecciona la clinica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
          {CLINICS.map((clinic) => (
            <div
              key={clinic.id}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                value === clinic.id
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
              }`}
              onClick={() => onChange(clinic.id)}
            >
              <RadioGroupItem value={clinic.id} id={clinic.id} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={clinic.id} className="cursor-pointer">
                  <div className="font-semibold text-base">{clinic.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {clinic.address.street}, {clinic.address.city}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      L-V: {clinic.hours.weekdays}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 invisible" />
                      Sab: {clinic.hours.saturday}
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
