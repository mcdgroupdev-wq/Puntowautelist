import { Check, ChevronDown, ChevronUp, Copy, Mail, Printer } from 'lucide-react';
import { type MouseEvent, useState } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { LegalLayout } from './LegalLayout';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

const EMAIL_ADDRESS = PUNTO_BRAND.contactEmail;
const REPORTS_EMAIL_ADDRESS = PUNTO_BRAND.reportsEmail;

const SECTIONS = [
  { id: 'informacion-general', label: '1. Información general' },
  { id: 'requisitos-edad', label: '2. Requisitos de edad' },
  { id: 'descripcion-servicio', label: '3. Descripción del servicio' },
  { id: 'registro-seguridad', label: '4. Registro y seguridad de la cuenta' },
  { id: 'normas-comportamiento', label: '5. Normas de comportamiento' },
  { id: 'perfiles-contenido', label: '6. Perfiles, proyectos y contenido' },
  { id: 'mensajes', label: '7. Mensajes y comunicaciones' },
  { id: 'bloqueos-moderacion', label: '8. Bloqueos, seguridad y moderación' },
  { id: 'punto-rankings', label: '9. Punto Rankings' },
  { id: 'punto-pro', label: '10. Punto Pro y suscripciones' },
  { id: 'disponibilidad', label: '11. Disponibilidad y modificaciones' },
  { id: 'proveedores-externos', label: '12. Servicios y proveedores externos' },
  { id: 'propiedad-intelectual', label: '13. Propiedad intelectual e industrial' },
  { id: 'privacidad', label: '14. Privacidad y protección de datos' },
  { id: 'eliminacion-cuentas', label: '15. Eliminación de cuentas' },
  { id: 'limitacion-responsabilidad', label: '16. Limitación de responsabilidad' },
  { id: 'suspension-cancelacion', label: '17. Suspensión y cancelación' },
  { id: 'cambios-terminos', label: '18. Cambios en los términos' },
  { id: 'legislacion', label: '19. Legislación y conflictos' },
  { id: 'contacto', label: '20. Contacto' },
] as const;

