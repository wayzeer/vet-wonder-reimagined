import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-foreground))] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">🐾 VetWonder</h3>
            <p className="text-sm opacity-80 mb-4">
              Clínica veterinaria en Moralzarzal dedicada al cuidado integral de tu mascota.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
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

          {/* Servicios */}
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Medicina Preventiva</li>
              <li>Cirugía</li>
              <li>Urgencias</li>
              <li>Vacunación</li>
              <li>Peluquería</li>
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
          <p>© 2024 VetWonder. Todos los derechos reservados.</p>
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
