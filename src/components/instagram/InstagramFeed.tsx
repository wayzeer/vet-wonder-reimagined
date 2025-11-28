import { Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";

export function InstagramFeed() {
  // Instagram handle del usuario
  const instagramHandle = "lahuella_dewonder";
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
          Adopta un compañero de vida
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          Conoce a los animales que buscan hogar en La Huella de Wonder
        </p>
        <a 
          href={`https://www.instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <Instagram className="h-5 w-5" />
          @{instagramHandle}
        </a>
      </div>

      {/* Elfsight Instagram Feed Widget */}
      <div className="elfsight-app-feed-container">
        <script 
          src="https://static.elfsight.com/platform/platform.js" 
          data-use-service-core 
          defer
        />
        <div 
          className="elfsight-app-c2a8e9b7-9f8f-4c13-b8e5-9e8f8f8f8f8f" 
          data-elfsight-app-lazy
        />
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
