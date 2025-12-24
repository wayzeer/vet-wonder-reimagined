import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Stethoscope, Syringe, Pill, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function MedicalHistoryList() {
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicalHistory();
  }, []);

  const loadMedicalHistory = async () => {
    try {
      const { data, error } = await api.getMedicalHistory();
      if (error) throw new Error(error);
      setMedicalHistory(data?.medicalHistory || null);
    } catch (error: any) {
      console.error("Error cargando historial médico:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasData =
    medicalHistory &&
    (medicalHistory.consultations?.length > 0 ||
      medicalHistory.vaccinations?.length > 0 ||
      medicalHistory.dewormings?.length > 0 ||
      medicalHistory.surgeries?.length > 0 ||
      medicalHistory.documents?.length > 0);

  if (!hasData) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Historial Médico</CardTitle>
          <CardDescription className="text-gray-600">
            Consulta el historial médico de tus mascotas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No hay historial médico disponible todavía.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Historial Médico</h2>
        <p className="text-muted-foreground">Consulta el historial médico de tus mascotas</p>
      </div>

      <Tabs defaultValue="consultations" className="space-y-4">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="consultations" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
            <Stethoscope className="h-4 w-4 mr-2" />
            Consultas
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
            <Syringe className="h-4 w-4 mr-2" />
            Vacunas
          </TabsTrigger>
          <TabsTrigger value="dewormings" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
            <Pill className="h-4 w-4 mr-2" />
            Desparasitaciones
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
            <FileText className="h-4 w-4 mr-2" />
            Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consultations">
          {medicalHistory.consultations?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay consultas registradas
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {medicalHistory.consultations?.map((consultation: any) => (
                <Card key={consultation.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{consultation.reason}</h3>
                        <p className="text-sm text-muted-foreground">
                          {consultation.Animal?.name} - {format(new Date(consultation.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                      </div>
                      {consultation.User?.name && (
                        <Badge variant="outline">Dr. {consultation.User.name}</Badge>
                      )}
                    </div>
                    {consultation.diagnosis && (
                      <div className="mb-2">
                        <strong className="text-sm">Diagnóstico:</strong>
                        <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                      </div>
                    )}
                    {consultation.treatment && (
                      <div className="mb-2">
                        <strong className="text-sm">Tratamiento:</strong>
                        <p className="text-sm text-muted-foreground">{consultation.treatment}</p>
                      </div>
                    )}
                    {consultation.notes && (
                      <div>
                        <strong className="text-sm">Notas:</strong>
                        <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vaccinations">
          {medicalHistory.vaccinations?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay vacunas registradas
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {medicalHistory.vaccinations?.map((vaccination: any) => (
                <Card key={vaccination.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{vaccination.vaccineType}</h3>
                        <p className="text-sm text-muted-foreground">
                          {vaccination.Animal?.name} - {format(new Date(vaccination.appliedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                        {vaccination.brand && (
                          <p className="text-sm text-muted-foreground">Marca: {vaccination.brand}</p>
                        )}
                      </div>
                      {vaccination.nextDueDate && (
                        <Badge variant="outline" className="bg-yellow-50">
                          Próxima: {format(new Date(vaccination.nextDueDate), "d MMM yyyy", { locale: es })}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="dewormings">
          {medicalHistory.dewormings?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay desparasitaciones registradas
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {medicalHistory.dewormings?.map((deworming: any) => (
                <Card key={deworming.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{deworming.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {deworming.Animal?.name} - {format(new Date(deworming.administeredAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {deworming.productType === 'interno' ? 'Interno' : deworming.productType === 'externo' ? 'Externo' : 'Ambos'}
                        </Badge>
                      </div>
                      {deworming.nextDueDate && (
                        <Badge variant="outline" className="bg-yellow-50">
                          Próxima: {format(new Date(deworming.nextDueDate), "d MMM yyyy", { locale: es })}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          {medicalHistory.documents?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay documentos disponibles
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {medicalHistory.documents?.map((doc: any) => (
                <Card key={doc.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.Animal?.name} - {format(new Date(doc.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                        )}
                      </div>
                      <Badge variant="outline">{doc.type}</Badge>
                    </div>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        Ver documento
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
