'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CheckoutCancelPage() {
  useEffect(() => {
    toast.error('Pago cancelado por el usuario', { id: 'checkout-cancel' });
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Pago cancelado</h1>
          <p className="mt-3 text-sm text-slate-600">
            No se proceso ningun cargo. Puedes volver al checkout cuando quieras.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/checkout"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Volver a checkout
            </Link>
            <Link
              href="/cart"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Ver carrito
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
