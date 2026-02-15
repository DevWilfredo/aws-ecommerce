'use client';

import { AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoaderProps = {
  className?: string;
};

type ApiUnavailableStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

export function AuthCheckLoader({ className }: LoaderProps) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16', className)}>
      <div
        role="status"
        aria-live="polite"
        aria-busy
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 px-5 py-6 shadow-sm"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.16),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(11,79,125,0.12),transparent_48%)]" />

        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] text-white shadow-[0_10px_26px_rgba(2,132,199,0.35)] animate-float-soft">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="space-y-2">
            <div className="h-3.5 w-36 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-2.5 w-56 rounded-full bg-slate-100 animate-pulse [animation-delay:120ms]" />
          </div>

          <div className="ml-auto hidden items-center gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-bounce [animation-delay:130ms]" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:260ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogPageLoader({ className }: LoaderProps) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 py-10 sm:px-6', className)}>
      <div className="mb-8 h-4 w-64 rounded-full bg-slate-200 animate-pulse" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-xl border border-slate-200 bg-white p-4 lg:block">
          <div className="h-6 w-28 rounded-md bg-slate-200 animate-pulse" />
          <div className="mt-4 h-10 w-full rounded-md bg-slate-100 animate-pulse" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`filter-loader-${index}`}
                className="h-3.5 rounded-full bg-slate-100 animate-pulse"
                style={{ width: `${75 + (index % 3) * 10}%`, animationDelay: `${index * 65}ms` }}
              />
            ))}
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-7 w-56 rounded-md bg-slate-200 animate-pulse" />
            <div className="h-10 w-full rounded-md bg-slate-100 animate-pulse sm:w-44" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <article
                key={`catalog-card-loader-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-fade-up"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="h-44 rounded-lg bg-slate-100 animate-pulse sm:h-48" />
                <div className="mt-4 h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
                <div className="mt-3 h-6 w-1/3 rounded bg-slate-200 animate-pulse" />
                <div className="mt-4 h-10 w-full rounded-md bg-slate-900/10 animate-pulse" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApiUnavailableState({
  title = 'No pudimos cargar esta seccion',
  message = 'Parece que el servidor no responde en este momento. Intenta nuevamente mas tarde.',
  retryLabel = 'Reintentar',
  onRetry,
  className,
}: ApiUnavailableStateProps) {
  return (
    <div className={cn('mx-auto max-w-4xl px-4 py-12 sm:px-6', className)}>
      <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(251,191,36,0.18),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(14,165,233,0.16),transparent_48%)]" />

        <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{message}</p>
          </div>

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="sm:ml-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" />
              {retryLabel}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
