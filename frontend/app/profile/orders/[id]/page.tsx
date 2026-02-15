'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, MapPin, PackageSearch, ReceiptText } from 'lucide-react';
import { clientApiFetch } from '@/services/client-api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import type { Order, Product } from '@/types/commerce';
import { ApiUnavailableState, AuthCheckLoader } from '@/components/ui/loaders';

const placeholderImage = 'https://placehold.co/600x400?text=Producto';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

type StatusTheme = {
  label: string;
  className: string;
};

const statusThemeMap: Record<string, StatusTheme> = {
  PENDING: {
    label: 'Pendiente',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  PAID: {
    label: 'Pagado',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  COMPLETED: {
    label: 'Completada',
    className: 'border-teal-200 bg-teal-50 text-teal-700',
  },
  PROCESSING: {
    label: 'Procesando',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  CANCELLED: {
    label: 'Cancelada',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
  FAILED: {
    label: 'Fallida',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

function resolveStatus(statusRaw: string) {
  const status = statusRaw.toUpperCase();
  return (
    statusThemeMap[status] ?? {
      label: statusRaw,
      className: 'border-slate-200 bg-slate-50 text-slate-700',
    }
  );
}

function firstImageFromProduct(product: Product) {
  return (
    product.images?.find((img) => img.isFeatured)?.imageUrl ??
    product.images?.[0]?.imageUrl ??
    placeholderImage
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { isChecking, isAuthenticated, authError, retryAuthCheck } = useAuthGuard();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [itemImageByProductId, setItemImageByProductId] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated || !params?.id) return;

    let active = true;

    clientApiFetch<Order>(`/orders/me/${params.id}`)
      .then((result) => {
        if (!active) return;
        setOrder(result);
      })
      .catch((e) => {
        if (!active) return;
        setError(e.message);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, params?.id]);

  useEffect(() => {
    if (!order?.items?.length) return;

    let active = true;
    const uniqueProductIds = Array.from(
      new Set(order.items.map((item) => item.productId).filter(Boolean)),
    );

    Promise.allSettled(
      uniqueProductIds.map(async (productId) => {
        const product = await clientApiFetch<Product>(`/products/${encodeURIComponent(productId)}`);
        return {
          productId,
          imageUrl: firstImageFromProduct(product),
        };
      }),
    ).then((results) => {
      if (!active) return;

      const nextMap: Record<string, string> = {};
      for (const result of results) {
        if (result.status === 'fulfilled') {
          nextMap[result.value.productId] = result.value.imageUrl;
        }
      }

      setItemImageByProductId(nextMap);
    });

    return () => {
      active = false;
    };
  }, [order]);

  const totalItems = useMemo(
    () => order?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    [order],
  );

  const shippingCost = useMemo(() => {
    if (!order) return 0;
    const subtotal = Number(order.subtotal || 0);
    const total = Number(order.total || 0);
    const diff = total - subtotal;
    return diff > 0 ? diff : 0;
  }, [order]);

  if (isChecking) {
    return <AuthCheckLoader className="max-w-4xl py-10" />;
  }

  if (authError) {
    return (
      <ApiUnavailableState
        className="max-w-4xl py-10"
        title="No pudimos validar tu sesion"
        message={authError}
        onRetry={retryAuthCheck}
      />
    );
  }

  if (!isAuthenticated) return null;

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
        <Link
          href="/profile"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis ordenes
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="h-6 w-56 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-80 rounded bg-slate-200" />
          <div className="mt-6 h-40 w-full rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  const statusTheme = resolveStatus(order.status);

  return (
    <div className="relative overflow-hidden bg-slate-50 animate-fade-in">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link
          href="/profile"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis ordenes
        </Link>

        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Detalle de orden
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Orden #{order.id.slice(0, 8)}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-sky-700" />
                  {dateFormatter.format(new Date(order.createdAt))}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PackageSearch className="h-4 w-4 text-sky-700" />
                  {totalItems} item{totalItems === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTheme.className}`}>
                {statusTheme.label}
              </span>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {moneyFormatter.format(Number(order.total))}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-fade-up sm:p-6" style={{ animationDelay: '90ms' }}>
            <h2 className="text-lg font-semibold text-slate-900">Productos de la orden</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => {
                const imageUrl = itemImageByProductId[item.productId] ?? placeholderImage;

                return (
                  <article
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-white">
                        <Image
                          src={imageUrl}
                          alt={item.productName}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {item.productName}
                        </p>
                        <div className="mt-1 text-xs text-slate-500">
                          Cantidad: {item.quantity} · Unitario: {moneyFormatter.format(Number(item.unitPrice))}
                        </div>

                        {item.selectedOptions?.length ? (
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {item.selectedOptions.map((opt) => (
                              <li
                                key={`${item.id}-${opt.optionGroupId}-${opt.optionValueId}`}
                                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600"
                              >
                                {opt.optionGroupName}: {opt.optionValueLabel}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {moneyFormatter.format(Number(item.lineTotal))}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="space-y-4 animate-fade-up lg:sticky lg:top-24 lg:h-fit" style={{ animationDelay: '140ms' }}>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Envio
              </h3>
              <div className="mt-3 flex items-start gap-2 text-sm text-slate-700">
                <MapPin className="mt-0.5 h-4 w-4 text-sky-700" />
                <div>
                  <p className="font-semibold text-slate-900">{order.shippingFullName}</p>
                  <p>{order.shippingAddressLine1}</p>
                  <p>
                    {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                  </p>
                  <p>{order.shippingCountryCode}</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                <ReceiptText className="h-4 w-4 text-sky-700" />
                Resumen de pago
              </h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{moneyFormatter.format(Number(order.subtotal || 0))}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Envio</span>
                  <span>
                    {shippingCost > 0 ? moneyFormatter.format(shippingCost) : 'Gratis'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{moneyFormatter.format(Number(order.total || 0))}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
