import { animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number | null;
  loading: boolean;
  className?: string;
}

export function AnimatedCounter({
  value,
  loading,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(value ?? 0);
  const prevValueRef = useRef<number>(value ?? 0);

  useEffect(() => {
    if (value === null) {
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
  }, [value]);

  if (loading) {
    return (
      <span
        className={`inline-block h-7 w-20 rounded-lg bg-[#E4E4E7]/70 animate-pulse align-middle ${className}`}
        aria-label="Cargando contador"
      />
    );
  }

  if (value === null) {
    return (
      <span className={`tabular-nums ${className}`} aria-label="Contador">
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
