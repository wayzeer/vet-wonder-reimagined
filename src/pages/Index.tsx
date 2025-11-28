import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PawPrint, Calendar, Heart, Activity, MapPin, Phone, Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Footer } from "@/components/layout/Footer";
import { CookiesBanner } from "@/components/layout/CookiesBanner";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { ClinicMap } from "@/components/map/ClinicMap";
import VetChatbot from "@/components/chat/VetChatbot";
import { NewsFeed } from "@/components/news/NewsFeed";
import { InstagramFeed } from "@/components/instagram/InstagramFeed";
import { GuestAppointmentDialog } from "@/components/appointments/GuestAppointmentDialog";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import logoVetWonder from "@/assets/logo-vetwonder.png";

export default function Index() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="container-custom flex items-center justify-between h-16 md:h-20 px-4">
          <img 
            src={logoVetWonder} 
            alt="VetWonder Moralzarzal" 
            className="h-12 md:h-16 cursor-pointer" 
            onClick={() => navigate("/")}
          />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="tel:918574379" 
              className="flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>918 57 43 79</span>
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

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-3">
            <a 
              href="tel:918574379" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary"
            >
              <Phone className="h-5 w-5" />
            </a>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-6 mt-8">
                  <a 
                    href="/blog" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </a>
                  {isAuthenticated ? (
                    <Button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/dashboard");
                      }} 
                      className="bg-primary hover:bg-primary/90 w-full"
                      size="lg"
                    >
                      Mi Área
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/auth");
                      }} 
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Entrar
                    </Button>
                  )}
                  <div className="pt-6 border-t">
                    <a 
                      href="tel:918574379" 
                      className="flex items-center gap-3 text-primary font-semibold"
                    >
                      <Phone className="h-5 w-5" />
                      <span>918 57 43 79</span>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center">
        {/* Video Background - optimizado para móvil */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 w-full h-full md:w-[150%] md:h-[150%] -translate-x-1/2 -translate-y-1/2 scale-[1.05] md:scale-[1.3]"
            src="https://www.youtube.com/embed/iucW5evsuLE?autoplay=1&mute=1&loop=1&playlist=iucW5evsuLE&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&start=60&playsinline=1&disablekb=1&fs=0"
            title="Happy video background"
            allow="autoplay; encrypted-media"
            style={{ pointerEvents: 'none', border: 'none' }}
          />
          {/* Diagonal Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-transparent"
            style={{
              WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 py-12 md:py-20 px-4">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3 md:mb-4 animate-fade-in">
              Veterinaria en Moralzarzal
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 animate-fade-in leading-tight" style={{ animationDelay: '0.1s' }}>
              <span className="block">Salud animal con</span>
              <span className="block text-primary">ciencia y corazón</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Especialistas en medicina preventiva, cirugía y diagnóstico avanzado.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button 
                onClick={() => setGuestDialogOpen(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto"
              >
                Pedir Cita Online
              </Button>
              <Button 
                onClick={() => navigate("/auth")} 
                variant="outline" 
                size="lg"
                className="border-2 w-full sm:w-auto"
              >
                Área Privada
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" className="text-background bg-muted/30 -mt-24 relative z-20" />

      {/* Services Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container-custom px-4">
          <ScrollReveal>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Nuestros Servicios</h2>
              <p className="text-base md:text-lg text-muted-foreground">Cuidado integral para tu mascota</p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={100}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                <CardHeader>
                  <Heart className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Medicina Preventiva</CardTitle>
                  <CardDescription>
                    Vacunaciones, desparasitaciones y chequeos regulares
                  </CardDescription>
                </CardHeader>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                <CardHeader>
                  <Activity className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Cirugía</CardTitle>
                  <CardDescription>
                    Quirófano equipado con tecnología de última generación
                  </CardDescription>
                </CardHeader>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Citas Online</CardTitle>
                  <CardDescription>
                    Reserva tu cita de forma rápida y sencilla
                  </CardDescription>
                </CardHeader>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                <CardHeader>
                  <PawPrint className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Historial Médico</CardTitle>
                  <CardDescription>
                    Acceso completo al historial de tu mascota
                  </CardDescription>
                </CardHeader>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider variant="diagonal" flip className="text-muted/30 bg-white" />

      {/* News Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom px-4">
          <ScrollReveal>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Últimas Noticias</h2>
              <p className="text-base md:text-lg text-muted-foreground">Mantente informado sobre el cuidado de tu mascota</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <NewsFeed />
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider variant="wave" flip className="text-white bg-muted/30" />

      {/* Instagram Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container-custom px-4">
          <ScrollReveal>
            <InstagramFeed />
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider variant="curve" className="text-primary bg-muted/30" />

      {/* Contact Section with Map */}
      <section className="py-12 md:py-16 bg-primary">
        <div className="container-custom px-4">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-white text-center">
              Visítanos
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <ScrollReveal delay={100}>
              <div className="space-y-6 text-white mx-auto max-w-md">
              <div className="flex flex-col items-center text-center gap-3">
                <MapPin className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold mb-2">Dirección</h3>
                  <p className="text-white/90">
                    C. Capellanía, 25, Local 3<br />
                    28411 Moralzarzal, Madrid
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Phone className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold mb-2">Teléfono</h3>
                  <a href="tel:+34918574379" className="text-white/90 hover:text-white">
                    +34 918 57 43 79
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Mail className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a href="mailto:info@vetwonder.es" className="text-white/90 hover:text-white">
                    info@vetwonder.es
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Calendar className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold mb-2">Horario</h3>
                  <p className="text-white/90">
                    Lunes a Viernes: 10:00 - 14:00 / 17:00 - 20:00<br />
                    Sábados: 10:00 - 14:00
                  </p>
                </div>
              </div>
              </div>
            </ScrollReveal>

            {/* Map */}
            <ScrollReveal delay={200}>
              <div>
                <ClinicMap />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
      <CookiesBanner />
      <VetChatbot />
      <GuestAppointmentDialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen} />
    </div>
  );
}
