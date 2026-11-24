export const PUNTO_BRAND = {
  name: 'Punto',
  developer: 'MCD Group',
  tagline: 'Conecta. Crea. Comparte.',
  siteUrl: 'https://usepunto.com',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.mcdgroup.punto',
  contactEmail: 'hola@usepunto.com',
  reportsEmail: 'mcdgroup.dev@gmail.com',
  socials: [
    {
      id: 'tiktok',
      label: 'TikTok de Punto',
      href: 'https://www.tiktok.com/@punto_app',
    },
    {
      id: 'instagram',
      label: 'Instagram de Punto',
      href: 'https://www.instagram.com/punto.connect?dlrf=MXFsdXc3ZnQ4dDloaA==',
    },
    {
      id: 'youtube',
      label: 'YouTube de Punto',
      href: 'https://youtube.com/@punto.connect?si=ISIRB4yp44nH7zW6',
    },
  ],
} as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  const normalized = normalizeEmail(raw);
  if (normalized.length < 5 || normalized.length > 254) {
    return false;
  }
  return EMAIL_REGEX.test(normalized);
}
