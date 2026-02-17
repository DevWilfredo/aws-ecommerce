'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

function appendNext(url: string, nextPath: string | null) {
  if (!nextPath) return url;

  const [withoutHash, hash = ''] = url.split('#');
  const [path, query = ''] = withoutHash.split('?');
  const params = new URLSearchParams(query);
  params.set('next', nextPath);

  const finalQuery = params.toString();
  return `${path}${finalQuery ? `?${finalQuery}` : ''}${hash ? `#${hash}` : ''}`;
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get('next');

  const isApiConfigured = Boolean(API);

  const loginUrl = useMemo(
    () => appendNext(API ? `${API}/auth/login` : '/login', nextPath),
    [nextPath],
  );

  const googleUrl = useMemo(
    () => appendNext(API ? `${API}/auth/login?provider=Google` : '/login', nextPath),
    [nextPath],
  );

  const registerUrl = useMemo(
    () => appendNext(API ? `${API}/auth/register` : '/register', nextPath),
    [nextPath],
  );

  return (
    <div className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8 lg:min-h-[580px]">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-gradient-to-br from-sky-200/60 to-cyan-100/30 blur-2xl" />

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Acceso PrimeStore
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Entra y continúa donde te quedaste
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
            Tu cuenta te permite pagar más rápido, ver órdenes y guardar tu progreso de compra.
            Este acceso redirige de forma segura con Cognito.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Sesión protegida</p>
                <p className="text-xs text-slate-600">Cookies seguras y autenticación centralizada.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <LockKeyhole className="mt-0.5 h-4 w-4 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Pago privado</p>
                <p className="text-xs text-slate-600">Solo usuarios autenticados pueden pagar y ver órdenes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Experiencia continua</p>
                <p className="text-xs text-slate-600">Mantienes tu flujo incluso cuando vienes desde otra ruta.</p>
              </div>
            </div>
          </div>

          {nextPath ? (
            <p className="mt-6 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
              Después de iniciar sesión volverás automáticamente a la página protegida.
            </p>
          ) : null}
        </section>

        <section className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8 lg:min-h-[580px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Acceso rápido</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Iniciar sesión</h2>
            <p className="mt-2 text-sm text-slate-600">
              Usa tu cuenta PrimeStore o Google para continuar.
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <a
              href={loginUrl}
              className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5 ${
                !isApiConfigured ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Continuar con cuenta
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={googleUrl}
              className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${
                !isApiConfigured ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] font-bold text-[#ea4335]">
                G
              </span>
              Continuar con Google
            </a>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              ¿No tienes cuenta todavía?
            </p>
            <a href={registerUrl} className="mt-2 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800">
              Crear cuenta
            </a>
          </div>

          {!isApiConfigured ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              NEXT_PUBLIC_API_BASE_URL no está configurada. Define esa variable para habilitar el login remoto.
            </div>
          ) : null}

          <div className="mt-auto pt-8 text-xs leading-relaxed text-slate-500">
            Al continuar aceptas nuestras políticas de privacidad y términos de servicio.
          </div>
        </section>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
