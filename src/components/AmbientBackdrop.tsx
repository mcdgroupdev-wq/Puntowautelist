import { Send } from 'lucide-react';
import { motion } from 'motion/react';
import { PuntoSymbol } from './PuntoLogo';

const CREATOR_ONE = '/src/assets/images/match_creator_one_1794946425402.jpg';
const CREATOR_TWO = '/src/assets/images/match_creator_two_1794946425208.jpg';
const CREATOR_THREE = '/src/assets/images/match_creator_three_1794946425652.jpg';
const CREATOR_FOUR = '/src/assets/images/match_creator_four_1794946426318.jpg';

interface ConvergingMatchCardProps {
  leftSrc: string;
  leftName: string;
  rightSrc: string;
  rightName: string;
  headline: string;
  subtitle: string;
  duration?: number;
  delay?: number;
}

function ConvergingMatchCard({
  leftSrc,
  leftName,
  rightSrc,
  rightName,
  headline,
  subtitle,
  duration = 8,
  delay = 0,
}: ConvergingMatchCardProps) {
  const times = [0, 0.14, 0.36, 0.78, 0.92, 1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{
        opacity: 0.68,
        scale: 1,
        y: [-5, 5, -5],
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      className="w-[244px] rounded-[28px] border border-black/[0.04] bg-white/75 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur-md"
    >
      <div className="relative mx-auto flex h-[132px] w-[204px] items-center justify-center">
        <motion.div
          animate={{
            scale: [0.6, 0.75, 1.5, 1.85, 0.6, 0.6],
            opacity: [0, 0, 0.35, 0, 0, 0],
          }}
          transition={{ duration, times, repeat: Infinity, ease: 'easeOut', delay }}
          className="pointer-events-none absolute h-14 w-14 rounded-full border border-[#0B0B0D]/20"
          aria-hidden="true"
        />

        <motion.div
          animate={{
            x: [-30, -24, 0, 0, -26, -30],
            y: [-16, -13, 0, 0, -14, -16],
            scale: [0.92, 0.95, 1.02, 1, 0.94, 0.92],
          }}
          transition={{ duration, times, repeat: Infinity, ease: [0.16, 1, 0.3, 1], delay }}
          className="relative -mr-3 -mt-6 flex flex-col items-center"
        >
          <div className="h-[66px] w-[66px] overflow-hidden rounded-full border-[2.5px] border-white bg-[#F0F1F4] shadow-[0_6px_18px_rgba(0,0,0,0.07)]">
            <img
              src={leftSrc}
              alt={leftName}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover saturate-[0.78]"
            />
          </div>
          <motion.span
            animate={{ opacity: [0.75, 0.75, 0, 0, 0.6, 0.75] }}
            transition={{ duration, times, repeat: Infinity, delay }}
            className="mt-1.5 text-[10px] font-medium text-[#71717A]"
          >
            {leftName}
          </motion.span>
        </motion.div>

        <motion.div
          animate={{
            x: [30, 24, 0, 0, 26, 30],
            y: [16, 13, 0, 0, 14, 16],
            scale: [0.92, 0.95, 1.02, 1, 0.94, 0.92],
          }}
          transition={{ duration, times, repeat: Infinity, ease: [0.16, 1, 0.3, 1], delay }}
          className="relative -ml-3 mt-6 flex flex-col items-center"
        >
          <div className="h-[66px] w-[66px] overflow-hidden rounded-full border-[2.5px] border-white bg-[#F0F1F4] shadow-[0_6px_18px_rgba(0,0,0,0.07)]">
            <img
              src={rightSrc}
              alt={rightName}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover saturate-[0.78]"
            />
          </div>
          <motion.span
            animate={{ opacity: [0.75, 0.75, 0, 0, 0.6, 0.75] }}
            transition={{ duration, times, repeat: Infinity, delay }}
            className="mt-1.5 text-[10px] font-medium text-[#71717A]"
          >
            {rightName}
          </motion.span>
        </motion.div>

        <motion.div
          animate={{
            scale: [0.45, 0.55, 1.12, 1, 0.5, 0.45],
            opacity: [0.2, 0.4, 0.92, 0.92, 0.3, 0.2],
            rotate: [-12, -10, 0, 0, -10, -12],
          }}
          transition={{ duration, times, repeat: Infinity, ease: [0.16, 1, 0.3, 1], delay }}
          className="absolute z-20 flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-white bg-[#141417] shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
        >
          <PuntoSymbol size={24} tone="light" />
        </motion.div>
      </div>

      <motion.div
        animate={{
          opacity: [0.3, 0.4, 0.92, 0.92, 0.35, 0.3],
          y: [3, 2, 0, 0, 2, 3],
        }}
        transition={{ duration, times, repeat: Infinity, ease: [0.16, 1, 0.3, 1], delay }}
        className="mt-1.5 text-center"
      >
        <p className="font-display text-[14.5px] font-bold tracking-[-0.025em] text-[#18181B]">
          {headline}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-[#86868B]">{subtitle}</p>
      </motion.div>
    </motion.div>
  );
}

interface MobileBackgroundMatchClusterProps {
  leftSrc: string;
  rightSrc: string;
  label: string;
  duration?: number;
  delay?: number;
}

function MobileBackgroundMatchCluster({
  leftSrc,
  rightSrc,
  label,
  duration = 7.2,
  delay = 0,
}: MobileBackgroundMatchClusterProps) {
  const times = [0, 0.14, 0.38, 0.78, 0.92, 1];

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex h-[78px] w-[136px] items-center justify-center">
        <motion.div
          animate={{
            scale: [0.6, 0.7, 1.45, 1.8, 0.6, 0.6],
            opacity: [0, 0, 0.32, 0, 0, 0],
          }}
          transition={{ duration, times, repeat: Infinity, ease: 'easeOut', delay }}
          className="pointer-events-none absolute h-11 w-11 rounded-full border border-[#0B0B0D]/15"
        />

        <motion.div
          animate={{
            x: [-24, -20, 2, 2, -22, -24],
            y: [-12, -10, -2, -2, -11, -12],
            scale: [0.9, 0.94, 1.02, 1, 0.92, 0.9],
          }}
          transition={{ duration, times, repeat: Infinity, ease: [0.16, 1, 0.3, 1], delay }}
          className="h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-[#F0F1F4] shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
        >
          <img
            src={leftSrc}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover saturate-[0.72]"
          />
        </motion.div>

        <motion.div
          animate={{
            x: [24, 20, -2, -2, 22, 24],
            y: [12, 10, 2, 2, 11, 12],
            scale: [0.9, 0.94, 1.02, 1, 0.92, 0.9],
          }}
          transition={{ duration, times, repeat: Infinity, ease: [0.16, 1, 0.3, 1], delay }}
          className="h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-[#F0F1F4] shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
        >
          <img
            src={rightSrc}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover saturate-[0.72]"
          />
        </motion.div>

        <motion.div
          animate={{
            scale: [0.45, 0.55, 1.12, 1, 0.5, 0.45],
            opacity: [0.2, 0.4, 0.9, 0.9, 0.3, 0.2],
          }}
          transition={{ duration, times, repeat: Infinity, ease: [0.16, 1, 0.3, 1], delay }}
          className="absolute z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#18181B] shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
        >
          <PuntoSymbol size={19} tone="light" />
        </motion.div>
      </div>

      <motion.span
        animate={{ opacity: [0.18, 0.3, 0.8, 0.8, 0.25, 0.18], y: [3, 2, 0, 0, 2, 3] }}
        transition={{ duration, times, repeat: Infinity, delay }}
        className="rounded-full border border-black/[0.05] bg-white/80 px-2.5 py-0.5 text-[9.5px] font-semibold tracking-[-0.01em] text-[#3F3F46] backdrop-blur-sm"
      >
        {label}
      </motion.span>
    </div>
  );
}

function DiscoverProfileFloatCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 0.65,
        y: [6, -6, 6],
        rotate: [-0.8, 0.8, -0.8],
      }}
      transition={{
        opacity: { duration: 0.85, delay: 0.3 },
        y: { duration: 8.4, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 9.8, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="w-[224px] rounded-[24px] border border-black/[0.04] bg-white/72 p-3 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur-md"
    >
      <div className="relative h-[116px] w-full overflow-hidden rounded-[16px] bg-[#F0F1F4]">
        <img
          src={CREATOR_ONE}
          alt="Perfil en Punto"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover saturate-[0.75]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(11,11,13,0.58) 100%)',
          }}
        />
        <div className="absolute bottom-2 left-2.5 text-left text-white">
          <p className="font-display text-[13px] font-bold leading-tight">Javier, 18</p>
          <p className="text-[10.5px] text-white/80">Madrid</p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0 text-left">
          <p className="text-[11px] font-semibold text-[#18181B] truncate">Lumen · AI Planner</p>
          <p className="text-[10px] text-[#86868B] truncate">Flutter · React · AI</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#18181B] text-white"
        >
          <Send className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ActiveMatchesFeedCard() {
  const items = [
    { name: 'Lumen', role: 'Maya · Designer', img: CREATOR_TWO },
    { name: 'Relay', role: 'Mateo · Product', img: CREATOR_THREE },
    { name: 'Nook', role: 'Lucía · Frontend', img: CREATOR_FOUR },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 0.65,
        y: [-6, 6, -6],
        rotate: [0.8, -0.8, 0.8],
      }}
      transition={{
        opacity: { duration: 0.85, delay: 0.4 },
        y: { duration: 8.6, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 10.2, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="w-[234px] rounded-[24px] border border-black/[0.04] bg-white/72 p-3.5 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
        <span className="font-display text-[12px] font-bold text-[#18181B]">
          Proyectos activos
        </span>
        <PuntoSymbol size={18} />
      </div>

      <div className="mt-2.5 space-y-2.5">
        {items.map((item, idx) => (
          <motion.div
            key={item.name}
            animate={{ x: [0, 2.5, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.6,
            }}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white bg-[#F0F1F4]">
                <img
                  src={item.img}
                  alt={item.role}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover saturate-[0.75]"
                />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[11.5px] font-semibold leading-tight text-[#18181B] truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-[#86868B] truncate">{item.role}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#18181B] px-2.5 py-0.5 text-[9.5px] font-semibold text-white">
              Apply
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function AmbientBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden bg-[#F6F7F9] select-none"
      aria-hidden="true"
    >
      {/* Fondo limpio neutro fiel al blanco/gris suave de la app Punto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, #FFFFFF 0%, #F7F8FA 58%, #EFF1F4 100%)',
        }}
      />

      {/* Ondas muy sutiles en gris claro casi imperceptible en las esquinas */}
      <div
        className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full opacity-45"
        style={{
          background: 'radial-gradient(circle, rgba(226,229,235,0.55) 0%, rgba(246,247,249,0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full opacity-45"
        style={{
          background: 'radial-gradient(circle, rgba(226,229,235,0.55) 0%, rgba(246,247,249,0) 70%)',
        }}
      />

      {/* ESCENA MÓVIL (suave y discreta detrás de la lista de espera) */}
      <div className="absolute inset-0 sm:hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 92% 48% at 50% 48%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.68) 62%, rgba(255,255,255,0.08) 100%)',
          }}
        />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 390 844"
          fill="none"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M -20 110 C 120 65, 260 140, 410 95"
            stroke="#0B0B0D"
            strokeOpacity="0.06"
            strokeWidth="1.25"
            strokeDasharray="5 7"
            animate={{ strokeDashoffset: [0, -48] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M -20 740 C 140 695, 250 770, 410 725"
            stroke="#0B0B0D"
            strokeOpacity="0.06"
            strokeWidth="1.25"
            strokeDasharray="5 7"
            animate={{ strokeDashoffset: [0, 48] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }}
          />
        </svg>

        <div className="absolute -top-2 -left-4 scale-[0.82] opacity-35">
          <MobileBackgroundMatchCluster
            leftSrc={CREATOR_ONE}
            rightSrc={CREATOR_TWO}
            label="It's a Match"
            duration={7.2}
            delay={0}
          />
        </div>

        <motion.div
          animate={{ y: [-4, 4, -4], rotate: [-6, 6, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 right-5 opacity-25"
        >
          <PuntoSymbol size={28} />
        </motion.div>

        <div className="absolute -right-2 bottom-2 scale-[0.82] opacity-30">
          <MobileBackgroundMatchCluster
            leftSrc={CREATOR_THREE}
            rightSrc={CREATOR_FOUR}
            label="Nuevo Match"
            duration={7.8}
            delay={1.8}
          />
        </div>

        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-black/[0.04] bg-white/70 py-1 pr-2.5 pl-1 shadow-xs backdrop-blur-sm opacity-35"
        >
          <img
            src={CREATOR_ONE}
            alt=""
            referrerPolicy="no-referrer"
            className="h-5 w-5 rounded-full object-cover saturate-[0.75]"
          />
          <span className="text-[9.5px] font-medium text-[#3F3F46]">Lumen · Match</span>
        </motion.div>
      </div>

      {/* Arcos SVG muy sutiles en desktop */}
      <svg
        className="absolute inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M 210 230 C 420 150, 560 280, 720 430 C 880 580, 1060 680, 1240 590"
          stroke="#0B0B0D"
          strokeOpacity="0.05"
          strokeWidth="1.4"
          strokeDasharray="6 9"
          animate={{ strokeDashoffset: [0, -60] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 220 660 C 420 560, 560 490, 720 440 C 900 380, 1060 270, 1230 220"
          stroke="#0B0B0D"
          strokeOpacity="0.05"
          strokeWidth="1.4"
          strokeDasharray="6 9"
          animate={{ strokeDashoffset: [0, 60] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Escenas laterales discretas y centradas para monitores web */}
      <div className="mx-auto hidden h-full max-w-[1340px] lg:relative lg:block">
        <div className="absolute top-[7%] left-6 xl:left-10">
          <ConvergingMatchCard
            leftSrc={CREATOR_ONE}
            leftName="Javier"
            rightSrc={CREATOR_TWO}
            rightName="Maya"
            headline="It's a Match"
            subtitle="Quieren crear Lumen juntos"
            duration={7.8}
            delay={0}
          />
        </div>

        <div className="absolute bottom-[7%] left-8 xl:left-14">
          <DiscoverProfileFloatCard />
        </div>

        <div className="absolute top-[8%] right-6 xl:right-10">
          <ConvergingMatchCard
            leftSrc={CREATOR_THREE}
            leftName="Mateo"
            rightSrc={CREATOR_FOUR}
            rightName="Lucía"
            headline="It's a Match"
            subtitle="Conectando Producto & Diseño"
            duration={8.4}
            delay={2.6}
          />
        </div>

        <div className="absolute bottom-[7%] right-8 xl:right-14">
          <ActiveMatchesFeedCard />
        </div>

        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [-8, 8, -8] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[48%] left-[16%] opacity-25"
        >
          <PuntoSymbol size={40} />
        </motion.div>

        <motion.div
          animate={{ y: [8, -8, 8], rotate: [8, -8, 8] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[48%] right-[16%] opacity-25"
        >
          <PuntoSymbol size={42} />
        </motion.div>
      </div>

      {/* Vista compacta y sutil para tablets medianas */}
      <div className="hidden sm:block lg:hidden">
        <div className="absolute top-[10%] left-3 opacity-65 scale-75 origin-top-left">
          <ConvergingMatchCard
            leftSrc={CREATOR_ONE}
            leftName="Javier"
            rightSrc={CREATOR_TWO}
            rightName="Maya"
            headline="It's a Match"
            subtitle="Lumen"
            duration={7.8}
            delay={0}
          />
        </div>
        <div className="absolute right-3 bottom-[10%] opacity-65 scale-75 origin-bottom-right">
          <ConvergingMatchCard
            leftSrc={CREATOR_THREE}
            leftName="Mateo"
            rightSrc={CREATOR_FOUR}
            rightName="Lucía"
            headline="It's a Match"
            subtitle="Nook"
            duration={8.4}
            delay={2.2}
          />
        </div>
      </div>
    </div>
  );
}
