import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Clock, Heart } from "lucide-react";
import { CLINICS, PRIMARY_PHONE, PRIMARY_EMAIL } from "@/data/clinics";

export const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-foreground))] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">VetWonder</h3>
            <p className="text-sm opacity-80 mb-4">
              Clínicas veterinarias en la Sierra de Madrid dedicadas al cuidado integral de tu mascota.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/vetwonder/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/vetwonder" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
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

          {/* Contacto - Multiple Clinics */}
          <div>
            <h4 className="font-semibold mb-4">Nuestras Clínicas</h4>
            <ul className="space-y-4 text-sm">
              {CLINICS.map((clinic) => (
                <li key={clinic.id} className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                  <div className="opacity-80">
                    <span className="font-medium">{clinic.shortName}</span>
                    <br />
                    {clinic.address.street}
                    <br />
                    {clinic.address.postalCode} {clinic.address.city}
                  </div>
                </li>
              ))}
              <li className="flex items-center gap-2 pt-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href={`tel:${PRIMARY_PHONE.replace(/\s/g, '')}`} className="opacity-80 hover:text-primary transition-colors">
                  {PRIMARY_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href={`mailto:${PRIMARY_EMAIL}`} className="opacity-80 hover:text-primary transition-colors">
                  {PRIMARY_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                <div className="opacity-80">
                  <div>L-V: 10:00 - 14:00 / 17:00 - 20:00</div>
                  <div>Sáb: 10:00 - 14:00</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Shelter collaboration mention */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-sm opacity-80 flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            Colaboramos con{" "}
            <a
              href="https://www.lahuelladewonder.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              La Huella de Wonder
            </a>
            , protectora de animales en Collado Mediano
          </p>
        </div>

        <div className="border-t border-white/10 mt-6 pt-6 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} VetWonder. Todos los derechos reservados.</p>
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
