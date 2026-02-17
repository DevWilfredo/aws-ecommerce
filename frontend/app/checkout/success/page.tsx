'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ReceiptText, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { clientApiFetch } from '@/services/client-api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import type { Order } from '@/types/commerce';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ApiUnavailableState, AuthCheckLoader } from '@/components/ui/loaders';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function CheckoutSuccessPageContent() {
  const searchParams = useSearchParams();
  const { isChecking, isAuthenticated, authError, retryAuthCheck } = useAuthGuard();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const orderId = searchParams?.get('orderId') ?? null;
  const sessionId = searchParams?.get('session_id') ?? null;

  useEffect(() => {
    toast.success('Pago completado correctamente', { id: 'checkout-success' });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !orderId) return;

    let active = true;

    async function loadOrder() {
      if (sessionId) {
        try {
          await clientApiFetch('/payments/confirm-session', {
            method: 'POST',
            body: JSON.stringify({ orderId, sessionId }),
          });
        } catch {
        }
      }

      try {
        const result = await clientApiFetch<Order>(`/orders/me/${orderId}`);
        if (!active) return;
        setOrder(result);
      } catch (e: unknown) {
        if (!active) return;
        const message = e instanceof Error ? e.message : 'No se pudo cargar la orden';
        setError(message);
      }
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [isAuthenticated, orderId, sessionId]);

  const totalItems = useMemo(
    () => order?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    [order],
  );

  const isLoadingOrder = Boolean(orderId) && !order && !error;

  if (isChecking) {
    return <AuthCheckLoader className="max-w-5xl" />;
  }

  if (authError) {
    return (
        <ApiUnavailableState
          className="max-w-5xl"
          title="No pudimos validar tu sesión"
          message={authError}
          onRetry={retryAuthCheck}
        />
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative overflow-hidden bg-slate-50 animate-fade-in">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm animate-fade-up sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Pago confirmado
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Tu compra fue completada
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Recibimos tu pago correctamente. Ya puedes revisar el detalle de la orden y su estado.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl">

            <DotLottieReact
              src="/payment.lottie"
              loop
              autoplay
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <p className="inline-flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Transacción exitosa
              </p>
              <p className="mt-1 text-xs">Stripe confirmó el pago sin incidencias.</p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">
              <p className="inline-flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Orden protegida
              </p>
              <p className="mt-1 text-xs">Tu historial queda registrado en tu perfil.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm animate-fade-up sm:p-8" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xl font-semibold text-slate-900">Resumen de la compra</h2>

          {error ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {isLoadingOrder ? (
            <div className="mt-5 animate-pulse space-y-3">
              <div className="h-4 w-44 rounded bg-slate-200" />
              <div className="h-4 w-56 rounded bg-slate-200" />
              <div className="h-24 w-full rounded-xl bg-slate-200" />
            </div>
          ) : order ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Orden</span>
                  <span className="font-semibold text-slate-900">#{order.id.slice(0, 8)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-slate-500">Fecha</span>
                  <span className="text-slate-700">{dateFormatter.format(new Date(order.createdAt))}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-slate-500">Artículos</span>
                  <span className="text-slate-700">{totalItems}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 border-t border-slate-200 pt-2">
                  <span className="text-slate-700">Total</span>
                  <span className="text-base font-semibold text-slate-900">
                    {moneyFormatter.format(Number(order.total || 0))}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white">
                {order.items.map((item) => (
                  <div key={item.id} className="border-b border-slate-200 px-4 py-3 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.productName}</p>
                        <p className="mt-0.5 text-xs text-slate-500">Cantidad: {item.quantity}</p>
                        {item.selectedOptions?.length ? (
                          <p className="mt-1 text-xs text-slate-500">
                            {item.selectedOptions
                              .map((opt) => `${opt.optionGroupName}: ${opt.optionValueLabel}`)
                              .join(' · ')}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {moneyFormatter.format(Number(item.lineTotal || 0))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              No pudimos cargar la orden en este momento.
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={order ? `/profile/orders/${order.id}` : '/profile'}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <ReceiptText className="h-4 w-4" />
              Ver orden
            </Link>

            <Link
              href="/catalog"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Seguir comprando
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessPageContent />
    </Suspense>
  );
}
