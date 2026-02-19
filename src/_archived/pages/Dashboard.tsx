import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import logoVetWonder from "@/assets/logo-vetwonder.png";
import { PetsList } from "@/components/pets/PetsList";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { ClinicSelector } from "@/components/appointments/ClinicSelector";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { MedicalHistoryList } from "@/components/medical/MedicalHistoryList";
import { VetChatbot } from "@/components/chat/VetChatbot";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedClinic, setSelectedClinic] = useState<string>("moralzarzal");
  const [availability, setAvailability] = useState<{
    availableSlots: string[];
    closed: boolean;
  } | null>(null);

  // Read tab and petId from URL params
  const initialTab = searchParams.get("tab") || "pets";
  const preselectedPetId = searchParams.get("petId") || undefined;
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without petId to clean it up after navigation
    if (value !== "appointments") {
      setSearchParams({});
    } else {
      setSearchParams({ tab: value });
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="container-custom flex items-center justify-between h-20">
          <img
            src={logoVetWonder}
            alt="VetWonder Moralzarzal"
            className="h-12 cursor-pointer"
            onClick={() => navigate("/")}
          />

          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-600 hover:text-orange-600">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </nav>

      <div className="container-custom py-10">
        <div className="mb-10 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hola, {user?.name || user?.email?.split('@')[0] || 'Usuario'}
          </h1>
          <p className="text-gray-600">
            Gestiona tus mascotas, citas y historial médico
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="pets" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
              Mis Mascotas
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
              Citas
            </TabsTrigger>
            <TabsTrigger value="records" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
              Historial Médico
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
              Pagos
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600">
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pets">
            <PetsList />
          </TabsContent>

          <TabsContent value="appointments">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Reservar Nueva Cita</h2>
                <p className="text-gray-600 mb-6">Selecciona clinica, fecha y completa el formulario</p>
                <div className="grid md:grid-cols-3 gap-6">
                  <ClinicSelector
                    value={selectedClinic}
                    onChange={setSelectedClinic}
                  />
                  <AppointmentCalendar
                    onDateSelect={setSelectedDate}
                    onAvailabilityLoad={setAvailability}
                    clinicId={selectedClinic}
                  />
                  <AppointmentForm
                    selectedDate={selectedDate}
                    availableSlots={availability?.availableSlots}
                    isClosed={availability?.closed}
                    onSuccess={() => window.location.reload()}
                    initialAnimalId={preselectedPetId}
                    clinicId={selectedClinic}
                  />
                </div>
              </div>
              <AppointmentsList />
            </div>
          </TabsContent>

          <TabsContent value="records">
            <MedicalHistoryList />
          </TabsContent>

          <TabsContent value="payments">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Historial de Pagos</CardTitle>
                <CardDescription className="text-gray-600">Consulta tu historial de pagos y facturas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No hay historial de pagos</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Mi Perfil</CardTitle>
                <CardDescription className="text-gray-600">Actualiza tu información personal</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <VetChatbot />
    </div>
  );
}
