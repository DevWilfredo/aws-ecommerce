'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Mi carrito</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Revisa tus productos</h1>
          <p className="mt-2 text-sm text-slate-600">
            Ajusta cantidades, verifica configuraciones y continúa al pago cuando estés listo.
          </p>
        </header>

        {items.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <ShoppingBag className="h-6 w-6 text-slate-600" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Tu carrito está vacío</h2>
            <p className="mt-2 text-sm text-slate-600">
              Explora el catálogo y agrega productos para iniciar tu compra.
            </p>
            <Link
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5"
              href="/catalog"
            >
              Ir al catálogo
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-4">
              {items.map((item) => {
                const optionExtra = item.selectedOptions.reduce(
                  (acc, opt) => acc + Number(opt.priceAdjustment || 0),
                  0,
                );
                const unitPrice = Number(item.basePrice) + optionExtra;
                const lineTotal = unitPrice * item.quantity;

                return (
                  <article
                    key={item.lineId}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="112px"
                          className="object-contain p-2"
                          unoptimized
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              Precio unitario: {moneyFormatter.format(unitPrice)}
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-slate-900">
                            {moneyFormatter.format(lineTotal)}
                          </p>
                        </div>

                        {item.selectedOptions.length ? (
                          <ul className="flex flex-wrap gap-1.5">
                            {item.selectedOptions.map((opt) => (
                              <li
                                key={`${item.lineId}-${opt.optionGroupId}-${opt.optionValueId}`}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
                              >
                                {opt.optionGroupName}: {opt.optionValueLabel}
                                {opt.priceAdjustment > 0 ? ` (+$${opt.priceAdjustment.toFixed(2)})` : ''}
                              </li>
                            ))}
                          </ul>
                        ) : (
                           <p className="text-xs text-slate-500">Configuración por defecto</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white">
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-10 text-center text-sm font-medium text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 transition hover:text-rose-700"
                            onClick={() => removeItem(item.lineId)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{moneyFormatter.format(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Envío</span>
                  <span className="font-medium text-emerald-600">Gratis</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{moneyFormatter.format(subtotal)}</span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Link
                  href="/checkout"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Ir al pago
                </Link>
                <Link
                  href="/catalog"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Seguir comprando
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
