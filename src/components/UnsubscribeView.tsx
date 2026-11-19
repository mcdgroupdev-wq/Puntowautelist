import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { PuntoBrandMark } from './PuntoLogo';

interface UnsubscribeViewProps {
  token: string;
  onGoHome: () => void;
}

export function UnsubscribeView({ token, onGoHome }: UnsubscribeViewProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando tu solicitud...');

  useEffect(() => {
    let active = true;

    async function processUnsubscribe() {
      try {
        const res = await fetch(
          `/api/waitlist/unsubscribe?token=${encodeURIComponent(token)}`,
        );
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          message?: string;
        };

        if (!active) {
          return;
        }
        if (res.ok && data.ok) {
          setStatus('success');
          setMessage(
            data.message ||
              'Has cancelado tu suscripción correctamente. Ya no recibirás correos de novedades de Punto.',
          );
        } else {
          setStatus('error');
          setMessage(
            data.message || 'El enlace para cancelar la suscripción no es válido o ha caducado.',
          );
        }
      } catch {
        if (!active) {
          return;
        }
        setStatus('error');
        setMessage('No pudimos tramitar tu solicitud en este momento.');
      }
    }

    processUnsubscribe();
    return () => {
      active = false;
    };
  }, [token]);

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
          {status === 'loading' && (
            <Loader2 className="h-7 w-7 animate-spin text-[#0B0B0D]" aria-hidden="true" />
          )}
          {status === 'success' && (
            <Check className="h-7 w-7 text-[#0B0B0D]" strokeWidth={2.5} aria-hidden="true" />
          )}
          {status === 'error' && (
            <AlertCircle className="h-7 w-7 text-[#DC2626]" strokeWidth={2.2} aria-hidden="true" />
          )}
        </div>

        <h1 className="font-display mt-6 text-[26px] font-bold tracking-[-0.03em] text-[#0B0B0D]">
          {status === 'loading'
            ? 'Actualizando tus preferencias'
            : status === 'success'
              ? 'Suscripción cancelada'
              : 'No se pudo completar la baja'}
        </h1>

        <p className="mx-auto mt-3 max-w-[34ch] text-[14px] leading-[1.55] text-[#52525B]">
          {message}
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

      <footer className="flex w-full items-center justify-center pt-2">
        <p className="text-[11.5px] font-medium text-[#71717A]">
          {PUNTO_BRAND.name} <span aria-hidden="true">·</span> {PUNTO_BRAND.developer}
        </p>
      </footer>
    </motion.div>
  );
}
