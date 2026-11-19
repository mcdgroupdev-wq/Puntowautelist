import { motion } from 'motion/react';
import { useId, useState } from 'react';
import { PUNTO_BRAND } from '../config/punto';

interface PuntoSymbolProps {
  size?: number;
  separated?: boolean;
  interactive?: boolean;
  tone?: 'dark' | 'light';
  className?: string;
}

// Forma exacta del logotipo original de Punto (simetría rotacional 180°)
const PUNTO_LEFT_HOOK_PATH =
  'M 19 79 C 16 89, 23 98, 34 98 C 44 98, 50 91, 50 82 C 50 75, 47 71, 48 64 C 49 58, 55 56, 61 53 C 66 51, 66 44, 60 41 C 53 38, 42 40, 36 48 C 31 55, 31 61, 26 67 C 22 71, 20 74, 19 79 Z';

export function PuntoSymbol({
  size = 40,
  separated = false,
  interactive = false,
  tone = 'dark',
  className = '',
}: PuntoSymbolProps) {
  const gradId = useId();
  const [hovered, setHovered] = useState(false);

  const isApart = separated || (interactive && hovered);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      onHoverStart={interactive ? () => setHovered(true) : undefined}
      onHoverEnd={interactive ? () => setHovered(false) : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
    >
      <defs>
        <radialGradient id={`${gradId}-dark-l`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#35353C" />
          <stop offset="48%" stopColor="#121216" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
        <radialGradient id={`${gradId}-dark-r`} cx="65%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#383840" />
          <stop offset="48%" stopColor="#121216" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
        <filter id={`${gradId}-shadow`} x="-22%" y="-22%" width="144%" height="144%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4.5"
            floodColor="#000000"
            floodOpacity={tone === 'dark' ? '0.16' : '0.08'}
          />
        </filter>
      </defs>

      <g filter={`url(#${gradId}-shadow)`}>
        {/* Pieza izquierda: bulbo inferior-izquierdo + gancho superior hacia la derecha */}
        <motion.g
          initial={false}
          animate={{
            x: isApart ? -8 : 0,
            y: isApart ? 7 : 0,
            rotate: isApart ? -6 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 20,
            mass: 0.85,
          }}
          style={{ originX: '42px', originY: '68px' }}
        >
          <path
            d={PUNTO_LEFT_HOOK_PATH}
            fill={tone === 'light' ? '#FFFFFF' : `url(#${gradId}-dark-l)`}
          />
        </motion.g>

        {/* Pieza derecha: gemela exacta rotada 180° alrededor del centro (60, 60) */}
        <motion.g
          initial={false}
          animate={{
            x: isApart ? 8 : 0,
            y: isApart ? -7 : 0,
            rotate: isApart ? 6 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 20,
            mass: 0.85,
          }}
          style={{ originX: '78px', originY: '52px' }}
        >
          <g transform="rotate(180 60 60)">
            <path
              d={PUNTO_LEFT_HOOK_PATH}
              fill={tone === 'light' ? '#FFFFFF' : `url(#${gradId}-dark-r)`}
            />
          </g>
        </motion.g>
      </g>
    </motion.svg>
  );
}

interface PuntoBrandMarkProps {
  symbolSize?: number;
  className?: string;
}

export function PuntoBrandMark({ symbolSize = 42, className = '' }: PuntoBrandMarkProps) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <PuntoSymbol size={symbolSize} interactive />
      <span className="font-display text-[22px] font-bold leading-none tracking-[-0.03em] text-[#0B0B0D] whitespace-nowrap shrink-0">
        {PUNTO_BRAND.name}
      </span>
    </div>
  );
}
