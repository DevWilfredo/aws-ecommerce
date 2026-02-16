'use client';

import Link from 'next/link';
import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, BadgeCheck, ShieldCheck, UserPlus } from 'lucide-react';

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

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get('next');
  const registerUrl = useMemo(
    () => appendNext(API ? `${API}/auth/register` : '/register', nextPath),
    [nextPath],
  );

  return (
    <div className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Crear cuenta</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Empieza en PrimeStore</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Registra tu cuenta para pagar mas rapido, gestionar ordenes y guardar tu historial.
          </p>

          <div className="mt-7 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <BadgeCheck className="mt-0.5 h-4 w-4 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Flujo seguro</p>
                <p className="text-xs text-slate-600">Registro centralizado por Cognito con cookies seguras.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Datos protegidos</p>
                <p className="text-xs text-slate-600">Tu informacion se mantiene cifrada y controlada.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Accion</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Crear cuenta ahora</h2>
          <p className="mt-2 text-sm text-slate-600">
            Te redirigiremos al proveedor de autenticacion para completar el registro.
          </p>

          <a
            href={registerUrl}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <UserPlus className="h-4 w-4" />
            Continuar con registro
            <ArrowRight className="h-4 w-4" />
          </a>

          <Link
            href="/login"
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Ya tengo cuenta
          </Link>

          <p className="mt-auto pt-8 text-xs text-slate-500">
            Al continuar aceptas terminos de uso y politicas de privacidad.
          </p>
        </section>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}
