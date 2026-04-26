// Update these values with your actual contact details
export const CONTACT = {
  whatsapp: "+918282096555",
  whatsappDisplay: "+91 8282 096 555",
  phone: "+919883242976",
  phoneDisplay: "+91 9883 242 976",
  email: "mbcartkol@gmail.com",
  location: "Kolkata, West Bengal, India",
  address: "P-3, Madan Chatterjee Ln, Raja Katra, Singhi Bagan, Jorasanko, Kolkata, West Bengal 700007",
  mapsUrl: "https://share.google/YXfJKiEYJOvW59vgh",
} as const;

export function whatsappLink(message?: string): string {
  const num = CONTACT.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(
    message ?? "Hi! I'm interested in your collections at MBC ART."
  );
  return `https://wa.me/${num}?text=${text}`;
}
