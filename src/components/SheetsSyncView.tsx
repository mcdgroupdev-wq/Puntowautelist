import { type User } from 'firebase/auth';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import {
  getAccessToken,
  googleSignIn,
  initAuth,
  logoutGoogle,
} from '../lib/googleAuth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { PuntoBrandMark } from './PuntoLogo';

const SELECTED_SPREADSHEET_KEY = 'punto_selected_spreadsheet_id';

interface WaitlistPreviewRow {
  index: number;
  id: string;
  email: string;
  registeredDate: string;
  registeredTime: string;
  consentLabel: string;
  notifiedStatus: string;
}

interface SocialPreviewRow {
  platform: 'tiktok' | 'instagram' | 'youtube';
  name: string;
  handle: string;
  url: string;
  status: string;
  clicks: number;
  lastClickedAt: string;
}

interface PreviewSummary {
  totalCount: number;
  consentCount: number;
  pendingLaunchCount: number;
  notifiedCount: number;
  totalSocialClicks: number;
  lastRegistration: string;
}

interface DriveSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

interface SyncSuccessResult {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  syncedEmails: number;
  syncedSocials: number;
  syncedAt: string;
}

type PendingConfirmationAction =
  | { type: 'create'; title: string }
  | { type: 'sync'; spreadsheetId: string; spreadsheetTitle: string };

interface SheetsSyncViewProps {
  onBack: () => void;
}

function loadSavedSpreadsheetId(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(SELECTED_SPREADSHEET_KEY) || '';
  } catch {
    return '';
  }
}

function saveSelectedSpreadsheetId(id: string): void {
  try {
    if (id) {
      window.localStorage.setItem(SELECTED_SPREADSHEET_KEY, id);
    } else {
      window.localStorage.removeItem(SELECTED_SPREADSHEET_KEY);
    }
  } catch {
    // Ignorar errores de almacenamiento
  }
}

