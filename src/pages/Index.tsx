import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PawPrint, Calendar, Heart, Activity, MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/layout/Footer";
import { CookiesBanner } from "@/components/layout/CookiesBanner";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { ClinicMap } from "@/components/map/ClinicMap";
import VetChatbot from "@/components/chat/VetChatbot";
import { NewsFeed } from "@/components/news/NewsFeed";
import { InstagramFeed } from "@/components/instagram/InstagramFeed";
import logoVetWonder from "@/assets/logo-vetwonder.png";

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
      <nav className="bg-card shadow-sm sticky top-0 z-30 backdrop-blur-md bg-card/90">
        <div className="container-custom flex items-center justify-between h-20">
          <img 
            src={logoVetWonder} 
            alt="VetWonder Moralzarzal" 
            className="h-16 cursor-pointer" 
            onClick={() => navigate("/")}
          />
          
          <div className="flex items-center gap-6">
            <a 
              href="tel:651503827" 
              className="flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">651 50 38 27</span>
            </a>
            <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a>
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary/90">
                Mi Área
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="ghost" className="text-muted-foreground hover:text-primary">
                Entrar
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        {/* Video Background - sin overlays ni barras negras */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 scale-[1.3]"
            src="https://www.youtube.com/embed/iucW5evsuLE?autoplay=1&mute=1&loop=1&playlist=iucW5evsuLE&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&start=60&playsinline=1&disablekb=1&fs=0"
            title="Happy video background"
            allow="autoplay; encrypted-media"
            style={{ pointerEvents: 'none', border: 'none' }}
          />
          {/* Diagonal Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-transparent"
            style={{
              WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in">
              Veterinaria en Moralzarzal
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="block">Salud animal con</span>
              <span className="block text-primary">ciencia y corazón</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Especialistas en medicina preventiva, cirugía y diagnóstico avanzado.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button 
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} 
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Pedir Cita Online
              </Button>
              <Button 
                onClick={() => navigate("/auth")} 
                variant="outline" 
                size="lg"
                className="border-2"
              >
                Área Privada
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" className="text-muted" />

      {/* Services Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-muted-foreground">Cuidado integral para tu mascota</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <Heart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Medicina Preventiva</CardTitle>
                <CardDescription>
                  Vacunaciones, desparasitaciones y chequeos regulares
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <Activity className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Cirugía</CardTitle>
                <CardDescription>
                  Quirófano equipado con tecnología de última generación
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Citas Online</CardTitle>
                <CardDescription>
                  Reserva tu cita de forma rápida y sencilla
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <PawPrint className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Historial Médico</CardTitle>
                <CardDescription>
                  Acceso completo al historial de tu mascota
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <SectionDivider variant="diagonal" flip className="text-primary bg-muted/30" />

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Últimas Noticias</h2>
            <p className="text-lg text-muted-foreground">Mantente informado sobre el cuidado de tu mascota</p>
          </div>
          <NewsFeed />
        </div>
      </section>

      <SectionDivider variant="wave" flip className="text-muted" />

      {/* Instagram Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Síguenos en Instagram</h2>
            <p className="text-lg text-muted-foreground">Conoce a nuestros pacientes y el día a día de la clínica</p>
          </div>
          <InstagramFeed />
        </div>
      </section>

      <SectionDivider variant="diagonal" className="text-primary" />

      {/* Contact Section with Map */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visítanos</h2>
            <p className="text-lg text-muted-foreground">Estamos en Moralzarzal, Madrid</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Dirección</h3>
                  <p className="text-muted-foreground">Calle Real 123<br />28411 Moralzarzal, Madrid</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Teléfono</h3>
                  <a href="tel:651503827" className="text-muted-foreground hover:text-primary transition-colors">
                    651 50 38 27
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <a href="mailto:info@vetwonder.es" className="text-muted-foreground hover:text-primary transition-colors">
                    info@vetwonder.es
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="animate-fade-in">
              <ClinicMap />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CookiesBanner />
      <VetChatbot />
    </div>
  );
}
