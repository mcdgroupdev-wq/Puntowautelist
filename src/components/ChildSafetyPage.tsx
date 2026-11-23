import {
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  Copy,
  Mail,
  Printer,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useState } from 'react';
import { LegalLayout } from './LegalLayout';
import { PuntoSymbol } from './PuntoLogo';

interface ChildSafetyPageProps {
  onNavigate: (path: string) => void;
}

const EMAIL_ADDRESS = 'mcdgroup.dev@gmail.com';

const SECTIONS = [
  { id: 'compromiso', label: 'Compromiso' },
  { id: 'conductas-prohibidas', label: 'Conductas Prohibidas' },
  { id: 'canal-denuncias', label: 'Canal de Denuncias' },
  { id: 'gestion-infracciones', label: 'Gestión de Infracciones' },
  { id: 'cooperacion-autoridades', label: 'Cooperación con Autoridades' },
  { id: 'proteccion-privacidad', label: 'Protección y Privacidad' },
  { id: 'contacto-ficha', label: 'Contacto y Ficha' },
] as const;

const PROHIBITED_BEHAVIORS = [
  {
    title: 'Material de abuso sexual infantil (CSAM)',
    description:
      'La creación, publicación, difusión, almacenamiento, distribución, intercambio o solicitud de cualquier imagen, vídeo o representación visual o digital de abuso o explotación sexual de menores.',
  },
  {
    title: 'Explotación sexual de menores (CSAE)',
    description:
      'Cualquier acto, propuesta o facilitación destinada a la explotación sexual comercial o no comercial de cualquier persona menor de edad.',
  },
  {
    title: 'Captación de menores (Grooming)',
    description:
      'El engaño, manipulación, persuasión o acercamiento intencional a menores de edad con la finalidad de obtener favores, imágenes o encuentros de carácter sexual.',
  },
  {
    title: 'Sexualización de menores',
    description:
      'Cualquier contenido, comentario, insinuación o representación que presente a un menor de edad de manera erotizada o sexualizada.',
  },
  {
    title: 'Intentos de contacto indebido',
    description:
      'Cualquier tentativa de aproximación o solicitud de datos privados a menores con propósitos de abuso, explotación, acoso sexual o coacción.',
  },
  {
    title: 'Promoción o facilitación',
    description:
      'Publicar hipervínculos, instrucciones, menciones a foros o cualquier medio que facilite o anime a terceros a acceder a contenido ilícito de menores.',
  },
] as const;

const PROCESS_STEPS = [
  'Revisaremos la información disponible y valoraremos la gravedad y urgencia del caso.',
  'Adoptaremos las medidas que estén disponibles y sean legalmente apropiadas para limitar el riesgo.',
  'Cuando corresponda y exista fundamento suficiente, podremos restringir o cancelar las cuentas implicadas.',
  'Si se confirma la existencia de material de abuso sexual infantil, actuaremos conforme a la legislación aplicable y a las obligaciones de comunicación a las autoridades competentes.',
  'Cooperaremos con las autoridades legalmente facultadas y atenderemos sus requerimientos conforme a derecho.',
] as const;

