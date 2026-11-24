import { ArrowUpRight, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import type { MouseEvent } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { AnimatedCounter } from './AnimatedCounter';
import { PuntoBrandMark } from './PuntoLogo';

interface ConfirmationViewProps {
  count: number | null;
  onBack: () => void;
  onNavigate?: (path: string) => void;
}

function PeopleTrioIllustration() {
  return (
    <svg
      width="94"
      height="58"
      viewBox="0 0 98 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <radialGradient id="fig-dark" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="55%" stopColor="#141417" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
        <radialGradient id="fig-light" cx="35%" cy="25%" r="78%">
          <stop offset="0%" stopColor="#F4F4F5" />
          <stop offset="65%" stopColor="#D4D4D8" />
          <stop offset="100%" stopColor="#A1A1AA" />
        </radialGradient>
      </defs>

      <ellipse cx="49" cy="54" rx="38" ry="3.5" fill="#000000" fillOpacity="0.08" />

      <circle cx="17" cy="27" r="6.5" fill="url(#fig-light)" />
      <path
        d="M 6 50 C 6 42.8203 10.9249 37 17 37 C 23.0751 37 28 42.8203 28 50 V 52 H 6 V 50 Z"
        fill="url(#fig-light)"
      />

      <circle cx="77" cy="23" r="8.5" fill="url(#fig-light)" />
      <path
        d="M 62 52 C 62 43.1634 68.7157 36 77 36 C 85.2843 36 92 43.1634 92 52 V 54 H 62 V 52 Z"
        fill="url(#fig-light)"
      />

      <circle cx="46" cy="18" r="10.5" fill="url(#fig-dark)" />
      <path
        d="M 27 54 C 27 42.9543 35.5066 34 46 34 C 56.4934 34 65 42.9543 65 54 V 56 H 27 V 54 Z"
        fill="url(#fig-dark)"
      />
    </svg>
  );
}

function SocialIcon({ id }: { id: 'tiktok' | 'instagram' | 'youtube' }) {
  if (id === 'tiktok') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.28a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.76a8.26 8.26 0 0 0 4.79 1.52V6.83a4.84 4.84 0 0 1-.88-.14Z" />
      </svg>
    );
  }
  if (id === 'instagram') {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.6 15.62V8.38L15.88 12 9.6 15.62Z" />
    </svg>
  );
}

