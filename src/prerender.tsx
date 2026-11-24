import { renderToStaticMarkup } from 'react-dom/server';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { ChildSafetyPage } from './components/ChildSafetyPage';
import { DeleteAccountPage } from './components/DeleteAccountPage';
import { LegalNoticePage } from './components/LegalNoticePage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { ScreenShell } from './components/ScreenShell';
import { TermsPage } from './components/TermsPage';
import { WaitlistView } from './components/WaitlistView';

export type PrerenderRoute =
  | '/'
  | '/privacidad'
  | '/terminos'
  | '/aviso-legal'
  | '/seguridad-infantil'
  | '/eliminar-cuenta';

const noop = () => {};

export function renderRoute(route: PrerenderRoute): string {
  if (route === '/privacidad') {
    return renderToStaticMarkup(<PrivacyPolicyPage onNavigate={noop} />);
  }
  if (route === '/terminos') {
    return renderToStaticMarkup(<TermsPage onNavigate={noop} />);
  }
  if (route === '/aviso-legal') {
    return renderToStaticMarkup(<LegalNoticePage onNavigate={noop} />);
  }
  if (route === '/seguridad-infantil') {
    return renderToStaticMarkup(<ChildSafetyPage onNavigate={noop} />);
  }
  if (route === '/eliminar-cuenta') {
    return renderToStaticMarkup(<DeleteAccountPage onNavigate={noop} />);
  }

  return renderToStaticMarkup(
    <div className="relative min-h-dvh overflow-x-hidden bg-[#E9ECF2] text-[#0B0B0D]">
      <AmbientBackdrop />
      <ScreenShell>
        <WaitlistView count={null} loadingCount={false} onSuccess={noop} onNavigate={noop} />
      </ScreenShell>
    </div>,
  );
}
