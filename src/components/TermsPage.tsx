import { Mail } from 'lucide-react';
import { type MouseEvent } from 'react';
import { LegalLayout } from './LegalLayout';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
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
    <LegalLayout onNavigate={onNavigate} activePath="/terminos">
      <div className="border-b border-black/[0.06] pb-7">
        <p className="text-[12px] font-semibold tracking-wide text-[#71717A] uppercase">
          Documento legal oficial de Punto
        </p>

        <h1 className="font-display mt-4 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-[#0B0B0D] sm:text-[36px]">
          Términos y condiciones
        </h1>

        <p className="mt-3 text-[13px] font-semibold text-[#0B0B0D]">
          Última actualización: 23 de noviembre de 2026
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-black/[0.05] bg-[#F7F8FA] p-4 sm:grid-cols-2 sm:p-5">
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Aplicación:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">Punto</dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Titular:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              MUHAMADOU CAMARA DIBBASY (MCD Group)
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 space-y-6 text-[15px] leading-[1.72] text-[#27272A]">
        <div className="rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-5 sm:p-6">
          <p className="font-medium text-[#0B0B0D]">
            El texto completo de los Términos y condiciones de Punto está pendiente de publicación.
          </p>
          <p className="mt-2 text-[14px] text-[#52525B]">
            Para cualquier consulta relacionada con el uso de la plataforma o la lista de espera, puedes escribir a{' '}
            <a href="mailto:mcdgroup.dev@gmail.com" className="font-medium text-[#0B0B0D] underline">
              mcdgroup.dev@gmail.com
            </a>{' '}
            o consultar nuestra{' '}
            <a
              href="/privacidad"
              onClick={(e) => handleInternalLink(e, '/privacidad')}
              className="font-medium text-[#0B0B0D] underline"
            >
              Política de privacidad
            </a>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="mailto:mcdgroup.dev@gmail.com"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0C] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1C1C20]"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>mcdgroup.dev@gmail.com</span>
          </a>
          <a
            href="/"
            onClick={(e) => handleInternalLink(e, '/')}
            className="inline-flex items-center rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-semibold text-[#0B0B0D] transition-colors hover:bg-[#F4F5F7]"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </LegalLayout>
  );
}
