import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Phone, Menu, ArrowRight, Stethoscope, Syringe, HeartPulse, Clock, MapPin, Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Footer } from "@/components/layout/Footer";
import { CookiesBanner } from "@/components/layout/CookiesBanner";
import { ClinicMap } from "@/components/map/ClinicMap";
import { NewsFeed } from "@/components/news/NewsFeed";
import { InstagramFeed } from "@/components/instagram/InstagramFeed";
import { ShelterSection } from "@/components/shelter/ShelterSection";
import { HeroVideo } from "@/components/video/HeroVideo";
import { CLINICS, PRIMARY_PHONE, PRIMARY_EMAIL } from "@/data/clinics";
import logoVetWonder from "@/assets/logo-vetwonder.png";

export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  const services = [
    {
      icon: Stethoscope,
      title: "Consultas",
      description: "Diagnóstico completo con tecnología avanzada",
      color: "bg-primary",
    },
    {
      icon: Syringe,
      title: "Vacunación",
      description: "Protección completa para tu mascota",
      color: "bg-teal-500",
    },
    {
      icon: HeartPulse,
      title: "Cirugía",
      description: "Quirófano de última generación",
      color: "bg-coral-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Slogan Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground">
        <div className="container-custom flex items-center justify-center h-8 text-sm font-medium tracking-wide">
          <span className="animate-pulse mr-2">❤️</span>
          <span>Traer a tus mascotas salva vidas</span>
          <span className="animate-pulse ml-2">❤️</span>
        </div>
      </div>

      {/* Navigation - Clean and simple */}
      <nav className="fixed top-8 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container-custom flex items-center justify-between h-16 md:h-20">
          <img
            src={logoVetWonder}
            alt="VetWonder"
            className="h-10 md:h-14 cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate("/")}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/blog" className="text-foreground/70 hover:text-primary transition-colors font-medium link-playful">
              Blog
            </a>
            <a
              href="tel:918574379"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-medium"
            >
              <Phone className="h-4 w-4" />
              918 57 43 79
            </a>
            <Button asChild className="btn-playful rounded-full px-6">
              <a href="tel:918574379" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Llámanos
              </a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="tel:918574379"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary"
            >
              <Phone className="h-5 w-5" />
            </a>
            <Sheet open={mobileMenuOpen} onOpenChange={(open) => startTransition(() => setMobileMenuOpen(open))}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] pt-12">
                <div className="flex flex-col gap-6">
                  <a
                    href="/blog"
                    className="text-xl font-semibold hover:text-primary transition-colors"
                    onClick={() => startTransition(() => setMobileMenuOpen(false))}
                  >
                    Blog
                  </a>
                  <a
                    href="tel:918574379"
                    className="flex items-center gap-3 text-xl font-semibold text-primary"
                  >
                    <Phone className="h-5 w-5" />
                    918 57 43 79
                  </a>
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full btn-playful rounded-full" size="lg">
                      <a href="tel:918574379" className="flex items-center justify-center gap-2">
                        <Phone className="h-5 w-5" />
                        Llámanos
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section - Bold and Playful */}
      <section className="relative min-h-[90vh] flex items-center pt-28">
        <HeroVideo />

        {/* Decorative blob */}
        <div
          className="absolute -right-32 top-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "hsl(var(--primary))" }}
        />

        <div className="container-custom relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Playful badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Clínicas Veterinarias en la Sierra de Madrid
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              Tu mascota merece{" "}
              <span className="text-primary relative">
                lo mejor
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8.5C50 2 150 2 198 8.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Cuidamos de ellos con la misma dedicación con la que tú lo haces. Medicina preventiva, cirugía y mucho cariño.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="btn-playful rounded-full px-8 py-6 text-lg font-semibold gap-2 group">
                <a href="tel:918574379">
                  <Phone className="h-5 w-5" />
                  Llámanos
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5">
                <a href="#clinics">
                  Ver horarios
                </a>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-border/50">
              <div>
                <div className="text-3xl font-bold text-primary">+15</div>
                <div className="text-sm text-muted-foreground">años de experiencia</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">clínicas en la Sierra</div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block" />
              <div className="hidden sm:block">
                <div className="text-3xl font-bold text-primary">+5000</div>
                <div className="text-sm text-muted-foreground">familias confían en nosotros</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Asymmetric, not card grid */}
      <section className="py-20 md:py-32 bg-secondary/30 relative">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Large feature */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 text-8xl font-black text-primary/10">01</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 relative">
                Servicios pensados para{" "}
                <span className="text-primary">su bienestar</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                En VetWonder combinamos la última tecnología con el trato cercano que tu mascota necesita.
                Porque cada paciente es único.
              </p>
              <Button asChild variant="outline" className="rounded-full px-6 group">
                <a href="tel:918574379" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Llámanos para más info
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            {/* Right: Service list - stacked, not cards */}
            <div className="space-y-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-start gap-5 p-6 bg-background rounded-2xl shadow-playful hover:shadow-playful-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className={`${service.color} p-4 rounded-xl text-white shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold, no glassmorphism */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              ¿Tu mascota necesita atención?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Llámanos y te atenderemos con el cariño que tu mascota merece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="btn-playful rounded-full px-8 py-6 text-lg font-semibold text-primary">
                <a href="tel:918574379" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Llámanos
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-white/10 border-2 border-white/20">
                <a href="#clinics">
                  Ver horarios
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Decorative zigzag lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <path
              d="M0 100 Q 150 50, 300 100 T 600 100 T 900 100 T 1200 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
            <path
              d="M0 200 Q 150 150, 300 200 T 600 200 T 900 200 T 1200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
            <path
              d="M0 300 Q 150 250, 300 300 T 600 300 T 900 300 T 1200 300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
          </svg>
        </div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Últimas noticias</h2>
              <p className="text-muted-foreground text-lg">
                Consejos y novedades para el cuidado de tu mascota
              </p>
            </div>
            <a href="/blog" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
              Ver todas <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <NewsFeed />
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <InstagramFeed />
        </div>
      </section>

      {/* Shelter Section */}
      <ShelterSection />

      {/* Clinics Section */}
      <section className="py-20 md:py-28 bg-footer text-footer-foreground">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestras Clínicas</h2>
            <p className="text-footer-foreground/70 text-lg">
              Dos ubicaciones para estar cerca de ti
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {CLINICS.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  {clinic.shortName}
                </h3>
                <div className="space-y-3 text-footer-foreground/80">
                  <p>
                    {clinic.address.street}<br />
                    {clinic.address.postalCode} {clinic.address.city}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>L-V: {clinic.hours.weekdays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Sáb: {clinic.hours.saturday}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <a
              href={`tel:+34${PRIMARY_PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-xl font-semibold hover:text-primary transition-colors"
            >
              <Phone className="h-6 w-6" />
              {PRIMARY_PHONE}
            </a>
            <a
              href={`mailto:${PRIMARY_EMAIL}`}
              className="flex items-center gap-3 hover:text-primary transition-colors"
            >
              <Mail className="h-6 w-6" />
              {PRIMARY_EMAIL}
            </a>
          </div>

          <ClinicMap />
        </div>
      </section>

      <Footer />
      <CookiesBanner />
    </div>
  );
}
