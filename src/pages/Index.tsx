import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PawPrint, Calendar, Heart, Activity, MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="bg-orange-600 hover:bg-orange-700">
                Mi Área
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="ghost" className="text-gray-600 hover:text-orange-600">
                Entrar
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
                  Veterinaria en Moralzarzal
                </span>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
                  <span className="block xl:inline">Salud animal con</span>{' '}
                  <span className="block text-orange-600 xl:inline">ciencia y corazón</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Especialistas en medicina preventiva, cirugía y diagnóstico avanzado.
                </p>
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Button 
                    onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} 
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 text-base md:text-lg px-8 py-6"
                  >
                    Pedir Cita Online
                  </Button>
                  <Button 
                    onClick={() => navigate("/auth")} 
                    variant="outline" 
                    className="w-full sm:w-auto border-2 border-orange-100 text-orange-700 hover:bg-orange-50 text-base md:text-lg px-8 py-6"
                  >
                    Área Privada
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-white flex items-center justify-center">
          <img 
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" 
            src="https://images.unsplash.com/photo-1544568100-847a9480835b?auto=format&fit=crop&w=800&q=80" 
            alt="Veterinaria profesional" 
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Nuestros Servicios</h2>
            <p className="text-lg text-gray-600">Cuidado integral para tu mascota</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-gray-900">Medicina Preventiva</CardTitle>
                <CardDescription className="text-gray-600">
                  Vacunaciones, desparasitaciones y chequeos regulares
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-gray-900">Cirugía</CardTitle>
                <CardDescription className="text-gray-600">
                  Quirófano equipado con tecnología de última generación
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-gray-900">Citas Online</CardTitle>
                <CardDescription className="text-gray-600">
                  Reserva tu cita de forma rápida y sencilla
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <PawPrint className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle className="text-gray-900">Historial Médico</CardTitle>
                <CardDescription className="text-gray-600">
                  Acceso completo al historial de tu mascota
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Visítanos</h2>
            <p className="text-lg text-gray-600">Estamos en Moralzarzal, Madrid</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Dirección</h3>
              <p className="text-gray-600 text-sm">Moralzarzal, Madrid</p>
            </div>
            <div className="text-center">
              <Phone className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600 text-sm">651 50 38 27</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">info@vetwonder.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
