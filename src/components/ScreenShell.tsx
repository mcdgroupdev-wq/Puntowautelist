import type { ReactNode } from 'react';

interface ScreenShellProps {
  children: ReactNode;
  wide?: boolean;
}

export function ScreenShell({ children, wide = false }: ScreenShellProps) {
  return (
    <div className="relative z-10 flex min-h-dvh w-full items-center justify-center sm:px-6 sm:py-8">
      <div
        className={`relative flex min-h-dvh w-full flex-col overflow-hidden bg-transparent sm:min-h-[730px] sm:rounded-[44px] sm:border sm:border-black/[0.05] sm:bg-white/90 sm:backdrop-blur-xl sm:shadow-[0_24px_70px_rgba(15,23,42,0.08),0_4px_16px_rgba(15,23,42,0.03),inset_0_1px_0_rgba(255,255,255,1)] ${
          wide ? 'sm:max-w-[600px]' : 'sm:max-w-[420px]'
        }`}
      >
        {/* Ondas muy sutiles en tarjetas de desktop/tablet */}
        <svg
          className="pointer-events-none absolute -top-4 -right-4 hidden h-56 w-56 opacity-45 select-none sm:block"
          viewBox="0 0 240 240"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="card-wave-tr" cx="65%" cy="32%" r="72%">
              <stop offset="0%" stopColor="#DDE1E8" stopOpacity="0.48" />
              <stop offset="58%" stopColor="#ECEEF3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M 75 -10 C 102 35, 90 92, 138 122 C 175 145, 215 130, 250 165 L 250 -10 Z"
            fill="url(#card-wave-tr)"
          />
        </svg>

        <svg
          className="pointer-events-none absolute -bottom-6 -left-6 hidden h-52 w-64 opacity-45 select-none sm:block"
          viewBox="0 0 280 220"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="card-wave-bl" cx="36%" cy="72%" r="75%">
              <stop offset="0%" stopColor="#D6DBE3" stopOpacity="0.5" />
              <stop offset="55%" stopColor="#EBEDF2" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M -10 95 C 45 78, 118 96, 175 145 C 215 178, 240 198, 275 230 L -10 230 Z"
            fill="url(#card-wave-bl)"
          />
        </svg>

        <div className="relative z-10 flex flex-1 flex-col justify-between px-6 py-7 sm:px-7 sm:py-9">
          {children}
        </div>
      </div>
    </div>
  );
}
