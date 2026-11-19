import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { PuntoSymbol } from './PuntoLogo';

interface IntroSequenceProps {
  onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState<'separated' | 'merged' | 'named' | 'tagline'>('separated');

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const quickTimer = window.setTimeout(onComplete, 180);
      return () => window.clearTimeout(quickTimer);
    }

    const t1 = window.setTimeout(() => setStep('merged'), 560);
    const t2 = window.setTimeout(() => setStep('named'), 1080);
    const t3 = window.setTimeout(() => setStep('tagline'), 1440);
    const t4 = window.setTimeout(() => onComplete(), 2700);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [onComplete]);

  const isSeparated = step === 'separated';
  const showName = step === 'named' || step === 'tagline';
  const showTagline = step === 'tagline';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col items-center justify-between py-4"
      role="region"
      aria-label="Introducción de Punto"
    >
      <div className="h-8" aria-hidden="true" />

      <div className="relative flex flex-col items-center text-center">
        {/* Doble halo expansivo al unirse las dos piezas del logo */}
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.68 }}
            animate={{
              opacity: isSeparated ? 0 : [0, 0.95, 0.68],
              scale: isSeparated ? 0.68 : [0.85, 1.42, 1.3],
            }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute h-36 w-36 rounded-full border border-white bg-white/65 shadow-[0_0_55px_rgba(255,255,255,0.95)]"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{
              opacity: isSeparated ? 0 : [0, 0.75, 0.42],
              scale: isSeparated ? 0.65 : [0.9, 1.78, 1.65],
            }}
            transition={{ duration: 1.0, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute h-36 w-36 rounded-full border border-white/80"
            aria-hidden="true"
          />

          {/* Trazos diagonales animados al conectar */}
          <motion.svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            initial={{ opacity: 0, scale: 0.5, x: -6, y: 6 }}
            animate={{
              opacity: isSeparated ? 0 : 1,
              scale: isSeparated ? 0.5 : 1,
              x: isSeparated ? -6 : 0,
              y: isSeparated ? 6 : 0,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.08 }}
            className="pointer-events-none absolute -top-5 -right-4"
            aria-hidden="true"
          >
            <line x1="6" y1="21" x2="12" y2="5" stroke="#0B0B0D" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="14" y1="24" x2="26" y2="14" stroke="#0B0B0D" strokeWidth="2.8" strokeLinecap="round" />
          </motion.svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{
              opacity: 1,
              scale: isSeparated ? 1 : [1, 1.06, 1],
            }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          >
            <PuntoSymbol size={132} separated={isSeparated} />
          </motion.div>
        </div>

        {/* Sombra dinámica bajo el logo */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{
            opacity: isSeparated ? 0.28 : 0.08,
            scaleX: isSeparated ? 1 : 0.72,
          }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 h-2.5 w-24 rounded-full bg-black/25 blur-md"
          aria-hidden="true"
        />

        {/* Nombre de marca */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: showName ? 1 : 0,
            y: showName ? 0 : 12,
          }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3"
        >
          <span className="font-display text-[38px] font-bold tracking-[-0.035em] text-[#0B0B0D]">
            {PUNTO_BRAND.name}
          </span>
        </motion.div>

        {/* Lema */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: showTagline ? 1 : 0,
            y: showTagline ? 0 : 8,
          }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-1 text-[14.5px] font-medium tracking-[-0.01em] text-[#27272A]"
        >
          {PUNTO_BRAND.tagline}
        </motion.p>
      </div>

      {/* Barra de progreso conectada + saltar */}
      <div className="flex flex-col items-center gap-3 pb-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showTagline ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
          aria-hidden="true"
        >
          <span className={`h-2 w-2 rounded-full transition-colors ${isSeparated ? 'bg-[#D4D4D8]' : 'bg-[#0B0B0D]'}`} />
          <span className="h-[1.5px] w-4 bg-[#D4D4D8]" />
          <span className={`h-1.5 w-1.5 rounded-full transition-colors ${showTagline ? 'bg-[#0B0B0D]' : 'bg-[#D4D4D8]'}`} />
          <span className="h-[1.5px] w-4 bg-[#D4D4D8]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4D4D8]" />
        </motion.div>

        <button
          type="button"
          onClick={onComplete}
          className="inline-flex min-h-[40px] items-center px-3 py-1.5 text-[12px] font-medium text-[#71717A] transition-colors hover:text-[#0B0B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0D]/30 rounded-full whitespace-nowrap"
        >
          Saltar
        </button>
      </div>
    </motion.div>
  );
}
