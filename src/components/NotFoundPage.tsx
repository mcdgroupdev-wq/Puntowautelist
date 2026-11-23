import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { MouseEvent } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { AmbientBackdrop } from './AmbientBackdrop';
import { PuntoBrandMark } from './PuntoLogo';
import { ScreenShell } from './ScreenShell';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  function handleHome(event: MouseEvent<HTMLAnchorElement>) {
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
    onNavigate('/');
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#E9ECF2] text-[#0B0B0D]">
      <AmbientBackdrop />

      <ScreenShell>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-1 flex-col justify-between"
        >
          <header className="flex w-full items-center justify-center pt-1">
            <a href="/" onClick={handleHome}>
              <PuntoBrandMark symbolSize={40} />
            </a>
          </header>

          <main className="my-auto py-8 text-center">
            <span className="inline-flex items-center justify-center rounded-full border border-black/[0.06] bg-white/90 px-3.5 py-1 text-[12px] font-bold tracking-wider text-[#52525B]">
              404
            </span>

            <h1 className="font-display mt-5 text-[28px] leading-[1.1] font-bold tracking-[-0.03em] text-[#0B0B0D]">
              Página no encontrada
            </h1>

            <p className="mx-auto mt-3 max-w-[32ch] text-[14px] leading-[1.55] text-[#52525B]">
              La dirección que buscas no existe o ha sido movida. Puedes volver a la página principal de Punto.
            </p>

            <div className="mt-7">
              <a
                href="/"
                onClick={handleHome}
                className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0C] px-7 text-[15px] font-semibold text-white shadow-[0_12px_24px_rgba(10,10,12,0.16)] transition-colors hover:bg-[#1C1C20] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0B0B0D]/20"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                <span>Volver al inicio</span>
              </a>
            </div>
          </main>

          <footer className="flex w-full items-center justify-center pt-2">
            <p className="text-[11.5px] font-medium text-[#71717A]">
              {PUNTO_BRAND.name} <span aria-hidden="true">·</span> {PUNTO_BRAND.developer}
            </p>
          </footer>
        </motion.div>
      </ScreenShell>
    </div>
  );
}
