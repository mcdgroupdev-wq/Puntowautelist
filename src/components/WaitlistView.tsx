import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Heart,
  Loader2,
  Mail,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { type FormEvent, type MouseEvent, useId, useState } from 'react';
import { isValidEmail, normalizeEmail, PUNTO_BRAND } from '../config/punto';
import { supabase } from '../lib/supabase';
import { AnimatedCounter } from './AnimatedCounter';
import { PuntoBrandMark } from './PuntoLogo';

interface WaitlistViewProps {
  count: number | null;
  loadingCount: boolean;
  onSuccess: () => Promise<void> | void;
  onNavigate?: (path: string) => void;
}

export function WaitlistView({
  count,
  loadingCount,
  onSuccess,
  onNavigate,
}: WaitlistViewProps) {
  const emailInputId = useId();
  const feedbackMessageId = useId();
  const consentCheckboxId = useId();

  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const normalized = normalizeEmail(email);
    if (!normalized) {
      setDuplicateNotice(null);
      setErrorMessage('Introduce tu correo electrónico para unirte a la lista.');
      return;
    }
    if (!isValidEmail(normalized)) {
      setDuplicateNotice(null);
      setErrorMessage('Revisa el formato de tu correo electrónico (ejemplo: nombre@correo.com).');
      return;
    }

    if (!marketingConsent) {
      setDuplicateNotice(null);
      setErrorMessage('Marca la casilla para continuar');
      return;
    }

    if (!supabase) {
      console.error('Supabase client is not initialized: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
      setDuplicateNotice(null);
      setErrorMessage('No pudimos completar tu registro en este momento. Inténtalo de nuevo.');
      return;
    }

    setErrorMessage(null);
    setDuplicateNotice(null);
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({ email: normalized, consent: true });

      if (error) {
        if (error.code === '23505') {
          setDuplicateNotice('¡Ya estás en la lista! 🎉');
          return;
        }
        console.error(error);
        setErrorMessage('No pudimos completar tu registro en este momento. Inténtalo de nuevo.');
        return;
      }

      await onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMessage('No pudimos completar tu registro en este momento. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col justify-between"
    >
      {/* Cabecera animada con logotipo interactivo */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full items-center justify-center pt-1"
      >
        <PuntoBrandMark symbolSize={42} />
      </motion.header>

      {/* Contenido principal con entrada escalonada */}
      <main className="my-auto w-full py-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1
            className="font-display text-[32px] leading-[1.07] font-bold tracking-[-0.035em] text-[#0B0B0D] sm:text-[34px]"
            style={{ textWrap: 'balance' }}
          >
            Sé de los primeros
            <span className="block text-[#6E727D]">en llegar.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-[34ch] text-[14px] leading-[1.55] text-[#52525B]">
            Estamos preparando una nueva forma de conectar con personas que comparten tu visión.
          </p>
        </motion.div>

        {/* Tarjeta del contador con micro-elevación */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="mt-6"
        >
            <div className="mx-auto flex w-full max-w-[300px] items-center justify-between gap-3 rounded-[22px] border border-white bg-white/88 px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECEEF2] text-[#0B0B0D]">
                  <Users className="h-[18px] w-[18px]" strokeWidth={2.1} aria-hidden="true" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-baseline gap-2">
                    <AnimatedCounter
                      value={count}
                      loading={loadingCount}
                      className="font-display text-[22px] font-bold leading-none tracking-[-0.025em] text-[#0B0B0D]"
                    />
                  </div>
                  <p className="mt-1 text-[11.5px] font-medium text-[#71717A] truncate">
                    personas en espera
                  </p>
                </div>
              </div>

              {count !== null && (
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Formulario con microinteracciones */}
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            noValidate
            className="mt-5 space-y-3"
          >
          <div>
            <label htmlFor={emailInputId} className="sr-only">
              Tu correo electrónico
            </label>
            <div
              className={`group flex h-[54px] items-center gap-3 rounded-full border bg-white/92 px-5 shadow-[0_6px_18px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-150 ${
                errorMessage
                  ? 'border-[#DC2626]/60 ring-4 ring-[#DC2626]/[0.08]'
                  : duplicateNotice
                    ? 'border-[#D97706]/55 ring-4 ring-[#D97706]/[0.08]'
                    : 'border-white focus-within:border-[#0B0B0D]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-black/[0.05]'
              }`}
            >
              <Mail
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  errorMessage
                    ? 'text-[#DC2626]'
                    : duplicateNotice
                      ? 'text-[#B45309]'
                      : 'text-[#52525B] group-focus-within:text-[#0B0B0D]'
                }`}
                strokeWidth={1.85}
                aria-hidden="true"
              />
              <input
                id={emailInputId}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                disabled={submitting}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                  if (duplicateNotice) {
                    setDuplicateNotice(null);
                  }
                }}
                placeholder="Tu correo electrónico"
                aria-invalid={Boolean(errorMessage || duplicateNotice)}
                aria-describedby={
                  errorMessage || duplicateNotice ? feedbackMessageId : undefined
                }
                className="h-full w-full bg-transparent text-[14.5px] text-[#0B0B0D] placeholder:text-[#86868B] focus:outline-none disabled:opacity-60"
              />
            </div>

            {duplicateNotice && !errorMessage && (
              <motion.div
                id={feedbackMessageId}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 flex items-start gap-2 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2.5 text-[12.5px] leading-snug font-medium text-[#92400E]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" aria-hidden="true" />
                <span>{duplicateNotice}</span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                id={feedbackMessageId}
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 flex items-start gap-2 rounded-2xl bg-[#FEF2F2] px-4 py-2.5 text-[12.5px] leading-snug font-medium text-[#B91C1C]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </div>

          {/* Botón negro principal con brillo sutil animado */}
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={submitting ? undefined : { scale: 1.01 }}
            whileTap={submitting ? undefined : { scale: 0.985 }}
            className="group relative flex h-[54px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#0A0A0C] px-6 text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(10,10,12,0.18)] transition-colors duration-150 hover:bg-[#1C1C20] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0B0B0D]/20 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
          >
            {!submitting && (
              <motion.span
                aria-hidden="true"
                animate={{ x: ['-120%', '220%'] }}
                transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-20 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              />
            )}
            {submitting ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Unirme a la lista</span>
                <ArrowRight
                  className="relative z-10 h-[18px] w-[18px] transition-transform duration-150 group-hover:translate-x-1"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </>
            )}
          </motion.button>

          {/* Casilla de consentimiento */}
          <label
            htmlFor={consentCheckboxId}
            className="flex cursor-pointer items-start gap-2.5 rounded-2xl px-1.5 pt-1 text-left select-none"
          >
            <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
              <input
                id={consentCheckboxId}
                type="checkbox"
                checked={marketingConsent}
                disabled={submitting}
                onChange={(e) => {
                  setMarketingConsent(e.target.checked);
                  if (errorMessage === 'Marca la casilla para continuar') {
                    setErrorMessage(null);
                  }
                }}
                className="peer sr-only"
              />
              <span
                className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border border-black/20 bg-white transition-all peer-checked:border-[#0B0B0D] peer-checked:bg-[#0B0B0D] peer-focus-visible:ring-4 peer-focus-visible:ring-black/10 peer-disabled:opacity-60"
                aria-hidden="true"
              >
                <Check
                  className={`h-3 w-3 text-white transition-opacity ${
                    marketingConsent ? 'opacity-100' : 'opacity-0'
                  }`}
                  strokeWidth={2.8}
                />
              </span>
            </span>
            <span className="text-[12px] leading-[1.45] text-[#52525B]">
              Acepto la{' '}
              <a
                href="/privacidad"
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.stopPropagation();
                  if (onNavigate && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('/privacidad');
                  }
                }}
                className="font-semibold text-[#0B0B0D] underline decoration-black/25 underline-offset-2 transition-colors hover:decoration-[#0B0B0D]"
              >
                Política de privacidad
              </a>{' '}
              y recibir novedades y un correo cuando Punto esté disponible. Puedo darme de baja
              cuando quiera.
            </span>
          </label>

          {/* Nota inferior con latido suave */}
          <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[12px] font-medium text-[#27272A]">
            <motion.span
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <Heart className="h-3.5 w-3.5 fill-[#0B0B0D] text-[#0B0B0D]" aria-hidden="true" />
            </motion.span>
            <span>Te avisaremos cuando Punto esté listo</span>
          </p>
        </motion.form>
      </main>

      <footer className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-2">
        <p className="text-[11.5px] font-medium text-[#71717A]">
          {PUNTO_BRAND.name} <span aria-hidden="true">·</span> {PUNTO_BRAND.developer}
        </p>
        <span aria-hidden="true" className="text-[11.5px] text-[#71717A]">
          ·
        </span>
        <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-2 text-[11.5px] font-medium text-[#71717A]">
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
