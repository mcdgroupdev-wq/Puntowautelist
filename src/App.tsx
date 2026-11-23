import { AnimatePresence } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { ConfirmationView } from './components/ConfirmationView';
import { IntroSequence } from './components/IntroSequence';
import { ScreenShell } from './components/ScreenShell';
import { UnsubscribeView } from './components/UnsubscribeView';
import { WaitlistView } from './components/WaitlistView';
import { supabase } from './lib/supabase';

type AppScreen = 'intro' | 'waitlist' | 'confirmation' | 'unsubscribe';

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
  return 'intro';
}

export default function App() {
  const [unsubscribeToken, setUnsubscribeToken] = useState<string | null>(() =>
    getUnsubscribeTokenFromUrl(),
  );
  const [screen, setScreen] = useState<AppScreen>(() => getInitialScreen());

  const [count, setCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState<boolean>(true);

  const loadWaitlistCount = useCallback(async () => {
    if (!supabase) {
      setCount(null);
      setLoadingCount(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_waitlist_count');
      if (error) {
        console.error(error);
        setCount(null);
        return;
      }

      const parsed = typeof data === 'number' ? data : Number(data);
      setCount(Number.isFinite(parsed) ? parsed : null);
    } catch (err) {
      console.error(err);
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

  const handleRegistrationSuccess = useCallback(async () => {
    await loadWaitlistCount();
    setScreen('confirmation');
  }, [loadWaitlistCount]);

  const handleBackToWaitlist = useCallback(() => {
    if (typeof window !== 'undefined' && unsubscribeToken) {
      const url = new URL(window.location.href);
      url.searchParams.delete('unsubscribe');
      setUnsubscribeToken(null);
      window.history.replaceState({}, '', url.pathname + url.search);
    }
    loadWaitlistCount();
    setScreen('waitlist');
  }, [unsubscribeToken, loadWaitlistCount]);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#E9ECF2] text-[#0B0B0D]">
      <AmbientBackdrop />

      <ScreenShell>
        <AnimatePresence mode="wait">
          {screen === 'intro' && (
            <IntroSequence key="intro" onComplete={handleIntroComplete} />
          )}

          {screen === 'waitlist' && (
            <WaitlistView
              key="waitlist"
              count={count}
              loadingCount={loadingCount}
              onSuccess={handleRegistrationSuccess}
            />
          )}

          {screen === 'confirmation' && (
            <ConfirmationView
              key="confirmation"
              count={count}
              onBack={handleBackToWaitlist}
            />
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
