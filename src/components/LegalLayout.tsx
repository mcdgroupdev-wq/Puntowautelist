import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { MouseEvent, ReactNode } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { AmbientBackdrop } from './AmbientBackdrop';
import { PuntoBrandMark } from './PuntoLogo';

interface LegalLayoutProps {
  children: ReactNode;
  onNavigate: (path: string) => void;
  activePath:
    | '/privacidad'
    | '/terminos'
    | '/aviso-legal'
    | '/seguridad-infantil'
    | '/eliminar-cuenta';
}

export function LegalLayout({ children, onNavigate, activePath }: LegalLayoutProps) {
  function handleInternalLink(event: MouseEvent<HTMLAnchorElement>, path: string) {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    onNavigate(path);
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#E9ECF2] text-[#0B0B0D]">
      <AmbientBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 py-6 sm:px-6 sm:py-10">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] border border-black/[0.05] bg-white/92 shadow-[0_24px_70px_rgba(15,23,42,0.08),0_4px_16px_rgba(15,23,42,0.03)] backdrop-blur-xl sm:rounded-[36px] print:border-0 print:bg-white print:shadow-none"
        >
          {/* Cabecera fija tipo app con logo de Punto y botón Volver */}
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 rounded-t-[28px] border-b border-black/[0.06] bg-white/85 px-5 py-3.5 backdrop-blur-xl sm:rounded-t-[36px] sm:px-9 sm:py-4 print:hidden">
            <a
              href="/"
              onClick={(e) => handleInternalLink(e, '/')}
              className="inline-flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/10"
              aria-label="Ir al inicio de Punto"
            >
              <PuntoBrandMark symbolSize={34} />
            </a>

            <a
              href="/"
              onClick={(e) => handleInternalLink(e, '/')}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#0B0B0D] shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#F4F5F7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/10 whitespace-nowrap"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
              <span>Volver</span>
            </a>
          </header>

          {/* Contenido legal legible */}
          <div className="px-5 py-7 sm:px-10 sm:py-10">{children}</div>

          {/* Pie de página legal */}
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-black/[0.06] bg-[#FAFAFB]/80 px-5 py-5 text-center sm:flex-row sm:px-10 sm:text-left">
            <p className="text-[12px] font-medium text-[#71717A]">
              {PUNTO_BRAND.name} <span aria-hidden="true">·</span> {PUNTO_BRAND.developer}
            </p>
            <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-3 text-[12px] font-medium">
              <a
                href="/privacidad"
                onClick={(e) => handleInternalLink(e, '/privacidad')}
                className={`transition-colors ${
                  activePath === '/privacidad'
                    ? 'font-semibold text-[#0B0B0D]'
                    : 'text-[#71717A] hover:text-[#0B0B0D]'
                }`}
              >
                Privacidad
              </a>
              <span aria-hidden="true" className="text-[#D4D4D8]">
                ·
              </span>
              <a
                href="/eliminar-cuenta"
                onClick={(e) => handleInternalLink(e, '/eliminar-cuenta')}
                className={`transition-colors ${
                  activePath === '/eliminar-cuenta'
                    ? 'font-semibold text-[#0B0B0D]'
                    : 'text-[#71717A] hover:text-[#0B0B0D]'
                }`}
              >
                Eliminar cuenta
              </a>
              <span aria-hidden="true" className="text-[#D4D4D8]">
                ·
              </span>
              <a
                href="/terminos"
                onClick={(e) => handleInternalLink(e, '/terminos')}
                className={`transition-colors ${
                  activePath === '/terminos'
                    ? 'font-semibold text-[#0B0B0D]'
                    : 'text-[#71717A] hover:text-[#0B0B0D]'
                }`}
              >
                Términos
              </a>
              <span aria-hidden="true" className="text-[#D4D4D8]">
                ·
              </span>
              <a
                href="/seguridad-infantil"
                onClick={(e) => handleInternalLink(e, '/seguridad-infantil')}
                className={`transition-colors ${
                  activePath === '/seguridad-infantil'
                    ? 'font-semibold text-[#0B0B0D]'
                    : 'text-[#71717A] hover:text-[#0B0B0D]'
                }`}
              >
                Seguridad infantil
              </a>
              <span aria-hidden="true" className="text-[#D4D4D8]">
                ·
              </span>
              <a
                href="/aviso-legal"
                onClick={(e) => handleInternalLink(e, '/aviso-legal')}
                className={`transition-colors ${
                  activePath === '/aviso-legal'
                    ? 'font-semibold text-[#0B0B0D]'
                    : 'text-[#71717A] hover:text-[#0B0B0D]'
                }`}
              >
                Aviso legal
              </a>
              <span aria-hidden="true" className="text-[#D4D4D8]">
                ·
              </span>
              <a
                href="/"
                onClick={(e) => handleInternalLink(e, '/')}
                className="text-[#71717A] transition-colors hover:text-[#0B0B0D]"
              >
                Volver al inicio
              </a>
            </nav>
          </footer>
        </motion.article>
      </div>
    </div>
  );
}