export function ChildSafetyPage({ onNavigate }: ChildSafetyPageProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopiedEmail(true);
      window.setTimeout(() => {
        setCopiedEmail(false);
      }, 2200);
    } catch {
      // Ignorar si el navegador bloquea el portapapeles
    }
  }

  return (
    <LegalLayout onNavigate={onNavigate} activePath="/seguridad-infantil">
      {/* Barra superior del documento */}
      <div className="border-b border-black/[0.06] pb-7">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#52525B]">
          <p className="font-medium">
            <span className="font-semibold text-[#0B0B0D]">Documento Oficial Público</span>
            <span className="mx-2 text-[#D4D4D8]" aria-hidden="true">
              |
            </span>
            <span>Estándares de Seguridad Infantil de PUNTO (Google Play CSAE/CSAM Policy)</span>
          </p>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#52525B]">
              <Calendar className="h-3.5 w-3.5 text-[#71717A]" aria-hidden="true" />
              <span>Vigente: 14 de noviembre de 2026</span>
            </span>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[#52525B] transition-colors hover:bg-[#F4F5F7] hover:text-[#0B0B0D]"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Franja de identidad de seguridad */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/[0.06] bg-[#FAFAFB] px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              <PuntoSymbol size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-[15px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
                  PUNTO
                </span>
                <span className="rounded-md border border-black/[0.08] bg-white px-2 py-0.5 text-[10.5px] font-semibold tracking-wide text-[#52525B] uppercase">
                  Seguridad
                </span>
              </div>
              <p className="text-[12px] text-[#71717A]">por MCD Group</p>
            </div>
          </div>

          <a
            href="#canal-denuncias"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0C] px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1C1C20] print:hidden"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Denunciar</span>
          </a>
        </div>

        {/* Navegación rápida por secciones */}
        <nav
          aria-label="Secciones de seguridad infantil"
          className="mt-4 flex flex-wrap gap-1.5 border-b border-black/[0.05] pb-4"
        >
          {SECTIONS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-[#52525B] transition-colors hover:bg-[#F4F5F7] hover:text-[#0B0B0D]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-[#F7F8FA] px-3 py-1 text-[12px] font-semibold text-[#0B0B0D]">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Política oficial de protección a menores</span>
        </div>

        <h1 className="font-display mt-4 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-[#0B0B0D] sm:text-[36px]">
          Estándares de seguridad infantil de PUNTO
        </h1>

        <p className="mt-3 text-[15px] leading-[1.65] text-[#52525B]">
          Marco normativo, directrices sobre conductas prohibidas y protocolos de denuncia frente a la
          explotación y el abuso sexual infantil (EASI / CSAE / CSAM) en la plataforma{' '}
          <strong className="font-semibold text-[#0B0B0D]">PUNTO</strong>.
        </p>

        {/* Tarjeta identidad */}
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#F7F8FA]">
            <PuntoSymbol size={30} />
          </div>
          <div>
            <p className="font-display text-[15px] font-bold text-[#0B0B0D]">PUNTO</p>
            <p className="text-[13px] text-[#71717A]">MCD Group</p>
          </div>
        </div>

        {/* Ficha resumen */}
        <dl className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-black/[0.05] bg-[#F7F8FA] p-4 sm:grid-cols-2 sm:p-5">
          <div className="flex items-start gap-2.5">
            <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]" aria-hidden="true" />
            <div>
              <dt className="text-[11.5px] font-medium text-[#71717A]">Aplicación</dt>
              <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">PUNTO</dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]" aria-hidden="true" />
            <div>
              <dt className="text-[11.5px] font-medium text-[#71717A]">Desarrollador</dt>
              <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">MCD Group</dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]" aria-hidden="true" />
            <div>
              <dt className="text-[11.5px] font-medium text-[#71717A]">Última actualización</dt>
              <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
                14 de noviembre de 2026
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]" aria-hidden="true" />
            <div>
              <dt className="text-[11.5px] font-medium text-[#71717A]">Canal de seguridad</dt>
              <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
                <a href={`mailto:${EMAIL_ADDRESS}`} className="underline decoration-black/25 underline-offset-2">
                  {EMAIL_ADDRESS}
                </a>
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Cuerpo completo */}
      <div className="mt-8 space-y-9 text-[15px] leading-[1.72] text-[#27272A]">
        {/* Declaración de cumplimiento público */}
        <section className="rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-5 space-y-2">
          <h2 className="font-display text-[17px] font-bold text-[#0B0B0D]">
            Declaración de cumplimiento público
          </h2>
          <p className="text-[14.5px]">
            Esta página web pública es el documento oficial de estándares de seguridad infantil para
            la aplicación PUNTO, publicado por MCD Group conforme a las políticas de seguridad de
            Google Play sobre material y conductas de explotación y abuso sexual infantil
            (CSAM/CSAE). Es accesible de manera libre, permanente y sin requerir inicio de sesión ni
            registro previo.
          </p>
        </section>

        {/* 1. Compromiso con la protección infantil */}
        <section id="compromiso" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            1. Compromiso con la protección infantil
          </h2>
          <p>
            En PUNTO y MCD Group, la seguridad, integridad y bienestar de los menores de edad
            constituyen una prioridad fundamental e innegociable. Mantenemos una política estricta
            de tolerancia cero frente a cualquier forma de explotación y abuso sexual infantil (EASI
            / CSAE), incluyendo cualquier tipo de material de abuso sexual infantil (CSAM).
          </p>
          <p>
            Ningún usuario, bajo ninguna circunstancia, tiene permitido utilizar nuestros servicios
            para atentar contra la integridad de menores ni para promover, almacenar, transferir o
            facilitar contenidos que involucren abuso a la infancia.
          </p>
        </section>

        {/* 2. Conductas expresamente prohibidas */}
        <section id="conductas-prohibidas" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            2. Conductas expresamente prohibidas
          </h2>
          <p>
            Quedan estricta y terminantemente prohibidas en PUNTO todas las acciones enumeradas a
            continuación, independientemente del formato (texto, imágenes, vídeos, audios, enlaces,
            nombres de usuario o cualquier otro elemento):
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PROHIBITED_BEHAVIORS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-4"
              >
                <h3 className="font-display text-[15px] font-bold text-[#0B0B0D]">{item.title}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-[#52525B]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Canal oficial de denuncias */}
        <section id="canal-denuncias" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            3. Canal oficial de denuncias
          </h2>
          <p>
            Si detecta en PUNTO cualquier contenido, usuario o comportamiento que vulnere la
            seguridad de un menor o infrinja estas políticas, solicitamos que lo comunique a la mayor
            brevedad posible.
          </p>

          <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-[#F7F8FA] p-5">
            <h3 className="font-display text-[16px] font-bold text-[#0B0B0D]">
              Vía directa de notificación de seguridad infantil
            </h3>
            <p className="text-[14.5px]">
              Actualmente, el canal oficial y directo para reportar cualquier infracción o riesgo
              infantil es nuestro correo electrónico dedicado:
            </p>
            <p className="font-display text-[16px] font-bold text-[#0B0B0D]">
              <a href={`mailto:${EMAIL_ADDRESS}`} className="underline decoration-black/25 underline-offset-2">
                {EMAIL_ADDRESS}
              </a>
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1 print:hidden">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-semibold text-[#0B0B0D] transition-colors hover:bg-[#F4F5F7]"
              >
                {copiedEmail ? (
                  <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{copiedEmail ? 'Correo copiado' : 'Copiar correo'}</span>
              </button>
              <a
                href={`mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent('Denuncia de seguridad infantil - PUNTO')}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0C] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1C1C20]"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Abrir cliente de correo</span>
              </a>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16px] font-bold text-[#0B0B0D]">
              Información útil para incluir en su denuncia:
            </h3>
            <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
              <li>Identificador o nombre de usuario de la cuenta o perfil objeto de la denuncia.</li>
              <li>Descripción clara de los hechos o del contenido observado.</li>
              <li>Fecha y hora aproximada en que se detectó la conducta.</li>
              <li>
                Captura de pantalla del contexto (por ejemplo, del perfil o mensaje que evidencia la
                conducta ilícita).
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-[14px] leading-[1.6] text-[#991B1B]">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#DC2626]" aria-hidden="true" />
            <p>
              <strong className="font-bold">ADVERTENCIA IMPORTANTE:</strong> Bajo ningún concepto
              debe descargar, guardar, adjuntar o reenviar archivos que contengan material de abuso
              o explotación sexual infantil. La posesión y distribución de dicho material es un
              delito grave. Limítese a describir la situación y proporcionar el nombre de la cuenta o
              contexto relevante.
            </p>
          </div>
        </section>

        {/* 4. Gestión de posibles infracciones */}
        <section id="gestion-infracciones" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            4. Gestión de posibles infracciones
          </h2>
          <p>
            MCD Group establece la prohibición absoluta de cualquier conducta relacionada con la
            explotación o el abuso sexual infantil en Punto.
          </p>
          <p>Cuando recibamos información sobre una posible infracción:</p>

          <ol className="space-y-3">
            {PROCESS_STEPS.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3.5 rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-4"
              >
                <span className="font-display flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0A0A0C] text-[13px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-[14.5px] leading-[1.6] text-[#27272A]">{step}</span>
              </li>
            ))}
          </ol>

          <p>
            Las medidas concretas dependerán de las circunstancias del caso, de las pruebas
            disponibles y de las obligaciones legales aplicables.
          </p>
        </section>

        {/* 5. Cooperación con las autoridades competentes */}
        <section id="cooperacion-autoridades" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            5. Cooperación con las autoridades competentes
          </h2>
          <p>
            PUNTO manifiesta su compromiso formal de cooperar plenamente con los cuerpos y fuerzas
            de seguridad, fiscalías y tribunales de justicia competentes, así como con los
            organismos oficiales legalmente facultados en materia de protección de la infancia.
          </p>
          <p>
            En todos aquellos supuestos en los que se detecten conductas constitutivas de delito o de
            riesgo inminente para la vida o integridad de un menor, PUNTO remitirá la información
            pertinente a las autoridades policiales o judiciales competentes, cumpliendo con los
            deberes legales de comunicación y denuncia tipificados por la legislación aplicable.
          </p>
        </section>

        {/* 6. Protección y privacidad de la información */}
        <section id="proteccion-privacidad" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            6. Protección y privacidad de la información
          </h2>
          <p>
            Las comunicaciones y denuncias recibidas en relación con la seguridad de menores se
            gestionan con la máxima seriedad, reserva y estricta confidencialidad por parte del
            equipo responsable de MCD Group, cumpliendo con la legislación vigente en materia de
            protección de datos personales.
          </p>
          <div className="rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-4 text-[14.5px]">
            <p>
              <strong className="font-semibold text-[#0B0B0D]">
                Nota sobre confidencialidad y límites legales:
              </strong>{' '}
              Tratamos los datos del denunciante con discreción. Sin embargo, no es posible
              garantizar el anonimato absoluto en aquellos casos en que un mandato judicial o un
              requerimiento formal de las autoridades obligue legalmente a la identificación o cesión
              de datos en el marco de una investigación criminal.
            </p>
          </div>
        </section>

        {/* 7. Información de contacto y ficha técnica */}
        <section id="contacto-ficha" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            7. Información de contacto y ficha técnica
          </h2>
          <p>
            A continuación se detallan los datos formales de la entidad responsable de la aplicación
            PUNTO:
          </p>

          <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
            <table className="w-full border-collapse text-left text-[14px]">
              <tbody>
                <tr className="border-b border-black/[0.06]">
                  <th className="w-2/5 bg-[#F7F8FA] px-4 py-3 font-semibold text-[#0B0B0D]">
                    Aplicación
                  </th>
                  <td className="px-4 py-3 text-[#27272A]">PUNTO</td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <th className="bg-[#F7F8FA] px-4 py-3 font-semibold text-[#0B0B0D]">
                    Desarrollador
                  </th>
                  <td className="px-4 py-3 text-[#27272A]">MCD Group</td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <th className="bg-[#F7F8FA] px-4 py-3 font-semibold text-[#0B0B0D]">
                    Correo oficial de seguridad infantil
                  </th>
                  <td className="px-4 py-3 text-[#27272A]">
                    <a
                      href={`mailto:${EMAIL_ADDRESS}`}
                      className="font-medium text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
                    >
                      {EMAIL_ADDRESS}
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <th className="bg-[#F7F8FA] px-4 py-3 font-semibold text-[#0B0B0D]">
                    Propósito del documento
                  </th>
                  <td className="px-4 py-3 text-[#27272A]">
                    Cumplimiento de estándares de seguridad contra la explotación y el abuso sexual
                    infantil (EASI / CSAE / CSAM) de Google Play.
                  </td>
                </tr>
                <tr>
                  <th className="bg-[#F7F8FA] px-4 py-3 font-semibold text-[#0B0B0D]">
                    Fecha de última actualización
                  </th>
                  <td className="px-4 py-3 text-[#27272A]">14 de noviembre de 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Cierre oficial del documento */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-black/[0.06] pt-6 text-[13px] text-[#71717A] sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <PuntoSymbol size={20} />
            <span>© 2026 PUNTO • MCD Group. Todos los derechos reservados.</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>Última revisión: 14 de noviembre de 2026</span>
            <span aria-hidden="true">•</span>
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="font-medium text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
            >
              Contacto de seguridad
            </a>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
