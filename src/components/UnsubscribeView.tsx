import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import type { MouseEvent } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { PuntoBrandMark } from './PuntoLogo';

interface UnsubscribeViewProps {
  token: string;
  onGoHome: () => void;
  onNavigate?: (path: string) => void;
}

export function UnsubscribeView({ onGoHome, onNavigate }: UnsubscribeViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col justify-between"
    >
      <header className="flex w-full items-center justify-center pt-1">
        <PuntoBrandMark symbolSize={36} />
      </header>

      <main className="my-auto w-full py-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <Check className="h-7 w-7 text-[#0B0B0D]" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <h1 className="font-display mt-6 text-[26px] font-bold tracking-[-0.03em] text-[#0B0B0D]">
          Preferencias actualizadas
        </h1>

        <p className="mx-auto mt-3 max-w-[34ch] text-[14px] leading-[1.55] text-[#52525B]">
          Tu solicitud de baja ha sido registrada. Si necesitas ayuda adicional, puedes escribirnos en
          cualquier momento.
        </p>

        <div className="mt-7">
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex h-[50px] w-full items-center justify-center rounded-full bg-[#0A0A0C] px-8 text-[15px] font-semibold text-white transition-all hover:bg-[#1C1C20] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0B0B0D]/20 whitespace-nowrap"
          >
            Volver al inicio
          </button>
        </div>
      </main>

      <footer className="flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 pt-2">
        <p className="text-[11.5px] font-medium text-[#71717A]">
          {PUNTO_BRAND.name} <span aria-hidden="true">·</span> {PUNTO_BRAND.developer}
        </p>
        <span aria-hidden="true" className="text-[11.5px] text-[#71717A]">
          ·
        </span>
        <nav aria-label="Legal" className="flex items-center gap-2 text-[11.5px] font-medium text-[#71717A]">
          <a
            href="/privacidad"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/privacidad');
              }
            }}
            className="transition-colors hover:text-[#0B0B0D]"
          >
            Privacidad
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="/terminos"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/terminos');
              }
            }}
            className="transition-colors hover:text-[#0B0B0D]"
          >
            Términos
          </a>
        </nav>
      </footer>
    </motion.div>
  );
}