export function SheetsSyncView({ onBack }: SheetsSyncViewProps) {
  const [needsAuth, setNeedsAuth] = useState<boolean>(() => !getAccessToken());
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncSuccessResult | null>(null);

  const [waitlistRows, setWaitlistRows] = useState<WaitlistPreviewRow[]>([]);
  const [socialRows, setSocialRows] = useState<SocialPreviewRow[]>([]);
  const [summary, setSummary] = useState<PreviewSummary | null>(null);
  const [socialTableReady, setSocialTableReady] = useState(true);

  const [spreadsheets, setSpreadsheets] = useState<DriveSpreadsheetFile[]>([]);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState<string>(() =>
    loadSavedSpreadsheetId(),
  );
  const [newSheetTitle, setNewSheetTitle] = useState('Punto — Lista de espera');
  const [activeTab, setActiveTab] = useState<'waitlist' | 'socials'>('waitlist');
  const [pendingAction, setPendingAction] = useState<PendingConfirmationAction | null>(null);

  const loadWorkspaceData = useCallback(async (token: string) => {
    setErrorMessage(null);
    setLoadingPreview(true);
    setLoadingFiles(true);

    try {
      const [previewRes, filesRes] = await Promise.all([
        fetch('/api/sheets/preview', {
          cache: 'no-store',
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/sheets/spreadsheets', {
          cache: 'no-store',
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const previewJson = (await previewRes.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        socialTableReady?: boolean;
        waitlist?: WaitlistPreviewRow[];
        socials?: SocialPreviewRow[];
        summary?: PreviewSummary;
      };

      if (previewRes.status === 401) {
        setNeedsAuth(true);
        setAccessToken(null);
        setErrorMessage(previewJson.message || 'Tu sesión de Google ha expirado. Inicia sesión de nuevo.');
        return;
      }

      if (!previewRes.ok || !previewJson.ok) {
        setErrorMessage(previewJson.message || 'No se pudieron cargar los datos de Supabase.');
        return;
      }

      setWaitlistRows(previewJson.waitlist ?? []);
      setSocialRows(previewJson.socials ?? []);
      setSummary(previewJson.summary ?? null);
      setSocialTableReady(previewJson.socialTableReady !== false);

      if (filesRes.ok) {
        const filesJson = (await filesRes.json().catch(() => ({}))) as {
          ok?: boolean;
          files?: DriveSpreadsheetFile[];
        };
        const files = filesJson.files ?? [];
        setSpreadsheets(files);

        setSelectedSpreadsheetId((prev) => {
          if (prev && files.some((f) => f.id === prev)) {
            return prev;
          }
          const puntoMatch = files.find((f) => f.name.toLowerCase().includes('punto'));
          const fallback = puntoMatch?.id || files[0]?.id || '';
          saveSelectedSpreadsheetId(fallback);
          return fallback;
        });
      }
    } catch {
      setErrorMessage('Error de conexión al consultar Supabase y Google Drive.');
    } finally {
      setLoadingPreview(false);
      setLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      (signedUser, token) => {
        setUser(signedUser);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (accessToken && !needsAuth) {
      loadWorkspaceData(accessToken);
    }
  }, [accessToken, needsAuth, loadWorkspaceData]);

  async function handleGoogleLogin() {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setAccessToken(result.accessToken);
      setNeedsAuth(false);
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'No pudimos completar el inicio de sesión con Google.';
      setErrorMessage(message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
    setWaitlistRows([]);
    setSocialRows([]);
    setSummary(null);
    setSyncResult(null);
    setPendingAction(null);
  }

  async function executeConfirmedAction() {
    if (!pendingAction || !accessToken || syncing) {
      return;
    }

    const actionToRun = pendingAction;
    setPendingAction(null);
    setSyncing(true);
    setErrorMessage(null);

    try {
      const endpoint = actionToRun.type === 'create' ? '/api/sheets/create' : '/api/sheets/sync';
      const body =
        actionToRun.type === 'create'
          ? { title: actionToRun.title }
          : { spreadsheetId: actionToRun.spreadsheetId };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const json = (await res.json().catch(() => ({}))) as Partial<SyncSuccessResult> & {
        ok?: boolean;
        message?: string;
      };

      if (res.status === 401) {
        setNeedsAuth(true);
        setAccessToken(null);
        setErrorMessage(json.message || 'Tu sesión de Google expiró. Vuelve a iniciar sesión.');
        return;
      }

      if (!res.ok || !json.ok || !json.spreadsheetId) {
        setErrorMessage(json.message || 'No pudimos completar la sincronización con Google Sheets.');
        return;
      }

      const result: SyncSuccessResult = {
        spreadsheetId: json.spreadsheetId,
        spreadsheetTitle: json.spreadsheetTitle || 'Punto — Lista de espera',
        spreadsheetUrl:
          json.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${json.spreadsheetId}/edit`,
        syncedEmails: json.syncedEmails ?? waitlistRows.length,
        syncedSocials: json.syncedSocials ?? socialRows.length,
        syncedAt: json.syncedAt || 'Ahora mismo',
      };

      setSyncResult(result);
      setSelectedSpreadsheetId(result.spreadsheetId);
      saveSelectedSpreadsheetId(result.spreadsheetId);

      if (actionToRun.type === 'create') {
        await loadWorkspaceData(accessToken);
      }
    } catch {
      setErrorMessage('Error de red al sincronizar con Google Sheets.');
    } finally {
      setSyncing(false);
    }
  }

  const selectedSpreadsheet = spreadsheets.find((f) => f.id === selectedSpreadsheetId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-1 flex-col justify-between gap-4"
    >
      {/* Cabecera */}
      <header className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/90 px-3.5 text-[12.5px] font-medium text-[#0B0B0D] transition-colors hover:bg-[#F3F4F6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Volver</span>
        </button>

        <PuntoBrandMark symbolSize={30} />

        {!needsAuth && user ? (
          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión de Google"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/90 px-3 text-[12px] font-medium text-[#52525B] transition-colors hover:bg-[#F3F4F6] hover:text-[#0B0B0D]"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        ) : (
          <div className="w-[68px]" aria-hidden="true" />
        )}
      </header>

      {/* Cuerpo */}
      <main className="my-auto flex flex-1 flex-col justify-center py-2">
        <div className="text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-[#F4F5F7] px-3 py-1 text-[11.5px] font-semibold text-[#18181B]">
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
            <span>Organizador Google Sheets · Supabase</span>
          </div>
          <h1 className="font-display text-[23px] font-bold leading-[1.15] tracking-[-0.03em] text-[#0B0B0D] sm:text-[26px]">
            Correos y redes en tu hoja de cálculo
          </h1>
          <p className="mx-auto mt-2 max-w-[46ch] text-[13px] leading-[1.5] text-[#52525B]">
            Organiza automáticamente en Google Sheets cada correo con su fecha y hora de registro
            junto con el seguimiento de TikTok, Instagram y YouTube desde Supabase.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12.5px] leading-snug font-medium text-[#B91C1C]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {needsAuth ? (
          <div className="mx-auto mt-5 w-full max-w-[360px] rounded-[26px] border border-black/[0.06] bg-white/95 p-5 text-center shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#ECEEF2] text-[#0B0B0D]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="font-display mt-3 text-[16px] font-bold text-[#0B0B0D]">
              Conecta tu cuenta administradora
            </h2>
            <p className="mt-1.5 text-[12.5px] leading-[1.48] text-[#52525B]">
              Inicia sesión con tu cuenta de Google para crear o actualizar la hoja de cálculo en tu
              Google Drive con los datos de Supabase.
            </p>
            <div className="mt-4 flex justify-center">
              <GoogleSignInButton
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                label={isLoggingIn ? 'Conectando...' : 'Sign in with Google'}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3.5">
            {/* Cuenta conectada + métricas */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-black/[0.06] bg-white/90 px-3 py-2.5 text-left">
                <p className="text-[11px] font-medium text-[#71717A]">Correos</p>
                <p className="font-display mt-0.5 text-[20px] font-bold tabular-nums text-[#0B0B0D]">
                  {summary ? summary.totalCount : '—'}
                </p>
              </div>
              <div className="rounded-2xl border border-black/[0.06] bg-white/90 px-3 py-2.5 text-left">
                <p className="text-[11px] font-medium text-[#71717A]">Con aviso</p>
                <p className="font-display mt-0.5 text-[20px] font-bold tabular-nums text-[#0B0B0D]">
                  {summary ? summary.consentCount : '—'}
                </p>
              </div>
              <div className="rounded-2xl border border-black/[0.06] bg-white/90 px-3 py-2.5 text-left">
                <p className="text-[11px] font-medium text-[#71717A]">Clics redes</p>
                <p className="font-display mt-0.5 text-[20px] font-bold tabular-nums text-[#0B0B0D]">
                  {summary ? summary.totalSocialClicks : '—'}
                </p>
              </div>
            </div>

            {/* Selector / creador de Google Sheet */}
            <div className="rounded-[22px] border border-black/[0.06] bg-white/95 p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] space-y-3">
              <div className="flex items-center justify-between gap-2 text-[12px]">
                <span className="font-medium text-[#52525B] truncate">
                  Conectado como <strong className="text-[#0B0B0D]">{user?.email}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => accessToken && loadWorkspaceData(accessToken)}
                  disabled={loadingPreview || loadingFiles}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F4F5F7] px-2.5 py-1 text-[11.5px] font-semibold text-[#0B0B0D] hover:bg-[#E5E7EB] disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${loadingPreview ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>Actualizar</span>
                </button>
              </div>

              {/* Seleccionar hoja existente */}
              {spreadsheets.length > 0 && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="sheet-select"
                    className="block text-[11.5px] font-semibold text-[#3F3F46]"
                  >
                    Hoja de cálculo existente en tu Drive
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      id="sheet-select"
                      value={selectedSpreadsheetId}
                      onChange={(e) => {
                        setSelectedSpreadsheetId(e.target.value);
                        saveSelectedSpreadsheetId(e.target.value);
                      }}
                      className="h-10 flex-1 rounded-full border border-black/[0.1] bg-[#FAFAFB] px-3.5 text-[13px] text-[#0B0B0D] focus:border-[#0B0B0D] focus:outline-none"
                    >
                      {spreadsheets.map((file) => (
                        <option key={file.id} value={file.id}>
                          {file.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={!selectedSpreadsheetId || syncing || loadingPreview}
                      onClick={() => {
                        if (!selectedSpreadsheetId) return;
                        setPendingAction({
                          type: 'sync',
                          spreadsheetId: selectedSpreadsheetId,
                          spreadsheetTitle: selectedSpreadsheet?.name || 'Hoja seleccionada',
                        });
                      }}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#0A0A0C] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1C1C20] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {syncing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>Sincronizar aquí</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Crear nueva hoja */}
              <div className="border-t border-black/[0.06] pt-2.5">
                <label
                  htmlFor="new-sheet-title"
                  className="block text-[11.5px] font-semibold text-[#3F3F46]"
                >
                  O crea una hoja nueva organizada (3 pestañas: Correos, Redes, Resumen)
                </label>
                <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="new-sheet-title"
                    type="text"
                    value={newSheetTitle}
                    onChange={(e) => setNewSheetTitle(e.target.value)}
                    placeholder="Punto — Lista de espera"
                    className="h-10 flex-1 rounded-full border border-black/[0.1] bg-[#FAFAFB] px-3.5 text-[13px] text-[#0B0B0D] focus:border-[#0B0B0D] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={syncing || loadingPreview}
                    onClick={() =>
                      setPendingAction({
                        type: 'create',
                        title: newSheetTitle.trim() || 'Punto — Lista de espera',
                      })
                    }
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#0A0A0C] bg-white px-4 text-[13px] font-semibold text-[#0A0A0C] transition-colors hover:bg-[#F4F5F7] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Crear Excel nuevo</span>
                  </button>
                </div>
              </div>

              {syncResult && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-3.5 py-2.5 text-[12px] text-[#166534]">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                    <span className="truncate font-medium">
                      Sincronizado ({syncResult.syncedEmails} correos · {syncResult.syncedSocials}{' '}
                      redes) · {syncResult.syncedAt}
                    </span>
                  </div>
                  <a
                    href={syncResult.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-3 py-1 text-[11.5px] font-semibold text-white hover:bg-[#15803D]"
                  >
                    <span>Abrir Google Sheet</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>

            {/* Vista previa de pestañas que se exportan a Excel / Sheets */}
            <div className="rounded-[22px] border border-black/[0.06] bg-white/95 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-2 pb-2.5">
                <div className="inline-flex rounded-full bg-[#F1F2F4] p-0.5 text-[12px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('waitlist')}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
                      activeTab === 'waitlist'
                        ? 'bg-[#0B0B0D] text-white'
                        : 'text-[#52525B] hover:text-[#0B0B0D]'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Lista de espera ({waitlistRows.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('socials')}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
                      activeTab === 'socials'
                        ? 'bg-[#0B0B0D] text-white'
                        : 'text-[#52525B] hover:text-[#0B0B0D]'
                    }`}
                  >
                    <span>TikTok · Insta · YT</span>
                  </button>
                </div>
              </div>

              {loadingPreview ? (
                <div className="flex items-center justify-center py-8 text-[13px] text-[#71717A]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Cargando datos de Supabase...</span>
                </div>
              ) : activeTab === 'waitlist' ? (
                <div className="max-h-[210px] overflow-auto rounded-xl border border-black/[0.06]">
                  {waitlistRows.length === 0 ? (
                    <p className="py-6 text-center text-[12.5px] text-[#71717A]">
                      Aún no hay correos registrados en Supabase.
                    </p>
                  ) : (
                    <table className="w-full border-collapse text-left text-[12px]">
                      <thead className="sticky top-0 bg-[#0B0B0D] text-white">
                        <tr>
                          <th className="px-2.5 py-2 font-semibold">#</th>
                          <th className="px-2.5 py-2 font-semibold">Correo</th>
                          <th className="px-2.5 py-2 font-semibold">Fecha</th>
                          <th className="px-2.5 py-2 font-semibold">Hora</th>
                          <th className="px-2.5 py-2 font-semibold">Aviso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.05]">
                        {waitlistRows.map((row) => (
                          <tr key={row.id} className="hover:bg-[#F9FAFB]">
                            <td className="px-2.5 py-2 font-medium tabular-nums text-[#71717A]">
                              {row.index}
                            </td>
                            <td className="px-2.5 py-2 font-medium text-[#0B0B0D]">{row.email}</td>
                            <td className="px-2.5 py-2 tabular-nums text-[#52525B]">
                              {row.registeredDate}
                            </td>
                            <td className="px-2.5 py-2 tabular-nums text-[#52525B]">
                              {row.registeredTime}
                            </td>
                            <td className="px-2.5 py-2 text-[#52525B]">{row.consentLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="overflow-auto rounded-xl border border-black/[0.06]">
                    <table className="w-full border-collapse text-left text-[12px]">
                      <thead className="bg-[#0B0B0D] text-white">
                        <tr>
                          <th className="px-2.5 py-2 font-semibold">Red</th>
                          <th className="px-2.5 py-2 font-semibold">Cuenta</th>
                          <th className="px-2.5 py-2 font-semibold">Clics</th>
                          <th className="px-2.5 py-2 font-semibold">Último clic</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/[0.05]">
                        {socialRows.map((s) => (
                          <tr key={s.platform} className="hover:bg-[#F9FAFB]">
                            <td className="px-2.5 py-2 font-semibold text-[#0B0B0D]">{s.name}</td>
                            <td className="px-2.5 py-2 text-[#52525B]">
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-black/20 hover:text-[#0B0B0D]"
                              >
                                {s.handle}
                              </a>
                            </td>
                            <td className="px-2.5 py-2 font-semibold tabular-nums text-[#0B0B0D]">
                              {s.clicks}
                            </td>
                            <td className="px-2.5 py-2 tabular-nums text-[#52525B]">
                              {s.lastClickedAt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!socialTableReady && (
                    <p className="text-[11px] leading-snug text-[#71717A]">
                      Nota: para guardar los clics de redes de forma permanente en Supabase entre
                      reinicios, ejecuta la migración <code>002_create_social_clicks.sql</code> en
                      tu SQL Editor.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-[11px] font-medium text-[#71717A]">
        Punto · Sincronización segura vía Google Sheets API
      </footer>

      {/* Modal obligatorio de confirmación antes de crear o sobrescribir datos en Google Sheets */}
      <AnimatePresence>
        {pendingAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheets-confirm-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="w-full max-w-[380px] rounded-[28px] border border-white bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECEEF2] text-[#0B0B0D]">
                <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3
                id="sheets-confirm-title"
                className="font-display mt-3 text-[18px] font-bold tracking-[-0.02em] text-[#0B0B0D]"
              >
                {pendingAction.type === 'create'
                  ? '¿Crear nueva hoja en Google Sheets?'
                  : '¿Actualizar esta hoja en Google Sheets?'}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.5] text-[#52525B]">
                {pendingAction.type === 'create' ? (
                  <>
                    Se creará el archivo <strong>«{pendingAction.title}»</strong> en tu Google Drive
                    y se rellenarán las pestañas <strong>Lista de espera</strong>,{' '}
                    <strong>Redes sociales</strong> y <strong>Resumen</strong>.
                  </>
                ) : (
                  <>
                    Se sobrescribirán las pestañas <strong>Lista de espera</strong>,{' '}
                    <strong>Redes sociales</strong> y <strong>Resumen</strong> dentro de{' '}
                    <strong>«{pendingAction.spreadsheetTitle}»</strong> con los datos actuales de
                    Supabase.
                  </>
                )}
              </p>
              <div className="mt-3 rounded-2xl bg-[#F6F7F9] px-3.5 py-2.5 text-[12px] text-[#3F3F46]">
                <div>• {waitlistRows.length} correos con fecha y hora de registro</div>
                <div>• {socialRows.length} redes oficiales (TikTok, Instagram, YouTube)</div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-black/[0.1] bg-white px-4 text-[13px] font-semibold text-[#52525B] hover:bg-[#F4F5F7] hover:text-[#0B0B0D]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={executeConfirmedAction}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#0A0A0C] px-4 text-[13px] font-semibold text-white hover:bg-[#1C1C20]"
                >
                  Confirmar y sincronizar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
