export interface Clinic {
  id: string;
  name: string;
  shortName: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    province: string;
  };
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  googleMapsEmbed: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday?: string;
  };
}

export const CLINICS: Clinic[] = [
  {
    id: 'moralzarzal',
    name: 'VetWonder Moralzarzal',
    shortName: 'Moralzarzal',
    address: {
      street: 'C. Capellanía, 25, Local 3',
      postalCode: '28411',
      city: 'Moralzarzal',
      province: 'Madrid',
    },
    phone: '918 57 43 79',
    email: 'info@vetwonder.es',
    coordinates: {
      lat: 40.704392,
      lng: -3.950983,
    },
    googleMapsUrl: 'https://maps.google.com/?q=VetWonder+Moralzarzal',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.5!2d-3.950983!3d40.704392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4188f51a77bd37%3A0xc6f3c8c2c6f3c8c2!2sC.%20Capellan%C3%ADa%2C%2025%2C%2028411%20Moralzarzal%2C%20Madrid!5e0!3m2!1ses!2ses!4v1704067200000!5m2!1ses!2ses',
    hours: {
      weekdays: '10:00 - 14:00 / 17:00 - 20:00',
      saturday: '10:00 - 14:00',
    },
  },
  {
    id: 'collado-mediano',
    name: 'VetWonder Collado Mediano',
    shortName: 'Collado Mediano',
    address: {
      street: 'C/ Real 10, Local 3/4',
      postalCode: '28450',
      city: 'Collado Mediano',
      province: 'Madrid',
    },
    phone: '918 57 43 79', // Same phone or different?
    email: 'info@vetwonder.es',
    coordinates: {
      lat: 40.6916,
      lng: -4.0186,
    },
    googleMapsUrl: 'https://maps.google.com/?q=C/+Real+10+Collado+Mediano+Madrid',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3035.8!2d-4.0186!3d40.6916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4189a8e0000001%3A0x1234567890abcdef!2sC.%20Real%2C%2010%2C%2028450%20Collado%20Mediano%2C%20Madrid!5e0!3m2!1ses!2ses!4v1704067200000!5m2!1ses!2ses',
    hours: {
      weekdays: '10:00 - 14:00 / 17:00 - 20:00',
      saturday: '10:00 - 14:00',
    },
  },
];

export const PRIMARY_PHONE = '918 57 43 79';
export const PRIMARY_EMAIL = 'info@vetwonder.es';

export function formatFullAddress(clinic: Clinic): string {
  return `${clinic.address.street}, ${clinic.address.postalCode} ${clinic.address.city}, ${clinic.address.province}`;
}

export function formatShortAddress(clinic: Clinic): string {
  return `${clinic.address.street}, ${clinic.address.city}`;
}
