'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  CircleCheckBig,
  CreditCard,
  Lock,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { clientApiFetch } from '@/services/client-api';
import type { ShippingForm } from '@/types/commerce';
import { toast } from 'sonner';
import { ApiUnavailableState, AuthCheckLoader } from '@/components/ui/loaders';

const initialShipping: ShippingForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  countryCode: 'ES',
};

const inputBaseClass =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const shippingFieldMeta = [
  {
    name: 'fullName',
    label: 'Nombre completo',
    placeholder: 'Wilfredo Soto',
    autoComplete: 'name',
    type: 'text',
    required: true,
    className: 'md:col-span-2',
  },
  {
    name: 'phone',
    label: 'Teléfono',
    placeholder: '+34 612 34 56 78',
    autoComplete: 'tel',
    type: 'tel',
    required: true,
    className: '',
  },
  {
    name: 'postalCode',
    label: 'Código postal',
    placeholder: '28013',
    autoComplete: 'postal-code',
    type: 'text',
    required: true,
    className: '',
  },
  {
    name: 'addressLine1',
    label: 'Dirección',
    placeholder: 'Calle Gran Via 15',
    autoComplete: 'address-line1',
    type: 'text',
    required: true,
    className: 'md:col-span-2',
  },
  {
    name: 'addressLine2',
    label: 'Apartamento / Piso (opcional)',
    placeholder: 'Piso 4, puerta B',
    autoComplete: 'address-line2',
    type: 'text',
    required: false,
    className: 'md:col-span-2',
  },
  {
    name: 'city',
    label: 'Ciudad',
    placeholder: 'Madrid',
    autoComplete: 'address-level2',
    type: 'text',
    required: true,
    className: '',
  },
  {
    name: 'state',
    label: 'Provincia / Estado',
    placeholder: 'Madrid',
    autoComplete: 'address-level1',
    type: 'text',
    required: true,
    className: '',
  },
] as const;

type ShippingFieldName = (typeof shippingFieldMeta)[number]['name'];
type CheckoutStep = 1 | 2;

const stepVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 28 : -28,
    filter: 'blur(2px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -28 : 28,
    filter: 'blur(2px)',
  }),
};

const requiredShippingKeys: Array<Exclude<keyof ShippingForm, 'addressLine2'>> = [
  'fullName',
  'phone',
  'addressLine1',
  'city',
  'state',
  'postalCode',
  'countryCode',
];

