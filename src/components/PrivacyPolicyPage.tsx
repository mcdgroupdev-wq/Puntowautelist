import { Check, ChevronDown, ChevronUp, Copy, Mail, Printer } from 'lucide-react';
import { type MouseEvent, useState } from 'react';
import { PUNTO_BRAND } from '../config/punto';
import { LegalLayout } from './LegalLayout';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

const SECTIONS = [
  { id: 'introduccion', label: '1. Introducción' },
  { id: 'responsable', label: '2. Responsable del tratamiento y contacto' },
  { id: 'informacion', label: '3. Información que podemos recopilar' },
  { id: 'uso', label: '4. Cómo utilizamos los datos' },
  { id: 'terceros', label: '5. Servicios de terceros' },
  { id: 'seguridad', label: '6. Cómo protegemos la información' },
  { id: 'conservacion', label: '7. Cuánto tiempo conservamos los datos' },
  { id: 'derechos', label: '8. Derechos de los usuarios y eliminación de datos' },
  { id: 'menores', label: '9. Privacidad de menores' },
  { id: 'cambios', label: '10. Cambios en esta política' },
  { id: 'contacto', label: '11. Contacto y reclamaciones' },
] as const;

const EMAIL_ADDRESS = PUNTO_BRAND.contactEmail;
const REPORTS_EMAIL_ADDRESS = PUNTO_BRAND.reportsEmail;
const POSTAL_ADDRESS = 'Carrer del Riu Segre, 2, 2, 17003 Girona, España';
const DELETE_TEMPLATE = `Asunto: Solicitud de eliminación de cuenta y datos - Punto\n\nCorreo electrónico registrado en la aplicación:\nNombre de usuario o alias visible:`;

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const [indexOpen, setIndexOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState<'email' | 'template' | 'address' | null>(null);

  async function handleCopy(text: string, key: 'email' | 'template' | 'address') {
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

  function handleHomeClick(event: MouseEvent<HTMLAnchorElement>) {
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
    <LegalLayout onNavigate={onNavigate} activePath="/privacidad">
      {/* Encabezado del documento */}
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
              onClick={() => handleCopy(EMAIL_ADDRESS, 'email')}
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
          Política de Privacidad
        </h1>

        <p className="mt-3 text-[15px] leading-[1.65] text-[#52525B]">
          Información sobre cómo la aplicación Punto recopila, utiliza, protege y gestiona los datos de los usuarios.
        </p>

        <p className="mt-3 text-[13px] font-semibold text-[#0B0B0D]">
          Última actualización: 23 de noviembre de 2026
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-black/[0.05] bg-[#F7F8FA] p-4 sm:grid-cols-3 sm:p-5">
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Aplicación:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">Punto</dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Responsable del tratamiento:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              MUHAMADOU CAMARA DIBBASY (MCD Group)
            </dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-medium text-[#71717A]">Fecha de actualización:</dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B0B0D]">
              14 de noviembre de 2026
            </dd>
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
        {/* 1. Introducción */}
        <section id="introduccion" className="scroll-mt-6 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            1. Introducción
          </h2>
          <p>
            Bienvenido a Punto. La presente Política de Privacidad describe de manera transparente, clara y precisa la forma en que MCD Group recopila, trata, almacena y protege los datos personales de las personas que utilizan nuestra aplicación móvil.
          </p>
          <p>
            Punto es una plataforma diseñada para conectar a personas con intereses, habilidades e ideas similares, facilitando el descubrimiento de colaboradores afines, la creación y difusión de proyectos colaborativos y la comunicación directa entre usuarios.
          </p>
          <p>
            El respeto por la privacidad de nuestra comunidad es un principio rector de Punto. Nos comprometemos a recopilar exclusivamente los datos que resulten estrictamente necesarios para el correcto funcionamiento del servicio y a garantizar que el usuario mantenga el control sobre su información personal en todo momento.
          </p>
          <p>
            Al descargar, registrarse o utilizar la aplicación Punto, el usuario reconoce haber leído y comprendido los términos recogidos en esta Política de Privacidad.
          </p>
        </section>

        {/* 2. Responsable del tratamiento y contacto */}
        <section id="responsable" className="scroll-mt-6 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            2. Responsable del tratamiento y contacto
          </h2>
          <p>
            La aplicación Punto es gestionada bajo la marca comercial MCD Group, cuyo responsable del tratamiento de datos personales es:
          </p>
          <div className="space-y-1.5 rounded-2xl border border-black/[0.06] bg-[#F7F8FA] p-4 text-[14.5px]">
            <p>
              <strong className="text-[#0B0B0D]">Nombre legal:</strong> MUHAMADOU CAMARA DIBBASY
            </p>
            <p>
              <strong className="text-[#0B0B0D]">Nombre comercial:</strong> MCD Group
            </p>
            <p>
              <strong className="text-[#0B0B0D]">Aplicación:</strong> Punto
            </p>
            <p>
              <strong className="text-[#0B0B0D]">Correo electrónico:</strong>{' '}
              <a href={`mailto:${EMAIL_ADDRESS}`} className="underline hover:text-[#0B0B0D]">
                {EMAIL_ADDRESS}
              </a>
            </p>
            <p>
              <strong className="text-[#0B0B0D]">Domicilio:</strong> Carrer del Riu Segre, 2, 2, 17003 Girona, España.
            </p>
          </div>
          <p>
            Para cualquier consulta relacionada con la privacidad y el tratamiento de datos personales, o para ejercer cualquiera de los derechos de protección de datos reconocidos por la legislación aplicable, puedes contactar con nosotros mediante el correo electrónico indicado: {EMAIL_ADDRESS}.
          </p>
        </section>

        {/* 3. Información que podemos recopilar */}
        <section id="informacion" className="scroll-mt-6 space-y-5">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            3. Información que podemos recopilar
          </h2>
          <p>
            Para cumplir con las finalidades de networking, emparejamiento de habilidades y colaboración en proyectos, Punto puede tratar las siguientes categorías de información, siempre de forma proporcionada:
          </p>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              3.1 Datos de registro y autenticación
            </h3>
            <p>
              Cuando creas una cuenta en Punto, recopilamos tu dirección de correo electrónico y credenciales de acceso seguras. En caso de registro tradicional, las contraseñas son procesadas de forma criptográficamente segura por nuestro proveedor de autenticación y nunca son visibles ni accesibles en texto plano por el equipo de Punto. Se asigna asimismo un identificador único de usuario (UID).
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              3.2 Nombre, edad y ubicación que el usuario decida incluir
            </h3>
            <p>
              Información básica que el usuario puede proporcionar voluntariamente para configurar su perfil dentro de la comunidad:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[#0B0B0D]">Nombre o alias:</strong> nombre de visualización con el que te identificas ante otros miembros.
              </li>
              <li>
                <strong className="text-[#0B0B0D]">Edad:</strong> edad o fecha de nacimiento declarada para comprobar el cumplimiento de la edad mínima de acceso a Punto.
              </li>
              <li>
                <strong className="text-[#0B0B0D]">Ubicación:</strong> ciudad, región o país que decidas introducir manualmente en tu perfil para facilitar conexiones con personas de lugares similares.
              </li>
            </ul>
            <p>
              Punto no solicita permisos de GPS ni accede a la ubicación precisa del dispositivo para obtener estos datos.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              3.3 Fotografías y datos del perfil
            </h3>
            <p>
              Fotografía de perfil o avatar que el usuario suba voluntariamente para personalizar su cuenta, así como la biografía, breve descripción personal, ocupación actual o enlaces a perfiles profesionales que el propio usuario decida publicar.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              3.4 Habilidades e intereses
            </h3>
            <p>
              Etiquetas, competencias profesionales, destrezas técnicas, creativas o de negocio, e intereses temáticos que selecciones o introduzcas en tu perfil. Esta información es la base del sistema de recomendación y descubrimiento entre colaboradores de Punto.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              3.5 Información sobre proyectos y solicitudes de colaboración
            </h3>
            <p>
              Datos de los proyectos creados por el usuario (título, descripción, etapa de desarrollo, roles requeridos, archivos adjuntos informativos) y las solicitudes de unión o invitaciones enviadas y recibidas entre colaboradores dentro de la aplicación.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              3.6 Likes, conexiones y perfiles guardados
            </h3>
            <p>
              Registros de interacción social dentro de la aplicación: perfiles o proyectos a los que has dado «me gusta», conexiones mutuas aceptadas o pendientes, y elementos que decidas guardar en tu lista privada de favoritos para consultarlos con posterioridad.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              3.7 Mensajes enviados mediante la aplicación
            </h3>
            <p>
              Cuando la función de mensajería interna esté habilitada, recopilamos y almacenamos los mensajes de texto intercambiados entre usuarios para permitir la conversación y coordinación entre colaboradores, incluyendo la fecha y hora del envío.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              3.8 Información técnica necesaria para el funcionamiento y la seguridad
            </h3>
            <p>
              Datos técnicos imprescindibles generados automáticamente al utilizar la aplicación: dirección IP de conexión, tipo y modelo de dispositivo móvil, versión del sistema operativo (Android o iOS), versión de la app Punto instalada, registros de diagnóstico de caídas o fallos técnicos (crash logs) y marcas de tiempo de acceso, utilizados exclusivamente para prevenir fraudes, mitigar ciberataques y garantizar la estabilidad del servicio.
            </p>
          </div>
        </section>

        {/* 4. Cómo utilizamos los datos */}
        <section id="uso" className="scroll-mt-6 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            4. Cómo utilizamos los datos
          </h2>
          <p>
            Tratamos los datos personales recabados únicamente para finalidades legítimas y directamente vinculadas a la experiencia de Punto:
          </p>
          <ul className="list-disc space-y-2.5 pl-5">
            <li>
              <strong className="text-[#0B0B0D]">Gestión de cuentas y autenticación:</strong> Permitir la creación de tu perfil, el inicio de sesión seguro, la recuperación de credenciales y la administración de tu cuenta.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Conexión entre colaboradores:</strong> Mostrar tu perfil público, tus habilidades e intereses a otros miembros de la comunidad con el fin de sugerir posibles colaboraciones y proyectos afines.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Gestión de proyectos y solicitudes:</strong> Publicar proyectos creados por ti, permitir que otros usuarios envíen solicitudes de colaboración y gestionar las respuestas correspondientes.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Comunicación interna:</strong> Facilitar el envío de mensajes privados entre usuarios conectados cuando esta funcionalidad se encuentre operativa.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Seguridad, integridad y prevención del fraude:</strong> Proteger la infraestructura de Punto frente a usos malintencionados, suplantaciones de identidad, spam o conductas contrarias a las normas de convivencia de la plataforma.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Soporte al usuario:</strong> Atender consultas, resolver incidencias técnicas reportadas y gestionar las solicitudes de ejercicio de derechos de privacidad.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Cumplimiento de obligaciones legales:</strong> Atender requerimientos de autoridades judiciales o administrativas competentes de acuerdo con la legislación vigente.
            </li>
          </ul>
          <p className="font-medium text-[#0B0B0D]">
            Punto NO comercializa, no vende ni cede datos personales a corredores de datos (data brokers) ni a redes de publicidad comportamental de terceros.
          </p>
        </section>

        {/* 5. Servicios de terceros */}
        <section id="terceros" className="scroll-mt-6 space-y-5">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            5. Servicios de terceros
          </h2>
          <p>
            Para prestar el servicio con garantías de fiabilidad, escalabilidad y seguridad técnica, Punto recurre a proveedores especializados encargados del tratamiento de datos. No afirmamos la existencia de otros proveedores no verificados:
          </p>

          <div className="space-y-2 rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-4 sm:p-5">
            <h3 className="font-display text-[16.5px] font-bold text-[#0B0B0D]">Supabase</h3>
            <p className="text-[13px] font-semibold text-[#52525B]">
              Infraestructura de datos, autenticación y almacenamiento
            </p>
            <p>
              Punto utiliza Supabase para gestionar la autenticación, la base de datos y el almacenamiento de archivos. La región principal de alojamiento de nuestro proyecto es West EU (Ireland), identificada técnicamente como eu-west-1.
            </p>
            <p>
              Aunque la infraestructura principal está alojada en Irlanda, determinados servicios de soporte y subproveedores pueden implicar tratamientos de datos desde otras ubicaciones. Estos tratamientos se rigen por los compromisos de protección de datos de Supabase y las garantías aplicables.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-4 sm:p-5">
            <h3 className="font-display text-[16.5px] font-bold text-[#0B0B0D]">RevenueCat</h3>
            <p className="text-[13px] font-semibold text-[#52525B]">
              Gestión de suscripciones y compras dentro de la aplicación
            </p>
            <p>
              Punto utiliza RevenueCat para gestionar y verificar las suscripciones de pago, mantener el estado de las compras y facilitar la gestión de los derechos Premium.
            </p>
            <p>
              RevenueCat puede recibir identificadores de usuario asociados a las compras, información técnica del dispositivo y datos de transacciones o suscripciones. Los pagos se procesan a través de las plataformas de distribución correspondientes, como Google Play o Apple App Store. Punto no recibe directamente los datos completos de la tarjeta bancaria del usuario a través de RevenueCat.
            </p>
            <p>
              RevenueCat puede tratar información mediante infraestructura situada en Estados Unidos. Cuando resulte aplicable, las transferencias internacionales estarán sujetas a las garantías previstas en la normativa de protección de datos.
            </p>
            <p>
              Más información:{' '}
              <a
                href="https://www.revenuecat.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#0B0B0D]"
              >
                https://www.revenuecat.com/privacy
              </a>
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-4 sm:p-5">
            <h3 className="font-display text-[16.5px] font-bold text-[#0B0B0D]">
              Google (Google Sign-In)
            </h3>
            <p className="text-[13px] font-semibold text-[#52525B]">
              Proveedor de identidad federada opcional
            </p>
            <p>
              Cuando el usuario elige voluntariamente registrarse o iniciar sesión mediante la opción «Continuar con Google», Google valida la identidad del usuario y comparte con Punto datos básicos autorizados previamente (dirección de correo electrónico, nombre público y fotografía de avatar).
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
              Otros proveedores y servicios
            </h3>
            <p>
              Los proveedores externos utilizados por Punto se identifican en esta política según las funciones y servicios integrados en la aplicación.
            </p>
            <p>
              Cuando se incorporen nuevos proveedores que intervengan en el tratamiento de datos personales, MCD Group actualizará esta política para informar de su identidad, finalidad y categorías de datos tratados, cuando corresponda.
            </p>
            <p>
              La información sobre los proveedores se revisará periódicamente para mantenerla actualizada.
            </p>
          </div>
        </section>

        {/* 6. Cómo protegemos la información */}
        <section id="seguridad" className="scroll-mt-6 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            6. Cómo protegemos la información
          </h2>
          <p>
            MCD Group aplica medidas técnicas y organizativas proporcionadas al riesgo para salvaguardar los datos personales contra accesos no autorizados, pérdidas accidentales, alteración o divulgación indebida:
          </p>
          <ul className="list-disc space-y-2.5 pl-5">
            <li>
              <strong className="text-[#0B0B0D]">Cifrado en tránsito:</strong> Todas las comunicaciones entre la aplicación móvil Punto y los servidores se realizan bajo conexiones cifradas mediante protocolo HTTPS/TLS.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Políticas de seguridad a nivel de datos:</strong> Empleo de reglas de seguridad a nivel de fila (Row Level Security / RLS en Supabase) que garantizan que cada usuario únicamente pueda acceder o modificar los datos para los que cuenta con autorización legítima.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Contraseñas no accesibles:</strong> En caso de registro tradicional por correo, las contraseñas nunca se almacenan en texto plano, empleándose algoritmos de hash criptográfico unidireccional.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Control de acceso restringido:</strong> El acceso a los entornos de base de datos se encuentra estrictamente limitado al personal autorizado de MCD Group con fines de mantenimiento y soporte.
            </li>
          </ul>
          <p>
            A pesar de los esfuerzos razonables aplicados, ningún método de transmisión por Internet o almacenamiento electrónico es 100% invulnerable. Si se produjera un incidente de seguridad que comprometa los datos, MCD Group actuará con celeridad para contenerlo y notificará a los afectados y a las autoridades competentes conforme exija la normativa aplicable.
          </p>
        </section>

        {/* 7. Cuánto tiempo conservamos los datos */}
        <section id="conservacion" className="scroll-mt-6 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            7. Cuánto tiempo conservamos los datos
          </h2>
          <p>
            MCD Group conservará los datos personales durante el tiempo necesario para cumplir las finalidades para las que fueron recopilados y mientras la cuenta permanezca activa, salvo que exista una obligación legal que exija conservarlos durante más tiempo.
          </p>
          <ul className="list-disc space-y-2.5 pl-5">
            <li>
              <strong className="text-[#0B0B0D]">Datos del perfil y de la cuenta:</strong> se conservarán mientras la cuenta permanezca activa.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Proyectos y solicitudes:</strong> se conservarán mientras permanezcan publicados o sean necesarios para gestionar la actividad de la plataforma.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Mensajes:</strong> se conservarán mientras sean necesarios para prestar el servicio de comunicación, sin perjuicio de las solicitudes de supresión y de las obligaciones legales aplicables.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Eliminación de la cuenta:</strong> cuando se confirme la solicitud, MCD Group procederá a eliminar los datos personales asociados que ya no sean necesarios, salvo aquellos que deban conservarse por obligación legal.
            </li>
            <li>
              <strong className="text-[#0B0B0D]">Registros y obligaciones legales:</strong> determinados datos podrán conservarse durante los plazos establecidos por la legislación aplicable, con acceso restringido cuando corresponda.
            </li>
          </ul>
          <p>
            Los plazos de conservación de copias de seguridad y de los sistemas de los proveedores dependerán de las condiciones técnicas y contractuales aplicables. La eliminación de los datos de los sistemas activos no implica necesariamente su desaparición instantánea de todos los sistemas de respaldo.
          </p>
        </section>

        {/* 8. Derechos de los usuarios y cómo solicitar la eliminación de sus datos */}
        <section id="derechos" className="scroll-mt-6 space-y-5">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            8. Derechos de los usuarios y cómo solicitar la eliminación de sus datos
          </h2>
          <p>
            Como usuario de Punto, tienes pleno derecho a mantener el control sobre tus datos personales. Conforme a las normativas de protección de datos vigentes, dispones de los siguientes derechos:
          </p>

          <dl className="space-y-3 rounded-2xl border border-black/[0.06] bg-[#FAFAFB] p-4 sm:p-5">
            <div>
              <dt className="font-semibold text-[#0B0B0D]">Acceso:</dt>
              <dd className="text-[#3F3F46]">Conocer qué datos personales tuyos están siendo tratados por Punto.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#0B0B0D]">Rectificación:</dt>
              <dd className="text-[#3F3F46]">
                Modificar o corregir datos inexactos o incompletos desde tu propio perfil o por solicitud.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[#0B0B0D]">Supresión («Derecho al olvido»):</dt>
              <dd className="text-[#3F3F46]">
                Solicitar el borrado íntegro de tu cuenta y de tus datos personales asociados.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[#0B0B0D]">Limitación y oposición:</dt>
              <dd className="text-[#3F3F46]">
                Oponerte a determinados tratamientos o solicitar la limitación de su uso en supuestos previstos por ley.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[#0B0B0D]">Portabilidad:</dt>
              <dd className="text-[#3F3F46]">
                Recibir tus datos personales en un formato estructurado y de uso común.
              </dd>
            </div>
          </dl>

          <div className="space-y-3">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              Procedimiento para solicitar la eliminación de tu cuenta y datos
            </h3>
            <p>
              Puedes solicitar la eliminación total de tus datos a través de cualquiera de estos dos mecanismos:
            </p>
            <div className="space-y-2 rounded-2xl border border-black/[0.06] bg-[#F7F8FA] p-4">
              <p className="font-semibold text-[#0B0B0D]">
                Método 1: Desde la propia aplicación móvil Punto
              </p>
              <p>
                Si la función se encuentra disponible en tu versión de la app, dirígete a: Ajustes &gt; Cuenta &gt; Eliminar mi cuenta. La confirmación desencadenará la baja inmediata de tu perfil.
              </p>
            </div>
            <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-[#F7F8FA] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#0B0B0D]">
                  Método 2: Por correo electrónico directo
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(DELETE_TEMPLATE, 'template')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[12px] font-medium text-[#52525B] transition-colors hover:text-[#0B0B0D]"
                >
                  {copiedKey === 'template' ? (
                    <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {copiedKey === 'template' ? 'Plantilla copiada' : 'Copiar plantilla de email'}
                  </span>
                </button>
              </div>
              <p>
                Envía un mensaje a {EMAIL_ADDRESS} desde la misma dirección de correo electrónico vinculada a tu cuenta de Punto, indicando:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-[14.5px]">
                <li>Asunto: «Solicitud de eliminación de cuenta y datos - Punto»</li>
                <li>Correo electrónico registrado en la aplicación</li>
                <li>Nombre de usuario o alias visible</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-[17px] font-bold text-[#0B0B0D]">
              Plazo de respuesta y tramitación
            </h3>
            <p>
              MCD Group atenderá las solicitudes de ejercicio de derechos sin dilaciones indebidas y, como regla general, en un plazo máximo de un mes desde su recepción.
            </p>
            <p>
              Cuando la complejidad o el número de solicitudes lo justifique, este plazo podrá ampliarse hasta dos meses adicionales, de acuerdo con el artículo 12.3 del Reglamento General de Protección de Datos. En tal caso, se informará al solicitante de la ampliación y de sus motivos dentro del primer mes.
            </p>
            <p>
              La eliminación efectiva de los datos se realizará sin dilaciones indebidas cuando proceda legalmente, teniendo en cuenta las obligaciones de conservación que resulten aplicables.
            </p>
          </div>
        </section>

        {/* 9. Privacidad de menores */}
        <section id="menores" className="scroll-mt-6 space-y-3">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            9. Privacidad de menores
          </h2>
          <h3 className="font-display text-[16.5px] font-semibold text-[#0B0B0D]">
            Edad mínima de uso
          </h3>
          <p>
            Punto está dirigido exclusivamente a personas de 16 años o más. No está permitido crear una cuenta ni utilizar la aplicación a personas menores de 16 años.
          </p>
          <p>
            Si detectamos que una persona menor de esa edad utiliza Punto, podremos tomar medidas para restringir o eliminar su cuenta.
          </p>
          <p>
            Punto no recopila intencionadamente datos personales de personas menores de 16 años. Si un padre, madre o tutor legal detecta que un menor bajo su tutela ha proporcionado información personal en Punto sin cumplir con la edad mínima requerida, puede ponerse en contacto con nosotros a través de {REPORTS_EMAIL_ADDRESS} para que verifiquemos la situación y procedamos con la restricción o eliminación correspondiente.
          </p>
        </section>

        {/* 10. Cambios en esta política */}
        <section id="cambios" className="scroll-mt-6 space-y-3">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            10. Cambios en esta política
          </h2>
          <p>
            MCD Group se reserva el derecho de actualizar o modificar la presente Política de Privacidad para reflejar cambios en las características de Punto (por ejemplo, el lanzamiento de nuevas herramientas de mensajería o proyectos), adaptaciones a nuevas normativas legales o mejoras en las prácticas de seguridad.
          </p>
          <p>
            Cualquier cambio sustancial será debidamente notificado a los usuarios mediante un aviso destacado en la aplicación móvil o a través de la dirección de correo electrónico registrada, indicando la fecha de entrada en vigor de la nueva versión.
          </p>
          <p>
            Recomendamos revisar periódicamente esta página para estar informado sobre cómo protegemos tu información. La versión vigente se identificará siempre por la fecha indicada al inicio de este documento.
          </p>
        </section>

        {/* 11. Contacto y reclamaciones */}
        <section id="contacto" className="scroll-mt-6 space-y-4">
          <h2 className="font-display text-[21px] font-bold tracking-[-0.02em] text-[#0B0B0D]">
            11. Contacto y reclamaciones
          </h2>
          <p>
            Si tienes preguntas sobre esta Política de Privacidad, el tratamiento de tus datos o deseas ejercer tus derechos de acceso, rectificación, cancelación u oposición, ponte en contacto directo con nosotros:
          </p>
          <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-[#F7F8FA] p-4 sm:p-5">
            <div className="space-y-1 text-[14.5px]">
              <p className="font-bold text-[#0B0B0D]">MCD Group · MUHAMADOU CAMARA DIBBASY</p>
              <p>Responsable del tratamiento de datos de Punto</p>
              <p>Carrer del Riu Segre, 2, 2, 17003 Girona, España</p>
              <p>
                <strong className="text-[#0B0B0D]">Correo de Punto:</strong>{' '}
                <a href={`mailto:${EMAIL_ADDRESS}`} className="font-medium underline hover:text-[#0B0B0D]">
                  {EMAIL_ADDRESS}
                </a>
              </p>
              <p>
                <strong className="text-[#0B0B0D]">Denuncias y protección de menores:</strong>{' '}
                <a href={`mailto:${REPORTS_EMAIL_ADDRESS}`} className="font-medium underline hover:text-[#0B0B0D]">
                  {REPORTS_EMAIL_ADDRESS}
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(POSTAL_ADDRESS, 'address')}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[#52525B] transition-colors hover:text-[#0B0B0D]"
              >
                {copiedKey === 'address' ? (
                  <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{copiedKey === 'address' ? 'Dirección copiada' : 'Copiar dirección'}</span>
              </button>
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0A0A0C] px-4 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1C1C20]"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Escribir email</span>
              </a>
            </div>
          </div>
          <p>
            <strong className="text-[#0B0B0D]">Autoridad de control:</strong> Si consideras que tus derechos de protección de datos no han sido debidamente atendidos, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) o la autoridad de control competente en materia de protección de datos de tu lugar de residencia.
          </p>
        </section>

        {/* Cierre del documento */}
        <div className="space-y-3 border-t border-black/[0.06] pt-6 text-[13.5px] text-[#52525B]">
          <p>© 2026 MCD Group. Todos los derechos reservados.</p>
          <p>
            <a href="/" onClick={handleHomeClick} className="font-semibold text-[#0B0B0D] underline">
              Volver al inicio
            </a>
          </p>
          <p>Punto · Aplicación móvil de conexión de talento y proyectos colaborativos.</p>
        </div>
      </div>
    </LegalLayout>
  );
}
