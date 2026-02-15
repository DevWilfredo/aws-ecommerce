'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Clock3, Package, Search, Wallet } from 'lucide-react';
import { clientApiFetch } from '@/services/client-api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import type { Order } from '@/types/commerce';

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

export default function ProfilePage() {
  const { isChecking, isAuthenticated } = useAuthGuard();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    clientApiFetch<Order[]>('/orders/me')
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingOrders(false));
  }, [isAuthenticated]);

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders],
  );

  const statusStats = useMemo(() => {
    const counter = new Map<string, number>();

    for (const order of sortedOrders) {
      const normalized = order.status.toUpperCase();
      counter.set(normalized, (counter.get(normalized) ?? 0) + 1);
    }

    return Array.from(counter.entries()).sort((a, b) => b[1] - a[1]);
  }, [sortedOrders]);

  const pendingCount = useMemo(
    () => sortedOrders.filter((order) => order.status.toUpperCase() === 'PENDING').length,
    [sortedOrders],
  );

  const totalSpent = useMemo(
    () => sortedOrders.reduce((acc, order) => acc + Number(order.total || 0), 0),
    [sortedOrders],
  );

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return sortedOrders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status.toUpperCase() !== statusFilter) return false;

      if (!normalizedSearch) return true;

      return (
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.status.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm, sortedOrders, statusFilter]);

  if (isChecking) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        Verificando sesion...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Account overview
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Mis ordenes</h1>
          <p className="mt-2 text-sm text-slate-600">
            Revisa el estado de tus compras y entra al detalle de cada pedido.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Package className="h-4 w-4 text-sky-700" />
                <span className="text-xs uppercase tracking-[0.16em]">Total ordenes</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{sortedOrders.length}</p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock3 className="h-4 w-4 text-amber-700" />
                <span className="text-xs uppercase tracking-[0.16em]">Pendientes</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{pendingCount}</p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Wallet className="h-4 w-4 text-emerald-700" />
                <span className="text-xs uppercase tracking-[0.16em]">Total gastado</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{moneyFormatter.format(totalSpent)}</p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Todas ({sortedOrders.length})
              </button>

              {statusStats.map(([status, count]) => {
                const theme = resolveStatus(status);
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      statusFilter === status
                        ? theme.className
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {theme.label} ({count})
                  </button>
                );
              })}
            </div>

            <label className="relative block w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID o estado"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {loadingOrders ? (
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-4 w-40 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-56 rounded bg-slate-200" />
                  <div className="mt-4 h-9 w-full rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length ? (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const statusTheme = resolveStatus(order.status);
                const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
                const previewItems = order.items.slice(0, 2);

                return (
                  <Link
                    key={order.id}
                    href={`/profile/orders/${order.id}`}
                    className="group block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:bg-sky-50/30"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Orden #{order.id.slice(0, 8)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {dateFormatter.format(new Date(order.createdAt))}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {itemCount} item{itemCount === 1 ? '' : 's'}
                        </p>
                      </div>

                      <div className="min-w-0 flex-1 md:px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {previewItems.map((item) => (
                            <span
                              key={item.id}
                              className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600"
                            >
                              {item.productName} x{item.quantity}
                            </span>
                          ))}
                          {order.items.length > 2 ? (
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
                              +{order.items.length - 2} mas
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTheme.className}`}>
                          {statusTheme.label}
                        </span>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {moneyFormatter.format(Number(order.total))}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-sky-700">
                          Ver detalle
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center">
              <p className="text-sm font-semibold text-slate-700">No encontramos ordenes con esos filtros</p>
              <p className="mt-1 text-xs text-slate-500">Prueba limpiando busqueda o cambiando el estado.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
