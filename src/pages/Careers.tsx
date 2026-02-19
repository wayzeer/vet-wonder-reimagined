import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { toast } from "sonner";
import {
  PawPrint,
  MapPin,
  Briefcase,
  Heart,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Stethoscope,
  Users,
  TrendingUp,
  Send,
} from "lucide-react";
import logoVetWonder from "@/assets/logo-vetwonder.png";

const API_URL = import.meta.env.VITE_API_URL || "https://crm.vetwonder.es";

export default function Careers() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    availability: "",
    surgeryExp: false,
    emergencyExp: false,
    whyVetwonder: "",
    salary: "",
    source: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/public/job-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          position: "veterinario",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar la candidatura");
      }

      setSubmitted(true);
      toast.success("¡Candidatura enviada correctamente!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al enviar la candidatura"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Simple header */}
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <img
              src={logoVetWonder}
              alt="VetWonder"
              className="h-12 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Gracias por tu interés!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Hemos recibido tu candidatura correctamente. Te hemos enviado un
                email de confirmación a <strong>{formData.email}</strong>.
              </p>
              <p className="text-gray-500 mb-8">
                Nuestro equipo revisará tu perfil y, si encaja con lo que
                buscamos, nos pondremos en contacto contigo para concertar una
                entrevista.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-primary hover:bg-primary/90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la web
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

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
                <PawPrint className="w-5 h-5" />
                <span className="font-medium">Únete a VetWonder</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Buscamos{" "}
                <span className="text-primary">Veterinario/a Generalista</span>
                <br />
                con Experiencia
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Moralzarzal
                </span>
                <span className="text-gray-300">•</span>
                <span>Sierra de Madrid</span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Jornada completa
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Job Description */}
            <div className="lg:col-span-3 space-y-10">
              <ScrollReveal>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Heart className="w-6 h-6 text-primary" />
                      Quiénes somos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray max-w-none">
                    <p>
                      En VetWonder creemos que la medicina veterinaria debe
                      ejercerse con <strong>rigor, humanidad y tiempo de calidad</strong>{" "}
                      para cada paciente.
                    </p>
                    <p>
                      Somos una clínica veterinaria y tienda especializada en el
                      cuidado integral de mascotas, comprometida con la salud
                      animal, el trato cercano y la mejora continua.
                    </p>
                    <p>
                      Colaboramos activamente con la protectora{" "}
                      <strong>La Huella de Wonder</strong>, destinando nuestros
                      beneficios a apoyar su labor de rescate y adopción.
                    </p>
                    <p>
                      Nuestro proyecto crece con una idea clara: construir un
                      entorno profesional estable, donde el equipo pueda
                      desarrollarse, aprender y disfrutar de su trabajo.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Stethoscope className="w-6 h-6 text-primary" />
                      El puesto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray max-w-none">
                    <p>
                      Buscamos incorporar a un/a veterinario/a con experiencia en
                      clínica de pequeños animales para reforzar nuestro equipo
                      asistencial.
                    </p>
                    <p>
                      La persona seleccionada asumirá consultas generales,
                      seguimiento clínico y, de forma valorable, cirugías en
                      perros y gatos, participando activamente en la evolución
                      médica de nuestros pacientes.
                    </p>
                    <p>
                      Trabajarás en un entorno organizado, con{" "}
                      <strong>protocolos claros</strong>, apoyo del equipo y
                      enfoque en la calidad asistencial.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      Tus funciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Atención clínica general en pequeños animales",
                        "Diagnóstico y planificación de tratamientos",
                        "Seguimiento médico continuado",
                        "Realización de cirugías básicas y medias (valorable)",
                        "Atención a urgencias",
                        "Gestión sanitaria y administrativa (RIAC)",
                        "Asesoramiento preventivo a tutores",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Users className="w-6 h-6 text-primary" />
                      El perfil que buscamos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Grado o Licenciatura en Veterinaria",
                        "Experiencia previa en clínica veterinaria",
                        "Autonomía en consulta general",
                        "Interés por la mejora continua",
                        "Capacidad de trabajo en equipo",
                        "Vocación, empatía y responsabilidad",
                        "Disponibilidad para incorporación inmediata",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <PawPrint className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-gray-500 italic">
                      Se valorará especialmente experiencia en cirugía y urgencias.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-amber-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      Qué ofrecemos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Incorporación a un proyecto sólido y en crecimiento",
                        "Contrato a jornada completa",
                        "Estabilidad laboral",
                        "Buen ambiente profesional y humano",
                        "Condiciones económicas acordes a la experiencia",
                        "Posibilidades reales de desarrollo profesional",
                        "Participación en una iniciativa con impacto social",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.5}>
                <Card className="border-0 shadow-lg border-l-4 border-l-primary">
                  <CardContent className="py-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      ¿Por qué VetWonder?
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Porque creemos que{" "}
                      <strong>
                        cuidar de los animales empieza por cuidar de las personas
                        que los atienden
                      </strong>
                      .
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed mt-4">
                      Aquí encontrarás un equipo comprometido, una dirección
                      cercana y un proyecto con propósito.
                    </p>
                    <p className="text-primary font-semibold text-lg mt-4">
                      Si buscas un lugar donde ejercer la veterinaria con
                      criterio, respeto y proyección, queremos conocerte.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <ScrollReveal delay={0.2}>
                <div className="sticky top-24">
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary to-orange-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Send className="w-5 h-5" />
                        Envía tu candidatura
                      </CardTitle>
                      <CardDescription className="text-white/90">
                        Completa el formulario y nos pondremos en contacto contigo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Tu nombre y apellidos"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="tu@email.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="600 000 000"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">
                            Cuéntanos sobre tu experiencia *
                          </Label>
                          <Textarea
                            id="experience"
                            required
                            minLength={10}
                            rows={4}
                            value={formData.experience}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                experience: e.target.value,
                              })
                            }
                            placeholder="Años de experiencia, tipo de clínicas, especialidades... (mín. 10 caracteres)"
                          />
                          {formData.experience.length > 0 && formData.experience.length < 10 && (
                            <p className="text-xs text-amber-600">
                              Mínimo 10 caracteres ({formData.experience.length}/10)
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label>Experiencia específica</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="surgeryExp"
                              checked={formData.surgeryExp}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  surgeryExp: checked as boolean,
                                })
                              }
                            />
                            <label
                              htmlFor="surgeryExp"
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              Tengo experiencia en cirugía
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="emergencyExp"
                              checked={formData.emergencyExp}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  emergencyExp: checked as boolean,
                                })
                              }
                            />
                            <label
                              htmlFor="emergencyExp"
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              Tengo experiencia en urgencias
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="availability">
                            Disponibilidad para incorporación
                          </Label>
                          <Select
                            value={formData.availability}
                            onValueChange={(value) =>
                              setFormData({ ...formData, availability: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inmediata">Inmediata</SelectItem>
                              <SelectItem value="15_dias">En 15 días</SelectItem>
                              <SelectItem value="1_mes">En 1 mes</SelectItem>
                              <SelectItem value="mas_1_mes">
                                Más de 1 mes
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="whyVetwonder">
                            ¿Por qué quieres trabajar en VetWonder?
                          </Label>
                          <Textarea
                            id="whyVetwonder"
                            rows={3}
                            value={formData.whyVetwonder}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                whyVetwonder: e.target.value,
                              })
                            }
                            placeholder="Cuéntanos qué te atrae de nuestro proyecto..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="source">¿Cómo nos conociste?</Label>
                          <Select
                            value={formData.source}
                            onValueChange={(value) =>
                              setFormData({ ...formData, source: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="indeed">Indeed</SelectItem>
                              <SelectItem value="infojobs">InfoJobs</SelectItem>
                              <SelectItem value="web">Web de VetWonder</SelectItem>
                              <SelectItem value="redes_sociales">
                                Redes sociales
                              </SelectItem>
                              <SelectItem value="recomendacion">
                                Recomendación
                              </SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Enviar candidatura
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-gray-500 text-center">
                          Al enviar este formulario, aceptas nuestra{" "}
                          <a
                            href="/privacidad"
                            className="text-primary hover:underline"
                          >
                            política de privacidad
                          </a>
                          .
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
