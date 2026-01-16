import { useState } from 'react';
import { CLINICS, type Clinic } from '@/data/clinics';
import { MapPin } from 'lucide-react';

export const ClinicMap = () => {
  const [activeClinic, setActiveClinic] = useState<Clinic>(CLINICS[0]);

  return (
    <div className="space-y-4">
      {/* Clinic Selector Tabs */}
      <div className="flex gap-2">
        {CLINICS.map((clinic) => (
          <button
            key={clinic.id}
            onClick={() => setActiveClinic(clinic)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeClinic.id === clinic.id
                ? 'bg-white text-primary shadow-md'
                : 'bg-white/20 text-white/90 hover:bg-white/30'
            }`}
          >
            <MapPin className="h-4 w-4" />
            {clinic.shortName}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="w-full h-[350px] rounded-lg overflow-hidden shadow-lg bg-white/10">
        <iframe
          src={activeClinic.googleMapsEmbed}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Ubicación de ${activeClinic.name}`}
        />
      </div>

      {/* Address Display */}
      <div className="text-center text-white/80 text-sm">
        <a
          href={activeClinic.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:underline transition-colors"
        >
          {activeClinic.address.street}, {activeClinic.address.postalCode} {activeClinic.address.city}
        </a>
      </div>
    </div>
  );
};
