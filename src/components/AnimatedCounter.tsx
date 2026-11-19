import { animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number | null;
  configured: boolean;
  loading: boolean;
  className?: string;
}

export function AnimatedCounter({
  value,
  configured,
  loading,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(value ?? 0);
  const prevValueRef = useRef<number>(value ?? 0);

  useEffect(() => {
    if (value === null || !configured) {
      return;
    }

    const from = prevValueRef.current;
    const to = value;
    prevValueRef.current = to;

    if (from === to) {
      setDisplayValue(to);
      return;
    }

    const controls = animate(from, to, {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, configured]);

  if (loading) {
    return (
      <span
        className={`inline-block h-7 w-20 rounded-lg bg-[#E4E4E7]/70 animate-pulse align-middle ${className}`}
        aria-label="Cargando contador"
      />
    );
  }

  if (!configured || value === null) {
    return (
      <span className={`tabular-nums ${className}`} aria-label="Contador pendiente de conexión">
        —
      </span>
    );
  }

  return (
    <span className={`tabular-nums ${className}`}>
      {displayValue.toLocaleString('es-ES')}
    </span>
  );
}
