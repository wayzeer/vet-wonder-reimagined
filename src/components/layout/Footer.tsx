import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Clock, Heart, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-foreground))] py-12">
      <div className="container mx-auto px-4">
        {/* Solidarity Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <span className="font-semibold text-primary">Clínica Veterinaria Solidaria</span>
            <Heart className="h-5 w-5 text-primary fill-primary" />
          </div>
          <p className="text-sm opacity-90 mb-3">
            VetWonder colabora activamente con <strong>La Huella de Wonder</strong>, protectora de animales en Collado Mediano (Madrid).
            Parte de nuestros ingresos se destinan al cuidado de animales abandonados.
          </p>
          <a
            href="https://www.lahuelladewonder.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Conoce La Huella de Wonder
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">🐾 VetWonder</h3>
            <p className="text-sm opacity-80 mb-4">
              Clínica veterinaria en Moralzarzal dedicada al cuidado integral de tu mascota.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/lahuelladewonder/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/lahuelladewonder" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="opacity-80 hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="opacity-80 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="opacity-80 hover:text-primary transition-colors">
                  Área Cliente
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="opacity-80 hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* La Huella de Wonder */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              La Huella de Wonder
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.lahuelladewonder.es/adoptar/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-primary transition-colors flex items-center gap-1">
                  Adopta un animal
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.lahuelladewonder.es/ayudar-protectora-animales/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-primary transition-colors flex items-center gap-1">
                  Cómo ayudar
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.teaming.net/lahuelladewonder" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-primary transition-colors flex items-center gap-1">
                  Teaming (1€/mes)
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://www.lahuelladewonder.es/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-primary transition-colors flex items-center gap-1">
                  Web de la protectora
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                <span className="opacity-80">C. Capellanía, 25, Local 3, 28411 Moralzarzal, Madrid</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="tel:918574379" className="opacity-80 hover:text-primary transition-colors">
                  918 57 43 79
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="mailto:info@vetwonder.es" className="opacity-80 hover:text-primary transition-colors">
                  info@vetwonder.es
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                <div className="opacity-80">
                  <div>Lunes a Viernes: 10:00 - 14:00 / 17:00 - 20:00</div>
                  <div>Sábados: 10:00 - 14:00</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm opacity-70">
          <p>© 2024 VetWonder - Clínica Veterinaria Solidaria con La Huella de Wonder. Todos los derechos reservados.</p>
          <p className="mt-2">
            Web por{" "}
            <a
              href="https://autonomio.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              autonomio.es
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