export function TermsPage({ onNavigate }: TermsPageProps) {
  const [indexOpen, setIndexOpen] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
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
    <LegalLayout onNavigate={onNavigate} activePath="/terminos">
      <div className="border-b border-black/[0.06] pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] font-semibold tracking-wide text-[#71717A] uppercase">
            Documento legal oficial de Punto
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
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[#52525B] transition-colors hover:bg-[#F4F5F7] hover:text-[#0B0B0D]"
            >
              {copiedEmail ? (
                <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{copiedEmail ? 'Email copiado' : 'Copiar email'}</span>
            </button>
          </div>
        </div>

        <h1 className="font-display mt-4 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-[#0B0B0D] sm:text-[36px]">
          Términos y condiciones de uso de Punto
        </h1>

        <p className="mt-3 text-[13px] font-semibold text-[#0B0B0D]">
          Última actualización: 23 de noviembre de 2026
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-black/[0.05] bg-[#F7F8FA] p-4 sm:grid-cols-3 sm:p-5">
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
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">DNI / NIF:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">43236512P</dd>
          </div>
        </dl>
      </div>

      {/* Índice de Secciones */}
      <nav
        aria-label="Índice de Secciones"
        className="mt-7 rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-4 sm:p-5"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-[15px] font-bold text-[#0B0B0D]">Índice de Secciones</h2>
          <button
            type="button"
            onClick={() => setIndexOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#52525B] transition-colors hover:text-[#0B0B0D]"
          >
            <span>{indexOpen ? 'Ocultar' : 'Mostrar'}</span>
            {indexOpen ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>

        {indexOpen && (
          <ol className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block rounded-lg px-2 py-1 text-[13.5px] text-[#52525B] transition-colors hover:bg-black/[0.04] hover:text-[#0B0B0D]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        )}
      </nav>

      {/* Cuerpo completo */}
      <div className="mt-8 space-y-9 text-[15px] leading-[1.72] text-[#27272A]">
        {/* 1. Información general */}
        <section id="informacion-general" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            1. Información general
          </h2>
          <p>
            Estos Términos y Condiciones regulan el acceso y uso de Punto, una aplicación y
            plataforma digital destinada a conectar personas, descubrir habilidades, encontrar
            colaboradores, crear proyectos y participar en una comunidad.
          </p>
          <p>El servicio es gestionado por:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Titular: MUHAMADOU CAMARA DIBBASY.</li>
            <li>DNI / NIF: 43236512P.</li>
            <li>Nombre comercial: MCD Group.</li>
            <li>Aplicación: Punto.</li>
            <li>
              Correo electrónico:{' '}
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="font-medium text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
              >
                {EMAIL_ADDRESS}
              </a>
              .
            </li>
            <li>Domicilio: Carrer del Riu Segre, 2, 2, 17003 Girona, España.</li>
            <li>
              Sitio web:{' '}
              <a
                href="/"
                onClick={(e) => handleInternalLink(e, '/')}
                className="font-medium text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
              >
                https://usepunto.com
              </a>
            </li>
          </ul>
          <p>
            MCD Group es el nombre comercial utilizado por el titular para desarrollar y gestionar
            Punto. No constituye por sí mismo una sociedad mercantil independiente.
          </p>
          <p>
            Al registrarse, acceder o utilizar Punto, el usuario declara que ha leído y acepta estos
            Términos y Condiciones.
          </p>
          <p>Si no está de acuerdo con ellos, deberá dejar de utilizar el servicio.</p>
        </section>

        {/* 2. Requisitos de edad */}
        <section id="requisitos-edad" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            2. Requisitos de edad
          </h2>
          <p>Punto está destinado a personas de 16 años o más.</p>
          <p>Al crear una cuenta, el usuario declara que cumple este requisito de edad.</p>
          <p>No está permitido utilizar Punto si se tienen menos de 16 años.</p>
          <p>El usuario se compromete a proporcionar información veraz y a no falsear su edad.</p>
          <p>
            Punto podrá restringir o suspender las cuentas cuando existan indicios razonables de que
            no cumplen los requisitos de edad.
          </p>
        </section>

        {/* 3. Descripción del servicio */}
        <section id="descripcion-servicio" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            3. Descripción del servicio
          </h2>
          <p>Punto es una plataforma social que permite, entre otras funciones disponibles:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Crear un perfil personal.</li>
            <li>Mostrar habilidades, intereses y experiencia.</li>
            <li>Descubrir otros perfiles.</li>
            <li>Conectar con personas con intereses o habilidades complementarias.</li>
            <li>Crear, descubrir y participar en proyectos.</li>
            <li>Enviar y recibir solicitudes de colaboración.</li>
            <li>Comunicarse mediante mensajes privados.</li>
            <li>Participar en Punto Rankings.</li>
            <li>Conseguir niveles, logros y monedas digitales mediante determinadas actividades.</li>
          </ul>
          <p>
            Las funcionalidades pueden evolucionar, modificarse o ampliarse para mejorar el servicio.
          </p>
          <p>
            Punto actúa como plataforma de conexión entre usuarios. No garantiza que una solicitud de
            colaboración sea aceptada, que un proyecto tenga éxito ni que se produzca una relación
            profesional, laboral o comercial.
          </p>
          <p>
            Los acuerdos que los usuarios establezcan entre ellos son responsabilidad de las partes
            implicadas.
          </p>
        </section>

        {/* 4. Registro y seguridad de la cuenta */}
        <section id="registro-seguridad" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            4. Registro y seguridad de la cuenta
          </h2>
          <p>
            Para utilizar las funciones que requieren una cuenta, el usuario deberá registrarse
            mediante los métodos de acceso disponibles.
          </p>
          <p>El usuario se compromete a:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Facilitar información correcta y actualizada.</li>
            <li>Mantener la confidencialidad de sus credenciales.</li>
            <li>No compartir su cuenta con otras personas.</li>
            <li>No crear cuentas falsas o hacerse pasar por terceros.</li>
            <li>Avisar si detecta accesos no autorizados.</li>
            <li>Utilizar la cuenta de manera personal y conforme a estos términos.</li>
          </ul>
          <p>
            El usuario es responsable de la actividad realizada desde su cuenta, salvo que exista una
            circunstancia que legalmente excluya dicha responsabilidad.
          </p>
          <p>
            Punto podrá adoptar medidas de seguridad o solicitar verificaciones adicionales cuando
            resulte necesario.
          </p>
        </section>

        {/* 5. Normas de comportamiento */}
        <section id="normas-comportamiento" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            5. Normas de comportamiento
          </h2>
          <p>Todos los usuarios deben mantener una conducta respetuosa y legal.</p>
          <p>Queda prohibido:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Acosar, amenazar, intimidar o perseguir a otros usuarios.</li>
            <li>Discriminar por motivos personales o sociales.</li>
            <li>Suplantar identidades.</li>
            <li>Publicar contenido ilegal o que vulnere derechos de terceros.</li>
            <li>Compartir información privada de otras personas sin autorización.</li>
            <li>Enviar spam o mensajes comerciales no solicitados.</li>
            <li>Utilizar Punto para cometer fraudes o estafas.</li>
            <li>Manipular proyectos, colaboraciones o rankings.</li>
            <li>Crear perfiles falsos para obtener ventajas.</li>
            <li>Distribuir malware, enlaces peligrosos o contenido engañoso.</li>
            <li>Utilizar la plataforma para actividades delictivas.</li>
            <li>
              Intentar acceder sin autorización a cuentas, sistemas o información de otros usuarios.
            </li>
          </ul>
          <p>
            Tampoco está permitido utilizar Punto para compartir material de explotación o abuso
            sexual infantil, contenido sexual de menores o cualquier material que implique abuso o
            explotación de menores.
          </p>
          <p>
            El incumplimiento podrá dar lugar a restricciones, suspensión o eliminación de la cuenta,
            teniendo en cuenta la gravedad y las circunstancias del caso.
          </p>
        </section>

        {/* 6. Perfiles, proyectos y contenido de los usuarios */}
        <section id="perfiles-contenido" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            6. Perfiles, proyectos y contenido de los usuarios
          </h2>
          <p>
            Los usuarios son responsables del contenido que incorporan a Punto, incluidos sus
            perfiles, fotografías, descripciones, habilidades, proyectos y mensajes.
          </p>
          <p>Cada usuario declara que:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Tiene derecho a utilizar el contenido que publica.</li>
            <li>No infringe derechos de autor, marcas, imagen o privacidad de terceros.</li>
            <li>No publica información falsa con intención de engañar.</li>
            <li>No comparte datos personales de otras personas sin autorización.</li>
          </ul>
          <p>El usuario conserva los derechos que le correspondan sobre el contenido que crea y publica.</p>
          <p>
            Al utilizar Punto, concede al titular una licencia no exclusiva, gratuita, limitada a la
            duración y finalidades necesarias para alojar, almacenar, reproducir y mostrar ese
            contenido dentro de la plataforma, así como para prestar y mantener sus funcionalidades.
          </p>
          <p>Esta licencia no supone una transferencia de propiedad del contenido.</p>
          <p>
            El usuario puede dejar de utilizar Punto y solicitar la eliminación de su cuenta
            conforme a la sección correspondiente.
          </p>
        </section>

        {/* 7. Mensajes y comunicaciones entre usuarios */}
        <section id="mensajes" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            7. Mensajes y comunicaciones entre usuarios
          </h2>
          <p>
            Punto permite la comunicación privada entre usuarios mediante las funciones de chat
            disponibles.
          </p>
          <p>Los usuarios se comprometen a utilizar los mensajes de forma respetuosa y legal.</p>
          <p>No deben utilizar el chat para:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Amenazar o acosar.</li>
            <li>Enviar spam.</li>
            <li>Solicitar datos personales sensibles de forma fraudulenta.</li>
            <li>Distribuir contenido ilegal.</li>
            <li>Suplantar a otras personas.</li>
            <li>Realizar actividades comerciales engañosas.</li>
          </ul>
          <p>
            Los usuarios deben actuar con precaución al compartir información personal o establecer
            colaboraciones con personas que no conocen.
          </p>
          <p>
            Punto no garantiza la identidad real, la fiabilidad o las intenciones de los demás
            usuarios.
          </p>
        </section>

        {/* 8. Bloqueos, seguridad y moderación */}
        <section id="bloqueos-moderacion" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            8. Bloqueos, seguridad y moderación
          </h2>
          <p>Punto dispone de funciones para bloquear a otros usuarios.</p>
          <p>
            El bloqueo permite limitar las interacciones con la persona bloqueada conforme al
            funcionamiento de la aplicación.
          </p>
          <p>
            Los usuarios pueden comunicar problemas de seguridad, denuncias o posibles incumplimientos
            a través del correo:
          </p>
          <p className="font-semibold text-[#0B0B0D]">
            <a
              href={`mailto:${REPORTS_EMAIL_ADDRESS}`}
              className="underline decoration-black/25 underline-offset-2"
            >
              {REPORTS_EMAIL_ADDRESS}
            </a>
          </p>
          <p>
            Las comunicaciones deberán incluir información suficiente para identificar el problema, sin
            adjuntar ni reenviar material ilegal de abuso sexual infantil.
          </p>
          <p>
            Punto podrá revisar las comunicaciones recibidas y adoptar medidas razonables, que
            pueden incluir restricciones, suspensión o eliminación de cuentas cuando proceda.
          </p>
          <p>
            La actuación dependerá de la información disponible, la gravedad del caso y las
            obligaciones legales aplicables.
          </p>
          <p>
            Punto podrá cooperar con las autoridades competentes cuando exista una obligación legal o
            una solicitud válida.
          </p>
        </section>

        {/* 9. Punto Rankings */}
        <section id="punto-rankings" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            9. Punto Rankings
          </h2>
          <p>
            Punto Rankings es una función que permite a los usuarios participar en clasificaciones
            relacionadas con su actividad dentro de la plataforma.
          </p>
          <p>
            Los rankings pueden incluir categorías como creatividad, colaboración, proyectos,
            comunidad y talento, según las funcionalidades disponibles.
          </p>
          <p>
            Las clasificaciones pueden organizarse por temporadas mensuales, anuales y otros periodos
            que se habiliten.
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              9.1. Puntuaciones
            </h3>
            <p>El sistema puede asignar puntos por actividades válidas dentro de Punto.</p>
            <p>Entre las actividades consideradas actualmente se encuentran:</p>
            <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
              <li>
                Proyecto de calidad: proyecto con nombre y descripción de al menos 40 caracteres.
              </li>
              <li>
                Participación: cuando un usuario se postula a un proyecto y realiza un match con su
                creador. Puede generar 25 puntos.
              </li>
              <li>
                Colaboración válida: match en el que ambas personas han enviado al menos tres
                mensajes. Puede generar 30 puntos.
              </li>
              <li>Día activo: puede generar 2 puntos.</li>
            </ul>
            <p>
              Los valores y criterios pueden ajustarse para mejorar la equidad y evitar
              manipulaciones.
            </p>
            <p>
              Punto podrá invalidar puntuaciones obtenidas mediante fraude, automatización no
              autorizada, cuentas falsas o comportamientos artificiales.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              9.2. Temporadas
            </h3>
            <p>
              Los rankings se reinician al comenzar cada mes, según el calendario de temporadas de la
              aplicación.
            </p>
            <p>Cada categoría puede disponer de su propia clasificación.</p>
            <p>Los resultados de temporadas anteriores podrán conservarse como historial.</p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              9.3. Monedas de Punto
            </h3>
            <p>Punto dispone de cinco monedas digitales coleccionables:</p>
            <ol className="list-decimal space-y-1 pl-5 text-[14.5px]">
              <li>Bronce.</li>
              <li>Plata.</li>
              <li>Oro.</li>
              <li>Platino.</li>
              <li>Diamante.</li>
            </ol>
            <p>Estas monedas representan logros y reconocimientos dentro de Punto.</p>
            <p>
              No son dinero, criptomonedas, activos financieros ni instrumentos de pago. No tienen
              valor monetario, no pueden canjearse por dinero y no pueden transferirse o venderse a
              otros usuarios.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              9.4. Recompensas Premium
            </h3>
            <p>
              La obtención y visualización de monedas está reservada a usuarios con una suscripción
              Premium activa, conforme a las condiciones de la función.
            </p>
            <p>
              Los usuarios gratuitos pueden participar en los rankings, pero no obtener ni mostrar
              las monedas Premium mientras no tengan acceso Premium.
            </p>
            <p>
              Las monedas se conceden por logros y actividades verificadas por los sistemas de
              Punto. No pueden comprarse directamente ni obtenerse mediante pagos adicionales.
            </p>
            <p>
              Los requisitos y criterios de obtención podrán mostrarse dentro de la aplicación y
              actualizarse para mantener la integridad del sistema.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              9.5. Fin de la suscripción Premium
            </h3>
            <p>
              Si una suscripción Premium caduca o se cancela y deja de estar activa, las monedas que
              el usuario haya conseguido se conservarán asociadas a su cuenta.
            </p>
            <p>
              Sin embargo, su visualización y las funciones exclusivas de colección podrán quedar
              bloqueadas hasta que vuelva a disponer de Premium.
            </p>
            <p>
              Punto podrá retirar o corregir recompensas obtenidas mediante fraude o errores
              técnicos debidamente identificados.
            </p>
          </div>
        </section>

        {/* 10. Punto Pro y suscripciones */}
        <section id="punto-pro" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            10. Punto Pro y suscripciones
          </h2>
          <p>
            Punto puede ofrecer una modalidad gratuita y una suscripción de pago denominada Punto
            Pro o Premium.
          </p>
          <p>
            La suscripción puede proporcionar funcionalidades adicionales, personalización,
            estadísticas y acceso a las monedas y colecciones Premium, según la oferta vigente.
          </p>
          <p>Antes de contratar, el usuario podrá consultar:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Precio aplicable.</li>
            <li>Periodo de facturación.</li>
            <li>Funciones incluidas.</li>
            <li>Duración de la suscripción.</li>
            <li>Condiciones de renovación.</li>
            <li>Condiciones de cancelación.</li>
          </ul>
          <p>
            El precio y las condiciones concretas serán los que se muestren en el momento de la
            compra.
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">10.1. Pagos</h3>
            <p>
              Las compras realizadas a través de Google Play o Apple App Store estarán sujetas
              también a las condiciones de pago y suscripción de la plataforma correspondiente.
            </p>
            <p>
              El procesamiento de pagos se realiza mediante los proveedores de distribución y
              servicios de suscripción utilizados por Punto.
            </p>
            <p>
              Punto no recibe directamente los datos completos de las tarjetas bancarias cuando el
              pago se procesa a través de esas plataformas.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              10.2. Renovaciones
            </h3>
            <p>
              Las suscripciones pueden renovarse automáticamente al finalizar cada periodo si el
              usuario no las cancela conforme al procedimiento de la plataforma de compra.
            </p>
            <p>
              El usuario puede gestionar la cancelación desde la cuenta de Google Play o Apple
              correspondiente, según dónde haya contratado la suscripción.
            </p>
            <p>
              La cancelación normalmente evita la siguiente renovación y no implica necesariamente la
              devolución de importes ya cobrados.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              10.3. Reembolsos y desistimiento
            </h3>
            <p>
              Los derechos de desistimiento, reembolso y resolución se regirán por la normativa de
              protección de consumidores aplicable y por las condiciones de la plataforma de compra.
            </p>
            <p>
              Cuando resulte aplicable el derecho de desistimiento de 14 días en contratos a
              distancia, se respetarán sus condiciones y excepciones legales.
            </p>
            <p>
              En el caso de contenidos o servicios digitales, la pérdida del derecho de
              desistimiento solo podrá producirse cuando se cumplan los requisitos legales, incluidos
              los consentimientos y reconocimientos expresos que correspondan.
            </p>
            <p>
              Nada de lo establecido en estos términos limita los derechos irrenunciables de los
              consumidores.
            </p>
          </div>
        </section>

        {/* 11. Disponibilidad y modificaciones del servicio */}
        <section id="disponibilidad" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            11. Disponibilidad y modificaciones del servicio
          </h2>
          <p>Punto trabaja para mantener la aplicación disponible y funcional.</p>
          <p>Sin embargo, pueden producirse interrupciones por:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Mantenimiento.</li>
            <li>Actualizaciones.</li>
            <li>Problemas técnicos.</li>
            <li>Incidencias de proveedores externos.</li>
            <li>Fallos de conexión.</li>
            <li>Circunstancias fuera del control razonable del titular.</li>
          </ul>
          <p>
            Punto podrá modificar, actualizar, añadir o retirar funcionalidades cuando resulte
            necesario por motivos técnicos, de seguridad, legales o de mejora del servicio.
          </p>
          <p>
            Cuando una modificación afecte de manera significativa a una funcionalidad de pago, se
            respetarán los derechos que correspondan al usuario conforme a la legislación aplicable.
          </p>
        </section>

        {/* 12. Servicios y proveedores externos */}
        <section id="proveedores-externos" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            12. Servicios y proveedores externos
          </h2>
          <p>
            Punto utiliza proveedores tecnológicos para ofrecer sus funcionalidades, que pueden
            incluir servicios de autenticación, almacenamiento, bases de datos, pagos y gestión de
            suscripciones.
          </p>
          <p>Entre los proveedores utilizados se encuentran:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Supabase, para servicios de autenticación, almacenamiento y base de datos.</li>
            <li>RevenueCat, para la gestión técnica de suscripciones.</li>
            <li>
              Google Play y Apple App Store, cuando corresponda, para la distribución y
              procesamiento de compras.
            </li>
          </ul>
          <p>El uso de estos proveedores está sujeto también a sus propias condiciones y políticas.</p>
          <p>
            Punto no controla íntegramente los servicios externos y no será responsable de las
            interrupciones que se deban exclusivamente a ellos, sin perjuicio de las
            responsabilidades que legalmente correspondan.
          </p>
        </section>

        {/* 13. Propiedad intelectual e industrial */}
        <section id="propiedad-intelectual" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            13. Propiedad intelectual e industrial
          </h2>
          <p>
            La aplicación Punto, su identidad visual, logotipo, diseño, elementos gráficos, software,
            textos propios y demás elementos protegidos pertenecen a su titular o se utilizan bajo
            las licencias correspondientes.
          </p>
          <p>
            No está permitido copiar, distribuir, modificar, vender o explotar comercialmente estos
            elementos sin autorización, salvo en los casos permitidos por la legislación.
          </p>
          <p>
            Los usuarios no adquieren derechos de propiedad sobre la aplicación por el mero hecho de
            utilizarla.
          </p>
          <p>
            El contenido aportado por los usuarios seguirá perteneciendo a sus respectivos
            titulares, de acuerdo con la sección 6.
          </p>
        </section>

        {/* 14. Privacidad y protección de datos */}
        <section id="privacidad" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            14. Privacidad y protección de datos
          </h2>
          <p>
            El tratamiento de los datos personales se realiza conforme a la Política de Privacidad de
            Punto y a la legislación aplicable.
          </p>
          <p>La Política de Privacidad explica:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Qué información se recoge.</li>
            <li>Para qué se utiliza.</li>
            <li>Qué proveedores intervienen.</li>
            <li>Durante cuánto tiempo se conserva.</li>
            <li>Cómo ejercer los derechos de protección de datos.</li>
            <li>Cómo solicitar la eliminación de una cuenta.</li>
          </ul>
          <p>La Política de Privacidad está disponible en:</p>
          <p>
            <a
              href="/privacidad"
              onClick={(e) => handleInternalLink(e, '/privacidad')}
              className="font-medium text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
            >
              https://usepunto.com/privacidad
            </a>
          </p>
          <p>
            El usuario debe consultar ese documento para conocer todos los detalles sobre el
            tratamiento de sus datos personales.
          </p>
        </section>

        {/* 15. Eliminación de cuentas */}
        <section id="eliminacion-cuentas" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            15. Eliminación de cuentas
          </h2>
          <p>
            El usuario puede solicitar la eliminación de su cuenta mediante las opciones disponibles
            en la aplicación o los canales de contacto habilitados.
          </p>
          <p>
            La eliminación de la cuenta implica la supresión de los datos personales asociados
            conforme a la Política de Privacidad y a las obligaciones legales aplicables.
          </p>
          <p>
            Determinada información podrá conservarse durante el tiempo necesario cuando exista una
            obligación legal, una reclamación pendiente o una base legítima para su conservación.
          </p>
          <p>
            La eliminación de una cuenta no implica necesariamente la devolución de pagos o
            suscripciones ya realizados. El usuario deberá gestionar también la cancelación de su
            suscripción en la plataforma donde la contrató.
          </p>
        </section>

        {/* 16. Limitación de responsabilidad */}
        <section id="limitacion-responsabilidad" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            16. Limitación de responsabilidad
          </h2>
          <p>
            Punto facilita herramientas para conectar personas y desarrollar proyectos, pero no
            garantiza:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Que otros usuarios respondan a las solicitudes.</li>
            <li>Que una colaboración llegue a realizarse.</li>
            <li>Que un proyecto consiga financiación o resultados.</li>
            <li>Que la información publicada por otros usuarios sea siempre correcta.</li>
            <li>Que todos los usuarios actúen de buena fe.</li>
            <li>Que el servicio esté libre de interrupciones.</li>
          </ul>
          <p>
            Los usuarios deben valorar por sí mismos las decisiones que tomen al colaborar,
            compartir información o establecer acuerdos con otras personas.
          </p>
          <p>
            Nada de esta sección excluye o limita responsabilidades que legalmente no puedan
            excluirse, ni los derechos reconocidos a los consumidores.
          </p>
        </section>

        {/* 17. Suspensión y cancelación de cuentas */}
        <section id="suspension-cancelacion" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            17. Suspensión y cancelación de cuentas
          </h2>
          <p>
            Punto podrá restringir, suspender o cancelar cuentas cuando existan motivos
            justificados, como:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
            <li>Incumplimientos de estos términos.</li>
            <li>Actividades fraudulentas.</li>
            <li>Suplantación de identidad.</li>
            <li>Acoso o amenazas.</li>
            <li>Uso abusivo de la plataforma.</li>
            <li>Manipulación de rankings o recompensas.</li>
            <li>Riesgos para la seguridad de los usuarios.</li>
            <li>Obligaciones legales o requerimientos de autoridades competentes.</li>
          </ul>
          <p>
            Cuando resulte apropiado y legalmente posible, se informará al usuario de la medida y de
            sus motivos.
          </p>
          <p>
            La gravedad, repetición y circunstancias del incumplimiento podrán tenerse en cuenta
            para decidir la medida correspondiente.
          </p>
        </section>

        {/* 18. Cambios en los términos */}
        <section id="cambios-terminos" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            18. Cambios en los términos
          </h2>
          <p>
            Punto podrá actualizar estos Términos y Condiciones para adaptarlos a cambios legales,
            técnicos o funcionales.
          </p>
          <p>La versión vigente estará disponible en:</p>
          <p>
            <a
              href="/terminos"
              onClick={(e) => handleInternalLink(e, '/terminos')}
              className="font-medium text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
            >
              https://usepunto.com/terminos
            </a>
          </p>
          <p>
            Cuando los cambios sean relevantes, se procurará informar a los usuarios mediante la
            aplicación, la web u otro medio adecuado.
          </p>
          <p>La fecha de actualización aparecerá al principio del documento.</p>
        </section>

        {/* 19. Legislación aplicable y resolución de conflictos */}
        <section id="legislacion" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            19. Legislación aplicable y resolución de conflictos
          </h2>
          <p>
            Estos Términos y Condiciones se rigen por la legislación española y por las normas de la
            Unión Europea que resulten aplicables.
          </p>
          <p>
            Cuando el usuario tenga la condición de consumidor, cualquier conflicto se resolverá ante
            los juzgados y tribunales que correspondan conforme a las normas legales de competencia y
            protección de consumidores.
          </p>
          <p>
            El usuario también podrá acudir a los mecanismos de resolución extrajudicial de
            conflictos que estén legalmente disponibles.
          </p>
        </section>

        {/* 20. Contacto */}
        <section id="contacto" className="scroll-mt-20 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            20. Contacto
          </h2>
          <p>
            Para consultas relacionadas con estos Términos y Condiciones, el funcionamiento de Punto
            o posibles incumplimientos, puedes contactar con:
          </p>
          <div className="space-y-1.5 rounded-2xl border border-black/[0.06] bg-[#F7F8FA] p-4 text-[14.5px]">
            <p className="font-semibold text-[#0B0B0D]">MCD Group — Punto</p>
            <p>
              <strong>Correo electrónico:</strong>{' '}
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="font-medium text-[#0B0B0D] underline decoration-black/25 underline-offset-2"
              >
                {EMAIL_ADDRESS}
              </a>
            </p>
            <p>
              <strong>Domicilio:</strong> Carrer del Riu Segre, 2, 2, 17003 Girona, España.
            </p>
          </div>
        </section>

        <div className="border-t border-black/[0.06] pt-6 text-[13.5px] text-[#52525B] space-y-1">
          <p className="font-semibold text-[#0B0B0D]">
            Fin de los Términos y Condiciones de Punto.
          </p>
          <p>Última actualización: 23 de noviembre de 2026.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 print:hidden">
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0C] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1C1C20]"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{EMAIL_ADDRESS}</span>
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
