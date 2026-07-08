export const SITE = {
  name: "Nayab Furniture",
  tagline: "Handcrafted luxury furniture in Peshawar",
  whatsapp: "03111088001",
  whatsappDisplay: "0311 1088001",
  email: "nayabfurniturehayatabad@gmail.com",
  address: {
    line1: "Ring Road, Achini Payan",
    line2: "Hayatabad, Peshawar",
    region: "Khyber Pakhtunkhwa, Pakistan",
  },
  hours: "Monday – Sunday, 10:00 AM – 9:00 PM",
  mapsQuery: "Nayab+Furniture+Ring+Road+Achini+Payan+Hayatabad+Peshawar",
  mapsEmbedQuery: "Nayab+Furniture+Hayatabad+Peshawar",
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://api.whatsapp.com/send?phone=${SITE.whatsapp}`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
}
