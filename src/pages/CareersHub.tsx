import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  PawPrint,
  MapPin,
  Briefcase,
  Heart,
  ArrowLeft,
  ArrowRight,
  Stethoscope,
  ShoppingBag,
  Clock,
  Users,
} from "lucide-react";
import logoVetWonder from "@/assets/logo-vetwonder.png";

const jobListings = [
  {
    id: "veterinario",
    title: "Veterinario/a Generalista",
    subtitle: "con Experiencia",
    icon: Stethoscope,
    location: "Moralzarzal",
    type: "Jornada completa",
    description: "Buscamos incorporar a un/a veterinario/a con experiencia en clínica de pequeños animales para reforzar nuestro equipo asistencial.",
    highlights: [
      "Consultas generales y seguimiento clínico",
      "Cirugías en perros y gatos (valorable)",
      "Atención a urgencias",
      "Protocolos claros y apoyo del equipo",
    ],
    color: "from-primary to-orange-500",
    href: "/empleo/veterinario",
    featured: true,
  },
  {
    id: "asistente-tienda",
    title: "Asistente de Ventas",
    subtitle: "Tienda de Animales",
    icon: ShoppingBag,
    location: "Moralzarzal",
    type: "Jornada completa",
    description: "Buscamos una persona apasionada por los animales para atender a nuestros clientes en la tienda de mascotas y ayudarles a encontrar lo mejor para sus compañeros.",
    highlights: [
      "Atención al cliente personalizada",
      "Asesoramiento en nutrición y productos",
      "Gestión de stock e inventario",
      "Cuidado de animales en tienda",
    ],
    color: "from-teal-500 to-emerald-500",
    href: "/empleo/asistente-tienda",
    featured: true,
  },
];

export default function CareersHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src={logoVetWonder}
            alt="VetWonder"
            className="h-12 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10" />
        <div className="container mx-auto px-4 relative">
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">Trabaja con nosotros</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Únete al equipo{" "}
                <span className="text-primary">VetWonder</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Buscamos personas apasionadas por los animales que quieran formar parte
                de un proyecto con propósito. ¿Te unes?
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Heart, text: "Proyecto con impacto social", desc: "Colaboramos con protectoras" },
                { icon: Users, text: "Equipo comprometido", desc: "Buen ambiente profesional" },
                { icon: Clock, text: "Estabilidad laboral", desc: "Contrato a jornada completa" },
                { icon: PawPrint, text: "Pasión por los animales", desc: "Cuidamos de ellos juntos" },
              ].map((item, i) => (
                <div key={i} className="text-center p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.text}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ofertas de empleo activas
              </h2>
              <p className="text-gray-600 text-lg">
                {jobListings.length} posiciones disponibles en nuestro equipo
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {jobListings.map((job, index) => (
              <ScrollReveal key={job.id} delay={index * 0.1}>
                <Card
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden h-full"
                  onClick={() => navigate(job.href)}
                >
                  {/* Color header */}
                  <div className={`bg-gradient-to-r ${job.color} p-6 text-white`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <job.icon className="w-10 h-10 mb-4 opacity-90" />
                        <h3 className="text-2xl font-bold mb-1">{job.title}</h3>
                        <p className="text-white/80 font-medium">{job.subtitle}</p>
                      </div>
                      {job.featured && (
                        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          ACTIVA
                        </span>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Location & Type */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">{job.description}</p>

                    {/* Highlights */}
                    <ul className="space-y-2 mb-6">
                      {job.highlights.slice(0, 3).map((highlight, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                      variant="outline"
                    >
                      Ver oferta completa
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About VetWonder */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Por qué VetWonder?
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  En VetWonder creemos que <strong>cuidar de los animales empieza por
                  cuidar de las personas que los atienden</strong>. Somos una clínica
                  veterinaria y tienda especializada en el cuidado integral de mascotas.
                </p>
                <p>
                  Colaboramos activamente con la protectora <strong>La Huella de Wonder</strong>,
                  destinando parte de nuestros beneficios a apoyar su labor de rescate y adopción.
                </p>
                <p className="text-primary font-semibold">
                  Si buscas un lugar donde trabajar con criterio, respeto y proyección,
                  queremos conocerte.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
