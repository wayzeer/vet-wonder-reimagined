import { Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

export function InstagramFeed() {
  const instagramHandle = "lahuella_dewonder";

  // ⚠️ IMPORTANT: Replace with your actual Elfsight widget ID
  // Get it from: https://elfsight.com (after creating Instagram Feed widget)
  // Example: "elfsight-app-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  const elfsightWidgetId = "elfsight-app-9f5f14e1-99fc-4c05-9ac1-4e812881fd3b"; // 👈 REPLACE THIS

  useEffect(() => {
    // Load Elfsight script dynamically
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute("data-use-service-core", "");
    script.defer = true;

    // Only append if not already loaded
    if (!document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]')) {
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Adopta un compañero de vida</h2>
        <p className="text-lg text-muted-foreground mb-4">
          Conoce a los animales que buscan hogar en La Huella de Wonder
        </p>
        <a
          href={`https://www.instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <Instagram className="h-5 w-5" />@{instagramHandle}
        </a>
      </div>

      {/* Elfsight Instagram Feed Widget */}
      <div className="elfsight-app-feed-container min-h-[400px]">
        <div className={elfsightWidgetId} data-elfsight-app-lazy />
      </div>

      {/* Fallback: Manual gallery from gallery_photos table */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="aspect-square overflow-hidden group cursor-pointer">
            <div className="w-full h-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Instagram className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <a
          href={`https://www.instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          Ver más en Instagram
          <Instagram className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
