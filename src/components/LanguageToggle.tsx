import { useI18n } from '../i18n';

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.languageSwitcherLabel}
      className="inline-flex items-center rounded-full border border-black/[0.06] bg-white/85 px-2.5 py-1 text-[11.5px] font-medium text-[#71717A] shadow-[0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-sm select-none"
    >
      <button
        type="button"
        onClick={() => setLocale('es')}
        aria-pressed={locale === 'es'}
        className={`cursor-pointer px-1 transition-colors ${
          locale === 'es' ? 'font-bold text-[#0B0B0D]' : 'hover:text-[#0B0B0D]'
        }`}
      >
        ES
      </button>
      <span aria-hidden="true" className="text-[#D4D4D8]">
        |
      </span>
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`cursor-pointer px-1 transition-colors ${
          locale === 'en' ? 'font-bold text-[#0B0B0D]' : 'hover:text-[#0B0B0D]'
        }`}
      >
        EN
      </button>
    </div>
  );
}
