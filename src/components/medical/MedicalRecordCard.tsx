import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MedicalRecord {
  id: string;
  title: string;
  record_type: string;
  description: string | null;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  created_at: string;
}

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export const MedicalRecordCard = ({ record }: MedicalRecordCardProps) => {
  const handleDownloadPDF = () => {
    // Create a simple text-based PDF download
    const content = `
VetWonder - Historial Médico

${record.title}
Fecha: ${format(new Date(record.created_at), "dd 'de' MMMM 'de' yyyy", { locale: es })}
Tipo: ${record.record_type}

${record.description ? `Descripción:\n${record.description}\n\n` : ''}
${record.diagnosis ? `Diagnóstico:\n${record.diagnosis}\n\n` : ''}
${record.treatment ? `Tratamiento:\n${record.treatment}\n\n` : ''}
${record.prescription ? `Prescripción:\n${record.prescription}\n\n` : ''}

---
Clínica Veterinaria VetWonder
Moralzarzal, Madrid
Tel: 651 50 38 27
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-${record.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      consulta: "bg-blue-100 text-blue-800",
      vacuna: "bg-green-100 text-green-800",
      cirugía: "bg-red-100 text-red-800",
      urgencia: "bg-orange-100 text-orange-800",
      revisión: "bg-purple-100 text-purple-800",
    };
    return colors[type.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {record.title}
            </CardTitle>
            <CardDescription>
              {format(new Date(record.created_at), "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </CardDescription>
          </div>
          <Badge className={getRecordTypeColor(record.record_type)}>
            {record.record_type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {record.description && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Descripción</h4>
            <p className="text-sm text-muted-foreground">{record.description}</p>
          </div>
        )}
        
        {record.diagnosis && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Diagnóstico</h4>
            <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
          </div>
        )}
        
        {record.treatment && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Tratamiento</h4>
            <p className="text-sm text-muted-foreground">{record.treatment}</p>
          </div>
        )}
        
        {record.prescription && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Prescripción</h4>
            <p className="text-sm text-muted-foreground">{record.prescription}</p>
          </div>
        )}

        <Button 
          onClick={handleDownloadPDF}
          variant="outline" 
          size="sm"
          className="w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar receta
        </Button>
      </CardContent>
    </Card>
  );
};
