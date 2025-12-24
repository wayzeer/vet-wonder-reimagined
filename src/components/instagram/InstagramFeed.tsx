import { useEffect } from "react";

export function InstagramFeed() {
  // Elfsight Instagram Feed widget for VetWonder clinic
  const elfsightWidgetId = "elfsight-app-9f5f14e1-99fc-4c05-9ac1-4e812881fd3b";

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
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Síguenos en redes sociales</h2>
        <p className="text-lg text-muted-foreground">
          Consejos, casos clínicos y mucho más en nuestro Instagram
        </p>
      </div>

      {/* Elfsight Instagram Feed Widget */}
      <div className="elfsight-app-feed-container min-h-[400px]">
        <div className={elfsightWidgetId} data-elfsight-app-lazy />
      </div>
    </div>
  );
}