function isShippingReady(shipping: ShippingForm) {
  return requiredShippingKeys.every((key) => {
    const value = shipping[key];
    return typeof value === 'string' && value.trim().length > 0;
  });
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { isChecking, isAuthenticated, authError, retryAuthCheck } = useAuthGuard();
  const [shipping, setShipping] = useState<ShippingForm>(initialShipping);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<CheckoutStep>(1);
  const [stepDirection, setStepDirection] = useState(1);

  const lineItems = useMemo(
    () =>
      items.map((item) => {
        const optionExtra = item.selectedOptions.reduce(
          (acc, opt) => acc + Number(opt.priceAdjustment || 0),
          0,
        );
        const unitPrice = Number(item.basePrice) + optionExtra;
        return {
          ...item,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        };
      }),
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const hasItems = items.length > 0;

  const onFieldChange = (fieldName: ShippingFieldName, value: string) => {
    setError('');
    setShipping((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const onContinueToReview = () => {
    if (!hasItems) return;

    if (!isShippingReady(shipping)) {
      const message = 'Completa los campos obligatorios antes de continuar.';
      setError(message);
      toast.error(message);
      return;
    }

    setError('');
    setStepDirection(1);
    setStep(2);
  };

  const onBackToShipping = () => {
    setError('');
    setStepDirection(-1);
    setStep(1);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasItems) return;

    if (!isShippingReady(shipping)) {
      const message = 'Completa los campos obligatorios de envío.';
      setError(message);
      setStep(1);
      setStepDirection(-1);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        currency: 'EUR',
        shipping,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions.map((opt) => ({
            optionGroupId: opt.optionGroupId,
            optionValueId: opt.optionValueId,
          })),
        })),
      };

      const session = await clientApiFetch<{ checkoutUrl: string }>('/payments/checkout-session', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      clearCart();
      toast.success('Redirigiendo a Stripe...');
      window.location.href = session.checkoutUrl;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar el pago';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return <AuthCheckLoader className="md:px-6" />;
  }

  if (authError) {
    return (
        <ApiUnavailableState
          className="md:px-6"
          title="No pudimos validar tu sesión"
          message={authError}
          onRetry={retryAuthCheck}
        />
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative overflow-hidden bg-slate-50 animate-fade-in">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-12 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Pago seguro
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                Finaliza tu compra
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Flujo en 2 pasos para revisar dirección y confirmar el pago.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
              <Lock className="h-4 w-4 text-sky-600" />
              Datos cifrados y protegidos
            </div>
          </div>

          <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              Pago 100% seguro
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <Truck className="h-4 w-4 text-sky-600" />
              Envío rápido y trazable
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <CircleCheckBig className="h-4 w-4 text-sky-600" />
              Confirmación antes del pago
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up md:p-8"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <div
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    step === 1
                      ? 'border-sky-300 bg-sky-50 text-sky-700'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  1. Envío
                </div>
                <div className="h-1.5 rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#0b4f7d] to-[#0ea5e9]"
                    animate={{ width: step === 2 ? '100%' : '0%' }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <div
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    step === 2
                      ? 'border-sky-300 bg-sky-50 text-sky-700'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  2. Confirmar
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  {step === 1 ? 'Datos de envío' : 'Revisión final'}
                </h2>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                  Paso {step} de 2
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait" custom={stepDirection}>
              {step === 1 ? (
                <motion.section
                  key="shipping"
                  custom={stepDirection}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {shippingFieldMeta.map((field) => (
                    <label key={field.name} className={`block ${field.className}`}>
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        {field.label}
                      </span>
                      <input
                        type={field.type}
                        className={inputBaseClass}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                        value={shipping[field.name]}
                        onChange={(e) => onFieldChange(field.name, e.target.value)}
                        required={field.required}
                      />
                    </label>
                  ))}

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">País</span>
                    <select
                      className={inputBaseClass}
                      value={shipping.countryCode}
                      onChange={(e) => {
                        setError('');
                        setShipping((prev) => ({
                          ...prev,
                          countryCode: e.target.value,
                        }));
                      }}
                    >
                      <option value="ES">España</option>
                      <option value="US">Estados Unidos</option>
                      <option value="MX">México</option>
                      <option value="CO">Colombia</option>
                    </select>
                  </label>
                </motion.section>
              ) : (
                <motion.section
                  key="review"
                  custom={stepDirection}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Dirección de entrega
                    </p>
                    <div className="mt-2 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">{shipping.fullName}</p>
                      <p>{shipping.addressLine1}</p>
                      {shipping.addressLine2 ? <p>{shipping.addressLine2}</p> : null}
                      <p>
                        {shipping.city}, {shipping.state} {shipping.postalCode}
                      </p>
                      <p>{shipping.countryCode}</p>
                      <p className="mt-1 text-xs text-slate-500">Teléfono: {shipping.phone}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-sky-50 p-2 text-sky-700">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Método de pago</p>
                        <p className="mt-0.5 text-sm text-slate-600">
                          Pago de Stripe: serás redirigido para completar el pago de forma segura.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Todo listo. Revisa el resumen y confirma el pago.
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {!hasItems ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                Tu carrito está vacío. Agrega productos para poder pagar.
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={onBackToShipping}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Volver
                </button>
              ) : (
                <div />
              )}

              {step === 1 ? (
                <button
                  type="button"
                  disabled={!hasItems}
                  onClick={onContinueToReview}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-5 text-base font-semibold text-white shadow-[0_12px_28px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Continuar a confirmación
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !hasItems}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-5 text-base font-semibold text-white shadow-[0_12px_28px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {loading ? 'Redirigiendo a Stripe...' : 'Pagar con Stripe'}
                </button>
              )}
            </div>
          </form>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up lg:sticky lg:top-24" style={{ animationDelay: '120ms' }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Resumen de compra</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {totalItems} artículos
              </span>
            </div>

            {!hasItems ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No hay productos en el carrito.
                <Link
                  href="/catalog"
                  className="mt-3 inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Ir al catálogo
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {lineItems.map((item) => (
                  <article
                    key={item.lineId}
                    className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">Cantidad: {item.quantity}</p>
                        {item.selectedOptions.length ? (
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {item.selectedOptions.map((opt) => (
                              <li
                                key={`${item.lineId}-${opt.optionGroupId}-${opt.optionValueId}`}
                                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600"
                              >
                                {opt.optionGroupName}: {opt.optionValueLabel}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2 text-sm">
                      <span className="text-slate-500">
                        {moneyFormatter.format(item.unitPrice)} c/u
                      </span>
                      <span className="font-semibold text-slate-900">
                        {moneyFormatter.format(item.lineTotal)}
                      </span>
                    </div>
                  </article>
                ))}

                <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{moneyFormatter.format(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Envío</span>
                    <span className="font-medium text-emerald-600">Gratis</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                    <span>Total</span>
                    <span>{moneyFormatter.format(subtotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
