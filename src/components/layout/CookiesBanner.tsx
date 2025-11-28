import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export const CookiesBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookies-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookies-consent", "accepted");
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookies-consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-foreground))] p-4 shadow-lg z-50 animate-fade-in">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm">
          <p>
            Usamos cookies para mejorar tu experiencia en nuestra web. Al continuar navegando, aceptas nuestra{" "}
            <Link to="/privacidad" className="text-primary hover:underline">
              política de privacidad
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={rejectCookies} variant="outline" size="sm">
            Rechazar
          </Button>
          <Button onClick={acceptCookies} size="sm">
            Aceptar
          </Button>
        </div>
        <button
          onClick={rejectCookies}
          className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-1 hover:bg-white/10 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
