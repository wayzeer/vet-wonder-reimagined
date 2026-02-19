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
  ShoppingBag,
  Users,
  TrendingUp,
  Send,
  Sparkles,
  Package,
} from "lucide-react";
import logoVetWonder from "@/assets/logo-vetwonder.png";

const API_URL = import.meta.env.VITE_API_URL || "https://crm.vetwonder.es";

export default function CareersStoreAssistant() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    availability: "",
    petExperience: false,
    salesExperience: false,
    whyVetwonder: "",
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
          position: "asistente-tienda",
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
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/empleo")}
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Ver más ofertas
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Volver a la web
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src={logoVetWonder}
            alt="VetWonder"
            className="h-12 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <Button variant="ghost" onClick={() => navigate("/empleo")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ver todas las ofertas
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10" />
        <div className="container mx-auto px-4 relative">
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-600 px-4 py-2 rounded-full mb-6">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">Únete a VetWonder</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Buscamos{" "}
                <span className="text-teal-500">Asistente de Ventas</span>
                <br />
                para nuestra Tienda
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-500" />
                  Moralzarzal
                </span>
                <span className="text-gray-300">•</span>
                <span>Sierra de Madrid</span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-teal-500" />
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
                      <Heart className="w-6 h-6 text-teal-500" />
                      Quiénes somos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray max-w-none">
                    <p>
                      En VetWonder combinamos <strong>clínica veterinaria y tienda de mascotas</strong>{" "}
                      para ofrecer un cuidado integral a los animales de la Sierra de Madrid.
                    </p>
                    <p>
                      Nuestra tienda ofrece productos de alimentación premium, accesorios,
                      complementos y todo lo necesario para el bienestar de perros, gatos
                      y pequeños animales.
                    </p>
                    <p>
                      Colaboramos activamente con la protectora{" "}
                      <strong>La Huella de Wonder</strong>, destinando nuestros
                      beneficios a apoyar su labor de rescate y adopción.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <ShoppingBag className="w-6 h-6 text-teal-500" />
                      El puesto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray max-w-none">
                    <p>
                      Buscamos a una persona <strong>apasionada por los animales</strong> para
                      formar parte de nuestro equipo de tienda. Serás la cara visible
                      de VetWonder, ayudando a nuestros clientes a encontrar los mejores
                      productos para sus mascotas.
                    </p>
                    <p>
                      Te encargarás de la atención al público, el asesoramiento personalizado
                      sobre alimentación y productos, y colaborarás en la gestión del inventario.
                    </p>
                    <p>
                      Trabajarás en un ambiente <strong>dinámico y cercano</strong>, rodeado/a
                      de animales y personas que comparten tu misma pasión.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <CheckCircle2 className="w-6 h-6 text-teal-500" />
                      Tus funciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Atención al cliente de forma personalizada y cercana",
                        "Asesoramiento sobre alimentación y productos para mascotas",
                        "Gestión de caja y cobros",
                        "Reposición y organización de productos",
                        "Control de stock e inventario",
                        "Recepción de pedidos de proveedores",
                        "Cuidado y bienestar de animales en tienda",
                        "Apoyo en redes sociales y promociones (valorable)",
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
                      <Users className="w-6 h-6 text-teal-500" />
                      El perfil que buscamos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Pasión genuina por los animales",
                        "Experiencia previa en atención al cliente o comercio (valorable)",
                        "Conocimientos sobre mascotas y sus cuidados (valorable)",
                        "Persona proactiva, responsable y con iniciativa",
                        "Buenas habilidades comunicativas",
                        "Capacidad de trabajo en equipo",
                        "Disponibilidad para fines de semana alternos",
                        "Permiso de conducir y vehículo propio (valorable)",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <PawPrint className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-gray-500 italic">
                      No es imprescindible tener experiencia previa; valoramos la actitud y las ganas de aprender.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500/5 to-emerald-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <TrendingUp className="w-6 h-6 text-teal-500" />
                      Qué ofrecemos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Incorporación a un proyecto sólido y en crecimiento",
                        "Contrato a jornada completa",
                        "Estabilidad laboral",
                        "Formación continua en productos y nutrición animal",
                        "Ambiente de trabajo agradable y cercano",
                        "Descuentos en productos para tus mascotas",
                        "Participación en un proyecto con impacto social",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.5}>
                <Card className="border-0 shadow-lg border-l-4 border-l-teal-500">
                  <CardContent className="py-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      ¿Te gustan los animales?
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Si disfrutas ayudando a las personas a cuidar mejor de sus mascotas
                      y quieres trabajar en un entorno donde los animales son lo primero,{" "}
                      <strong>este es tu sitio</strong>.
                    </p>
                    <p className="text-teal-600 font-semibold text-lg mt-4">
                      ¡Queremos conocerte!
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
                    <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-t-lg">
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
                            Cuéntanos sobre ti *
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
                            placeholder="Tu experiencia laboral, qué mascotas tienes, por qué te gustaría trabajar con nosotros... (mín. 10 caracteres)"
                          />
                          {formData.experience.length > 0 && formData.experience.length < 10 && (
                            <p className="text-xs text-amber-600">
                              Mínimo 10 caracteres ({formData.experience.length}/10)
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label>Experiencia previa</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="petExperience"
                              checked={formData.petExperience}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  petExperience: checked as boolean,
                                })
                              }
                            />
                            <label
                              htmlFor="petExperience"
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              Tengo/he tenido mascotas
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="salesExperience"
                              checked={formData.salesExperience}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  salesExperience: checked as boolean,
                                })
                              }
                            />
                            <label
                              htmlFor="salesExperience"
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              Tengo experiencia en ventas/atención al cliente
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
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg"
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
                            className="text-teal-500 hover:underline"
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
