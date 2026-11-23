import { Mail } from 'lucide-react';
import { type MouseEvent } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { LegalLayout } from './LegalLayout';

interface LegalNoticePageProps {
  onNavigate: (path: string) => void;
}

export function LegalNoticePage({ onNavigate }: LegalNoticePageProps) {
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
    <LegalLayout onNavigate={onNavigate} activePath="/aviso-legal">
      <div className="border-b border-black/[0.06] pb-7">
        <p className="text-[12px] font-semibold tracking-wide text-[#71717A] uppercase">
          Información legal obligatoria (LSSI-CE)
        </p>

        <h1 className="font-display mt-4 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-[#0B0B0D] sm:text-[36px]">
          Aviso legal
        </h1>

        <p className="mt-3 text-[13px] font-semibold text-[#0B0B0D]">
          Última actualización: 23 de noviembre de 2026
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-black/[0.05] bg-[#F7F8FA] p-4 sm:grid-cols-2 sm:p-5">
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Titular:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              MUHAMADOU CAMARA DIBBASY (DNI: 43236512P)
            </dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Marca comercial y app:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              MCD Group · Punto (usepunto.com)
            </dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Domicilio:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              Carrer del Riu Segre, 2, 2, 17003 Girona, España
            </dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Correo de contacto:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              {PUNTO_BRAND.contactEmail}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 space-y-8 text-[15px] leading-[1.72] text-[#27272A]">
        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            1. Datos identificativos del titular
          </h2>
          <p>
            En cumplimiento del deber de información establecido en el artículo 10 de la Ley 34/2002,
            de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico
            (LSSI-CE), se informa que el sitio web <strong>usepunto.com</strong> y la aplicación{' '}
            <strong>Punto</strong> son titularidad de:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>
              <strong>Titular:</strong> MUHAMADOU CAMARA DIBBASY
            </li>
            <li>
              <strong>Nombre comercial:</strong> MCD Group
            </li>
            <li>
              <strong>Domicilio:</strong> Carrer del Riu Segre, 2, 2, 17003 Girona, España
            </li>
            <li>
              <strong>Correo electrónico de Punto:</strong>{' '}
              <a
                href={`mailto:${PUNTO_BRAND.contactEmail}`}
                className="font-medium text-[#0B0B0D] underline"
              >
                {PUNTO_BRAND.contactEmail}
              </a>
            </li>
            <li>
              <strong>Canal de denuncias y notificaciones legales:</strong>{' '}
              <a
                href={`mailto:${PUNTO_BRAND.reportsEmail}`}
                className="font-medium text-[#0B0B0D] underline"
              >
                {PUNTO_BRAND.reportsEmail}
              </a>
            </li>
            <li>
              <strong>DNI / NIF:</strong> 43236512P
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            2. Objeto y condiciones de acceso
          </h2>
          <p>
            El presente sitio web tiene por objeto informar sobre el lanzamiento de la aplicación{' '}
            <strong>Punto</strong> y gestionar las solicitudes voluntarias de inscripción en su lista
            de espera. El acceso a la web es gratuito y requiere un uso conforme a la ley, la buena
            fe y el orden público.
          </p>
          <p>
            Para consultar las condiciones de uso específicas de la plataforma, puedes acceder a{' '}
            <a
              href="/terminos"
              onClick={(e) => handleInternalLink(e, '/terminos')}
              className="font-medium text-[#0B0B0D] underline"
            >
              Términos y condiciones
            </a>
            , y para conocer cómo tratamos los datos personales, a nuestra{' '}
            <a
              href="/privacidad"
              onClick={(e) => handleInternalLink(e, '/privacidad')}
              className="font-medium text-[#0B0B0D] underline"
            >
              Política de privacidad
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            3. Política de cookies y almacenamiento técnico
          </h2>
          <p>
            De conformidad con el artículo 22.2 de la LSSI-CE y las guías de la Agencia Española de
            Protección de Datos (AEPD), este sitio web <strong>no utiliza cookies de análisis,
            publicidad, medición ni perfilado de usuarios</strong>.
          </p>
          <p>
            Asimismo, las tipografías y recursos visuales del sitio se sirven localmente desde el
            propio dominio para evitar la transmisión automática de tu dirección IP a servidores
            externos de fuentes web. Si en el futuro se incorporaran cookies no esenciales, se
            mostrará previamente un mecanismo de información y consentimiento granular.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            4. Propiedad intelectual e industrial
          </h2>
          <p>
            La denominación Punto, el logotipo, el diseño visual, los textos, los gráficos y el código
            fuente del sitio web pertenecen a su titular o a terceros que han autorizado su uso, y
            están protegidos por la normativa española y europea de propiedad intelectual e
            industrial. Queda prohibida su reproducción, distribución o transformación sin
            autorización previa y expresa.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            5. Legislación aplicable y contacto
          </h2>
          <p>
            El presente Aviso legal se rige por la legislación española y la normativa vigente de la
            Unión Europea (incluido el Reglamento General de Protección de Datos, la LOPDGDD y la
            LSSI-CE). Para comunicaciones generales puedes dirigirte a{' '}
            <a
              href={`mailto:${PUNTO_BRAND.contactEmail}`}
              className="font-medium text-[#0B0B0D] underline"
            >
              {PUNTO_BRAND.contactEmail}
            </a>
            , y para denuncias o notificaciones legales formales a{' '}
            <a
              href={`mailto:${PUNTO_BRAND.reportsEmail}`}
              className="font-medium text-[#0B0B0D] underline"
            >
              {PUNTO_BRAND.reportsEmail}
            </a>
            .
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={`mailto:${PUNTO_BRAND.contactEmail}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0C] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1C1C20]"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{PUNTO_BRAND.contactEmail}</span>
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
