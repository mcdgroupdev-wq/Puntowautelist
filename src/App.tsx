import { AnimatePresence } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { ConfirmationView } from './components/ConfirmationView';
import { IntroSequence } from './components/IntroSequence';
import { ScreenShell } from './components/ScreenShell';
import { SheetsSyncView } from './components/SheetsSyncView';
import { UnsubscribeView } from './components/UnsubscribeView';
import { WaitlistView } from './components/WaitlistView';

type AppScreen = 'intro' | 'waitlist' | 'confirmation' | 'unsubscribe' | 'sheets';

function getUnsubscribeTokenFromUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const token = params.get('unsubscribe');
  return token && token.trim().length > 0 ? token.trim() : null;
}

function getInitialScreen(): AppScreen {
  if (getUnsubscribeTokenFromUrl()) {
    return 'unsubscribe';
  }
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('panel') === 'sheets') {
      return 'sheets';
    }
  }
  return 'intro';
}

export default function App() {
  const [unsubscribeToken, setUnsubscribeToken] = useState<string | null>(() =>
    getUnsubscribeTokenFromUrl(),
  );
  const [screen, setScreen] = useState<AppScreen>(() => getInitialScreen());

  const [count, setCount] = useState<number | null>(null);
  const [configured, setConfigured] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<boolean>(true);

  const loadWaitlistCount = useCallback(async () => {
    try {
      const res = await fetch('/api/waitlist/count', { cache: 'no-store' });
      const data = (await res.json().catch(() => ({}))) as {
        configured?: boolean;
        count?: number | null;
      };
      setConfigured(Boolean(data.configured));
      setCount(typeof data.count === 'number' ? data.count : null);
    } catch {
      setConfigured(false);
      setCount(null);
    } finally {
      setLoadingCount(false);
    }
  }, []);

  useEffect(() => {
    loadWaitlistCount();
  }, [loadWaitlistCount]);

  useEffect(() => {
    if (screen !== 'waitlist' && screen !== 'confirmation') {
      return;
    }
    const handleFocus = () => {
      loadWaitlistCount();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [screen, loadWaitlistCount]);

  const handleIntroComplete = useCallback(() => {
    setScreen((prev) => (prev === 'intro' ? 'waitlist' : prev));
  }, []);

  const handleRegistrationSuccess = useCallback(
    (updatedCount: number | null) => {
      if (typeof updatedCount === 'number') {
        setCount(updatedCount);
        setConfigured(true);
      } else {
        loadWaitlistCount();
      }
      setScreen('confirmation');
    },
    [loadWaitlistCount],
  );

  const handleBackToWaitlist = useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      let changed = false;
      if (unsubscribeToken) {
        url.searchParams.delete('unsubscribe');
        setUnsubscribeToken(null);
        changed = true;
      }
      if (url.searchParams.has('panel')) {
        url.searchParams.delete('panel');
        changed = true;
      }
      if (changed) {
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    }
    loadWaitlistCount();
    setScreen('waitlist');
  }, [unsubscribeToken, loadWaitlistCount]);

  const handleOpenSheets = useCallback(() => {
    setScreen('sheets');
  }, []);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#E9ECF2] text-[#0B0B0D]">
      <AmbientBackdrop />

      <ScreenShell wide={screen === 'sheets'}>
        <AnimatePresence mode="wait">
          {screen === 'intro' && (
            <IntroSequence key="intro" onComplete={handleIntroComplete} />
          )}

          {screen === 'waitlist' && (
            <WaitlistView
              key="waitlist"
              count={count}
              configured={configured}
              loadingCount={loadingCount}
              onSuccess={handleRegistrationSuccess}
              onOpenSheets={handleOpenSheets}
            />
          )}

          {screen === 'confirmation' && (
            <ConfirmationView
              key="confirmation"
              count={count}
              configured={configured}
              onBack={handleBackToWaitlist}
              onOpenSheets={handleOpenSheets}
            />
          )}

          {screen === 'sheets' && (
            <SheetsSyncView key="sheets" onBack={handleBackToWaitlist} />
          )}

          {screen === 'unsubscribe' && unsubscribeToken && (
            <UnsubscribeView
              key="unsubscribe"
              token={unsubscribeToken}
              onGoHome={handleBackToWaitlist}
            />
          )}
        </AnimatePresence>
      </ScreenShell>
    </div>
  );
}
