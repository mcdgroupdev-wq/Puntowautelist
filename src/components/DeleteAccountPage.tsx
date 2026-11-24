import {
  AlertCircle,
  Check,
  Copy,
  Mail,
  Printer,
  ShieldAlert,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { type MouseEvent, useState } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { LegalLayout } from './LegalLayout';

interface DeleteAccountPageProps {
  onNavigate: (path: string) => void;
}

const CONTACT_EMAIL = PUNTO_BRAND.contactEmail;
const EMAIL_SUBJECT = 'Eliminar cuenta';
const EMAIL_TEMPLATE = `Asunto: Eliminar cuenta\n\nHola equipo de Punto,\n\nSolicito la eliminación completa de mi cuenta de Punto y de mis datos asociados.\n\nCorreo registrado en la app: \nNombre o alias en Punto: `;

const DELETED_DATA = [
  'Perfil',
  'Nombre',
  'Email',
  'Fotos',
  'Bio',
  'Ciudad',
  'Mensajes',
  'Likes',
  'Matches',
] as const;

export function DeleteAccountPage({ onNavigate }: DeleteAccountPageProps) {
  const [copiedKey, setCopiedKey] = useState<'email' | 'template' | null>(null);

  async function handleCopy(text: string, key: 'email' | 'template') {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 2200);
    } catch {
      // Ignorar si el navegador bloquea el portapapeles
    }
  }

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
    <LegalLayout onNavigate={onNavigate} activePath="/eliminar-cuenta">
      {/* Encabezado del documento */}
      <div className="border-b border-black/[0.06] pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] font-semibold tracking-wide text-[#71717A] uppercase">
            Gestión de cuenta y datos · Punto
          </p>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[#52525B] transition-colors hover:bg-[#F4F5F7] hover:text-[#0B0B0D]"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopy(CONTACT_EMAIL, 'email')}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[#52525B] transition-colors hover:bg-[#F4F5F7] hover:text-[#0B0B0D]"
            >
              {copiedKey === 'email' ? (
                <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{copiedKey === 'email' ? 'Email copiado' : 'Copiar email'}</span>
            </button>
          </div>
        </div>

        <h1 className="font-display mt-4 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-[#0B0B0D] sm:text-[36px]">
          Eliminar tu cuenta de Punto
        </h1>

        <p className="mt-3 text-[15px] leading-[1.65] text-[#52525B]">
          Esta página explica cómo solicitar la eliminación de tu cuenta de la app{' '}
          <strong className="font-semibold text-[#0B0B0D]">Punto</strong> (desarrollador:{' '}
          <strong className="font-semibold text-[#0B0B0D]">
            Muhamadou Camara Dibbasy / MCD Group
          </strong>
          ).
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-black/[0.05] bg-[#F7F8FA] p-4 sm:grid-cols-2 sm:p-5">
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Aplicación:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">Punto</dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Desarrollador:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              Muhamadou Camara Dibbasy / MCD Group
            </dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Correo de soporte:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`}
                className="underline decoration-black/25 underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Enlace directo:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              usepunto.com/eliminar-cuenta
            </dd>
          </div>
        </dl>
      </div>

      {/* Cuerpo principal */}
      <div className="mt-8 space-y-8 text-[15px] leading-[1.72] text-[#27272A]">
        {/* Aviso importante sobre suscripción */}
        <div
          role="note"
          className="flex items-start gap-3 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[14.5px] leading-[1.6] text-[#92400E]"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D97706]" aria-hidden="true" />
          <p>
            <strong className="font-bold text-[#78350F]">Importante:</strong> eliminar la cuenta{' '}
            <strong className="font-semibold text-[#78350F]">
              no cancela la suscripción de Google Play
            </strong>
            . Cancélala primero en{' '}
            <strong className="font-semibold text-[#78350F]">
              Google Play → Pagos y suscripciones
            </strong>
            .
          </p>
        </div>

        {/* Cómo solicitar la eliminación */}
        <section className="space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            Cómo solicitar la eliminación de tu cuenta
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Opción 1 */}
            <div className="rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-5 space-y-2.5">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0B0B0D] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                <Smartphone className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="font-display text-[16.5px] font-bold text-[#0B0B0D]">
                Opción 1 (desde la app)
              </h3>
              <p className="text-[14.5px] text-[#3F3F46]">
                Abre Punto en tu dispositivo y sigue esta ruta:
              </p>
              <p className="rounded-xl border border-black/[0.06] bg-white px-3.5 py-2.5 text-[14px] font-semibold text-[#0B0B0D]">
                Perfil → Ajustes → Eliminar cuenta
              </p>
            </div>

            {/* Opción 2 */}
            <div className="rounded-2xl border border-black/[0.06] bg-[#F7F8FA] p-5 space-y-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0B0B0D] shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="font-display text-[16.5px] font-bold text-[#0B0B0D]">
                Opción 2 (por email)
              </h3>
              <p className="text-[14.5px] text-[#3F3F46]">
                Envía un correo a{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`}
                  className="font-semibold text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
                >
                  {CONTACT_EMAIL}
                </a>{' '}
                desde el email de tu cuenta con el asunto{' '}
                <strong className="font-semibold text-[#0B0B0D]">«Eliminar cuenta»</strong>.
                Responderemos en un máximo de{' '}
                <strong className="font-semibold text-[#0B0B0D]">30 días</strong>.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 print:hidden">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0C] px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1C1C20]"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Enviar solicitud</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(EMAIL_TEMPLATE, 'template')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[#52525B] transition-colors hover:text-[#0B0B0D]"
                >
                  {copiedKey === 'template' ? (
                    <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{copiedKey === 'template' ? 'Plantilla copiada' : 'Copiar plantilla'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Datos que se eliminan */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-[#0B0B0D]" aria-hidden="true" />
            <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
              Datos que se eliminan
            </h2>
          </div>
          <p>
            Al completar la eliminación de tu cuenta se borran los datos personales vinculados a tu
            actividad en la plataforma:
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DELETED_DATA.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-black/[0.06] bg-[#FAFAFB] px-3.5 py-2 text-[14px] font-medium text-[#0B0B0D]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Datos que se conservan */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#0B0B0D]" aria-hidden="true" />
            <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
              Datos que se conservan temporalmente
            </h2>
          </div>
          <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-5 text-[14.5px]">
            <p>
              <strong className="font-semibold text-[#0B0B0D]">
                Historial de compras y suscripciones (hasta 6 años):
              </strong>{' '}
              puede conservarse hasta 6 años por obligaciones legales y fiscales (gestionado por{' '}
              <strong className="font-semibold text-[#0B0B0D]">Google Play</strong> y{' '}
              <strong className="font-semibold text-[#0B0B0D]">RevenueCat</strong>).
            </p>
            <p>
              <strong className="font-semibold text-[#0B0B0D]">
                Reportes de seguridad (hasta 1 año):
              </strong>{' '}
              pueden conservarse hasta 1 año para prevenir abusos. Después se eliminan.
            </p>
          </div>
        </section>

        {/* Enlaces de cierre */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-6 text-[13.5px] text-[#52525B]">
          <p>
            Consulta más detalles en nuestra{' '}
            <a
              href="/privacidad"
              onClick={(e) => handleInternalLink(e, '/privacidad')}
              className="font-semibold text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
            >
              Política de privacidad
            </a>
            .
          </p>
          <a
            href="/"
            onClick={(e) => handleInternalLink(e, '/')}
            className="inline-flex items-center rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-semibold text-[#0B0B0D] transition-colors hover:bg-[#F4F5F7] print:hidden"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </LegalLayout>
  );
}
