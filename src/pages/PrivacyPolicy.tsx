import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            🐾 VetWonder
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Información que recopilamos</h2>
            <p className="text-muted-foreground">
              En VetWonder recopilamos la información necesaria para proporcionar nuestros servicios veterinarios, 
              incluyendo datos personales (nombre, email, teléfono), información sobre tus mascotas (nombre, especie, 
              raza, edad, historial médico) y datos de citas y tratamientos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Uso de la información</h2>
            <p className="text-muted-foreground">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>Gestionar citas y servicios veterinarios</li>
              <li>Mantener historiales médicos de tus mascotas</li>
              <li>Enviar recordatorios de vacunación y revisiones</li>
              <li>Proporcionar consejos personalizados mediante IA</li>
              <li>Mejorar nuestros servicios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Protección de datos</h2>
            <p className="text-muted-foreground">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales 
              contra acceso no autorizado, pérdida o alteración. Utilizamos cifrado y almacenamiento seguro 
              en servidores protegidos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
            <p className="text-muted-foreground">
              Utilizamos cookies para mejorar tu experiencia en nuestra web, recordar tus preferencias y 
              analizar el uso del sitio. Puedes configurar tu navegador para rechazar cookies, aunque esto 
              puede afectar a algunas funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Compartir información</h2>
            <p className="text-muted-foreground">
              No vendemos ni compartimos tu información personal con terceros, excepto cuando sea necesario 
              para proporcionar nuestros servicios (por ejemplo, laboratorios de análisis veterinarios) o 
              cuando lo exija la ley.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Tus derechos</h2>
            <p className="text-muted-foreground">
              Tienes derecho a acceder, rectificar, suprimir, limitar el tratamiento, y portar tus datos personales. 
              También puedes oponerte al tratamiento de tus datos. Para ejercer estos derechos, contacta con nosotros 
              en info@vetwonder.es
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Menores de edad</h2>
            <p className="text-muted-foreground">
              Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionadamente 
              información de menores sin el consentimiento parental.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cambios en la política</h2>
            <p className="text-muted-foreground">
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos cualquier cambio 
              significativo mediante email o un aviso en nuestra web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
            <p className="text-muted-foreground">
              Si tienes preguntas sobre esta política de privacidad o sobre cómo tratamos tus datos, contacta con nosotros:
            </p>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="font-semibold">VetWonder</p>
              <p className="text-muted-foreground">Calle Real 123, 28411 Moralzarzal, Madrid</p>
              <p className="text-muted-foreground">Email: info@vetwonder.es</p>
              <p className="text-muted-foreground">Teléfono: 651 50 38 27</p>
            </div>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Última actualización: Noviembre 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
