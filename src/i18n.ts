import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Locale = 'es' | 'en';

const STORAGE_KEY = 'punto_locale';

export const TRANSLATIONS = {
  es: {
    languageSwitcherLabel: 'Selector de idioma',
    waitlist: {
      headline: 'Punto: encuentra a tu cofundador',
      subtitle:
        'Punto es la app que conecta a emprendedores para encontrar cofundador, socio técnico o equipo con el que lanzar una startup juntos.',
      counterLabel: 'personas en espera',
      emailLabel: 'Tu correo electrónico',
      emailPlaceholder: 'Tu correo electrónico',
      submitButton: 'Unirme a la lista',
      submittingButton: 'Procesando...',
      consentPrefix: 'Acepto la',
      consentLink: 'Política de privacidad',
      consentSuffix:
        'y recibir novedades y un correo cuando Punto esté disponible. Puedo darme de baja cuando quiera.',
      heartNote: 'Te avisaremos cuando Punto esté listo',
      errors: {
        emptyEmail: 'Introduce tu correo electrónico para unirte a la lista.',
        invalidEmail:
          'Revisa el formato de tu correo electrónico (ejemplo: nombre@correo.com).',
        missingConsent: 'Marca la casilla para continuar',
        duplicateEmail: '¡Ya estás en la lista! 🎉',
        generic: 'No pudimos completar tu registro en este momento. Inténtalo de nuevo.',
      },
    },
    confirmation: {
      title: '¡Ya formas parte de Punto!',
      subtitle:
        'Tu correo está en nuestra lista de espera. Te avisaremos cuando llegue el momento.',
      counterLabel: 'personas en espera',
      growing: 'En aumento',
      reminderTitle: 'Aviso de lanzamiento',
      reminderBody: 'Solo te escribiremos cuando Punto esté listo.',
      backButton: 'Volver al inicio',
      socialsLabel: 'Redes sociales de Punto',
      socialsHeading: 'Síguenos para más novedades',
    },
    unsubscribe: {
      title: 'Preferencias actualizadas',
      subtitle:
        'Tu solicitud de baja ha sido registrada. Si necesitas ayuda adicional, puedes escribirnos en cualquier momento.',
      backButton: 'Volver al inicio',
    },
    counter: {
      loadingAria: 'Cargando contador',
      idleAria: 'Contador',
    },
    footer: {
      legalAria: 'Legal',
      privacy: 'Privacidad',
      deleteAccount: 'Eliminar cuenta',
      terms: 'Términos',
      childSafety: 'Seguridad infantil',
      legalNotice: 'Aviso legal',
    },
  },
  en: {
    languageSwitcherLabel: 'Language selector',
    waitlist: {
      headline: 'Find your co-founder.',
      subtitle:
        'Punto connects entrepreneurs with the partners they need to build their idea.',
      counterLabel: 'people waiting',
      emailLabel: 'Your email address',
      emailPlaceholder: 'Your email address',
      submitButton: 'Join the waitlist',
      submittingButton: 'Joining...',
      consentPrefix: 'I accept the',
      consentLink: 'Privacy Policy',
      consentSuffix:
        'and agree to receive updates and an email when Punto launches. I can unsubscribe anytime.',
      heartNote: "We'll let you know when Punto is ready",
      errors: {
        emptyEmail: 'Enter your email address to join the waitlist.',
        invalidEmail: 'Check your email format (example: name@email.com).',
        missingConsent: 'Check the box to continue',
        duplicateEmail: "You're already on the list! 🎉",
        generic: "We couldn't complete your signup right now. Please try again.",
      },
    },
    confirmation: {
      title: "You're in!",
      subtitle: "We'll let you know when Punto launches.",
      counterLabel: 'people waiting',
      growing: 'Growing',
      reminderTitle: 'Launch alert',
      reminderBody: "We'll only email you when Punto is ready.",
      backButton: 'Back to home',
      socialsLabel: 'Punto social media',
      socialsHeading: 'Follow us for updates',
    },
    unsubscribe: {
      title: 'Preferences updated',
      subtitle:
        'Your unsubscribe request has been recorded. If you need anything else, feel free to write to us anytime.',
      backButton: 'Back to home',
    },
    counter: {
      loadingAria: 'Loading counter',
      idleAria: 'Counter',
    },
    footer: {
      legalAria: 'Legal',
      privacy: 'Privacy',
      deleteAccount: 'Delete account',
      terms: 'Terms',
      childSafety: 'Child safety',
      legalNotice: 'Legal notice',
    },
  },
} as const;

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'es';
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignorar si localStorage no está disponible
  }

  const browserLang = (window.navigator.language || '').toLowerCase();
  return browserLang.startsWith('es') ? 'es' : 'en';
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (typeof TRANSLATIONS)[Locale];
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'es',
  setLocale: () => {},
  t: TRANSLATIONS.es,
});

export function I18nProvider({
  children,
  forcedLocale,
}: {
  children: ReactNode;
  forcedLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => forcedLocale ?? detectInitialLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignorar si localStorage no está disponible
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return createElement(
    I18nContext.Provider,
    { value: { locale, setLocale, t: TRANSLATIONS[locale] } },
    children,
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
