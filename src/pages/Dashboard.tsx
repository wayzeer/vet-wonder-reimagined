import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, Calendar, FileText, CreditCard, LogOut, Plus } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="container-custom flex items-center justify-between h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-orange-100 p-2 rounded-lg">
              <PawPrint className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">
              Vet<span className="text-orange-600">Wonder</span>
            </span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-600 hover:text-orange-600">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </nav>

      <div className="container-custom py-10">
        <div className="mb-10 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hola, {user?.email?.split('@')[0] || 'Usuario'}
          </h1>
          <p className="text-gray-600">
            Gestiona tus mascotas, citas y historial médico
          </p>
        </div>

        <Tabs defaultValue="pets" className="space-y-6">
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
          </TabsList>

          <TabsContent value="pets" className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Mis Mascotas</CardTitle>
                    <CardDescription className="text-gray-600">Gestiona los perfiles de tus mascotas</CardDescription>
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Mascota
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <PawPrint className="h-12 w-12 mx-auto mb-4 opacity-50 text-orange-600" />
                  <p>No hay mascotas añadidas. ¡Haz clic en "Añadir Mascota" para empezar!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">Citas</CardTitle>
                    <CardDescription className="text-gray-600">Ver y gestionar tus citas</CardDescription>
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    Reservar Cita
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-orange-600" />
                  <p>No hay citas programadas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Historial Médico</CardTitle>
                <CardDescription className="text-gray-600">Consulta el historial médico de tus mascotas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-orange-600" />
                  <p>No hay registros médicos todavía</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Historial de Pagos</CardTitle>
                <CardDescription className="text-gray-600">Consulta tu historial de pagos y facturas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50 text-orange-600" />
                  <p>No hay historial de pagos</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