export function ConfirmationView({
  count,
  onBack,
  onNavigate,
}: ConfirmationViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col justify-between"
    >
      <header className="flex w-full items-center justify-center pt-1">
        <PuntoBrandMark symbolSize={38} />
      </header>

      <main className="my-auto w-full py-4 text-center">
        {/* Emblema animado de éxito */}
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{ opacity: [0.6, 1, 0.85], scale: [0.8, 1.05, 1] }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 rounded-full border border-white bg-white/75 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-2.5 rounded-full border border-white bg-white/90"
            aria-hidden="true"
          />

          {/* Partículas flotantes orgánicas */}
          <motion.span
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0.9, scale: 1, x: -52, y: 2 }}
            transition={{ duration: 0.65, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-3.5 w-2 -rotate-24 rounded-full bg-[#18181B]"
            aria-hidden="true"
          />
          <motion.span
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0.85, scale: 1, x: -30, y: -40 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-2.5 w-1 rotate-[-32deg] rounded-full bg-[#18181B]"
            aria-hidden="true"
          />
          <motion.span
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0.9, scale: 1, x: 5, y: -54 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-2 w-2 rounded-full bg-[#18181B]"
            aria-hidden="true"
          />
          <motion.span
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0.8, scale: 1, x: 46, y: 16 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-2.5 w-1 rotate-[48deg] rounded-full bg-[#18181B]"
            aria-hidden="true"
          />
          <motion.span
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0.65, scale: 1, x: -42, y: 34 }}
            transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-2.5 w-1.5 rotate-[38deg] rounded-full bg-[#71717A]"
            aria-hidden="true"
          />

          {/* Pulso expansivo al completarse el check */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.85, 1.55], opacity: [0.45, 0] }}
            transition={{ delay: 0.22, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute h-[68px] w-[68px] rounded-full border-2 border-[#0A0A0C]/25"
            aria-hidden="true"
          />

          <motion.div
            initial={{ scale: 0.45, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#0A0A0C] text-white shadow-[0_14px_28px_rgba(10,10,12,0.22)]"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                d="M 8 16.5 L 13.5 22 L 24 10.5"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { delay: 0.2, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                  opacity: { delay: 0.2, duration: 0.1 },
                }}
              />
            </svg>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-display mt-4 text-[28px] leading-[1.1] font-bold tracking-[-0.03em] text-[#0B0B0D]"
            style={{ textWrap: 'balance' }}
          >
            ¡Ya formas parte de Punto!
          </h1>

          <p className="mx-auto mt-2.5 max-w-[34ch] text-[13.5px] leading-[1.52] text-[#52525B]">
            Tu correo está en nuestra lista de espera. Te avisaremos cuando llegue el momento.
          </p>
        </motion.div>

        {/* Tarjeta del contador actual */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 rounded-[24px] border border-white bg-white/90 px-4 py-3.5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-display text-[26px] font-bold leading-none tracking-[-0.03em] text-[#0B0B0D]">
                <AnimatedCounter
                  value={count}
                  loading={false}
                />
              </div>
              <p className="mt-1 text-[12px] font-medium text-[#52525B]">
                personas en espera
              </p>
              {count !== null && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[#52525B]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                    <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span>En aumento</span>
                </div>
              )}
            </div>

            <PeopleTrioIllustration />
          </div>
        </motion.div>

        {/* Recordatorio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 flex items-center gap-3 rounded-[22px] border border-white bg-white/80 px-4 py-2.5 text-left shadow-[0_6px_18px_rgba(15,23,42,0.04)] backdrop-blur-sm"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F2F6] text-[#0B0B0D]">
            <Bell className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#0B0B0D]">Aviso de lanzamiento</p>
            <p className="text-[12px] text-[#71717A]">
              Solo te escribiremos cuando Punto esté listo.
            </p>
          </div>
        </motion.div>

        {/* Botón secundario Volver al inicio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4"
        >
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            className="inline-flex h-[50px] w-full items-center justify-center rounded-full bg-[#0A0A0C] px-7 text-[14.5px] font-semibold text-white shadow-[0_12px_24px_rgba(10,10,12,0.16)] transition-colors duration-150 hover:bg-[#1C1C20] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0B0B0D]/20 whitespace-nowrap"
          >
            Volver al inicio
          </motion.button>
        </motion.div>

        {/* Redes sociales */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="mt-6"
          aria-label="Redes sociales de Punto"
        >
          <h2 className="font-display text-[14px] font-bold tracking-[-0.01em] text-[#0B0B0D]">
            Síguenos para más novedades
          </h2>
          <div className="mt-3 flex items-center justify-center gap-3">
            {PUNTO_BRAND.socials.map((social) => (
              <motion.a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/95 text-[#0B0B0D] shadow-[0_6px_16px_rgba(15,23,42,0.06)] transition-shadow duration-150 hover:shadow-[0_10px_22px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/10"
              >
                <SocialIcon id={social.id} />
              </motion.a>
            ))}
          </div>
        </motion.section>

        <div className="mx-auto mt-5 flex max-w-[230px] items-center justify-center" aria-hidden="true">
          <div className="h-[1px] flex-1 bg-black/[0.08]" />
          <div className="h-[3px] w-6 rounded-full bg-black/[0.15]" />
          <div className="h-[1px] flex-1 bg-black/[0.08]" />
        </div>
      </main>

      <footer className="flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 pt-1">
        <p className="text-[11.5px] font-medium text-[#52525B]">
          {PUNTO_BRAND.name} <span aria-hidden="true">·</span> {PUNTO_BRAND.developer}
        </p>
        <span aria-hidden="true" className="text-[11.5px] text-[#52525B]">
          ·
        </span>
        <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-2 text-[11.5px] font-medium text-[#52525B]">
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
            href="/eliminar-cuenta"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/eliminar-cuenta');
              }
            }}
            className="transition-colors hover:text-[#0B0B0D]"
          >
            Eliminar cuenta
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
          <span aria-hidden="true">·</span>
          <a
            href="/seguridad-infantil"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/seguridad-infantil');
              }
            }}
            className="transition-colors hover:text-[#0B0B0D]"
          >
            Seguridad infantil
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="/aviso-legal"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onNavigate('/aviso-legal');
              }
            }}
            className="transition-colors hover:text-[#0B0B0D]"
          >
            Aviso legal
          </a>
        </nav>
      </footer>
    </motion.div>
  );
}
