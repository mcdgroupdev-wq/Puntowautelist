import { AnimatePresence } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { ConfirmationView } from './components/ConfirmationView';
import { IntroSequence } from './components/IntroSequence';
import { LegalNoticePage } from './components/LegalNoticePage';
import { NotFoundPage } from './components/NotFoundPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { ScreenShell } from './components/ScreenShell';
import { TermsPage } from './components/TermsPage';
import { UnsubscribeView } from './components/UnsubscribeView';
import { WaitlistView } from './components/WaitlistView';
import { supabase } from './lib/supabase';

type AppScreen = 'intro' | 'waitlist' | 'confirmation' | 'unsubscribe';

function normalizePathname(rawPath: string): string {
  if (!rawPath || rawPath === '/') {
    return '/';
  }
  const trimmed = rawPath.replace(/\/+$/, '');
  return trimmed || '/';
}

function getCurrentPathname(): string {
  if (typeof window === 'undefined') {
    return '/';
  }
  return normalizePathname(window.location.pathname);
}

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
  const [pathname, setPathname] = useState<string>(() => getCurrentPathname());
  const [unsubscribeToken, setUnsubscribeToken] = useState<string | null>(() =>
    getUnsubscribeTokenFromUrl(),
  );
  const [screen, setScreen] = useState<AppScreen>(() => getInitialScreen());

  const [count, setCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState<boolean>(true);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(getCurrentPathname());
      setUnsubscribeToken(getUnsubscribeTokenFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (pathname === '/privacidad') {
      document.title = 'Política de privacidad — Punto | MCD Group';
    } else if (pathname === '/terminos') {
      document.title = 'Términos y condiciones — Punto | MCD Group';
    } else if (pathname === '/aviso-legal') {
      document.title = 'Aviso legal — Punto | MCD Group';
    } else if (pathname !== '/') {
      document.title = 'Página no encontrada — Punto | MCD Group';
    } else {
      document.title = 'Punto — Lista de espera | MCD Group';
    }
  }, [pathname]);

  const navigate = useCallback((targetPath: string) => {
    const normalized = normalizePathname(targetPath);
    if (typeof window !== 'undefined' && normalizePathname(window.location.pathname) !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setPathname(normalized);
    if (normalized === '/' && screen === 'intro') {
      setScreen('waitlist');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [screen]);

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
    if (pathname !== '/') {
      return;
    }
    loadWaitlistCount();
  }, [pathname, loadWaitlistCount]);

  useEffect(() => {
    if (pathname !== '/' || (screen !== 'waitlist' && screen !== 'confirmation')) {
      return;
    }
    const handleFocus = () => {
      loadWaitlistCount();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [pathname, screen, loadWaitlistCount]);

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

  if (pathname === '/privacidad') {
    return <PrivacyPolicyPage onNavigate={navigate} />;
  }

  if (pathname === '/terminos') {
    return <TermsPage onNavigate={navigate} />;
  }

  if (pathname === '/aviso-legal') {
    return <LegalNoticePage onNavigate={navigate} />;
  }

  if (pathname !== '/') {
    return <NotFoundPage onNavigate={navigate} />;
  }

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
              onNavigate={navigate}
            />
          )}

          {screen === 'confirmation' && (
            <ConfirmationView
              key="confirmation"
              count={count}
              onBack={handleBackToWaitlist}
              onNavigate={navigate}
            />
          )}

          {screen === 'unsubscribe' && unsubscribeToken && (
            <UnsubscribeView
              key="unsubscribe"
              token={unsubscribeToken}
              onGoHome={handleBackToWaitlist}
              onNavigate={navigate}
            />
          )}
        </AnimatePresence>
      </ScreenShell>
    </div>
  );
}
