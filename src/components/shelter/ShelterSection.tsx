import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShelterSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Heart className="h-8 w-8 text-primary fill-primary/20" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                        Conoce a La Huella de Wonder
                    </h2>

                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        VetWonder colabora activamente con <strong className="text-foreground">La Huella de Wonder</strong>,
                        protectora de animales en Collado Mediano (Madrid). Juntos trabajamos para dar una segunda
                        oportunidad a animales abandonados. Parte de nuestros ingresos se destinan a su cuidado.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="gap-2"
                        >
                            <a
                                href="https://www.lahuelladewonder.es/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visitar la protectora
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="gap-2"
                        >
                            <a
                                href="https://www.lahuelladewonder.es/adopta-salva-2-vidas/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Heart className="h-4 w-4" />
                                Ver animales en adopción
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
