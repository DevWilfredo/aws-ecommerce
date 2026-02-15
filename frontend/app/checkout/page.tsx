'use client';

import { FormEvent, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { clientApiFetch } from '@/services/client-api';
import type { ShippingForm } from '@/types/commerce';

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

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState<ShippingForm>(initialShipping);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
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
      window.location.href = session.checkoutUrl;
    } catch (err: any) {
      setError(err.message ?? 'No se pudo iniciar checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <form onSubmit={onSubmit} className="space-y-3 border p-4 rounded-lg">
        <h2 className="font-semibold text-xl">Shipping</h2>
        {Object.entries(shipping).map(([key, value]) => (
          <input key={key} className="w-full border rounded p-2" placeholder={key} value={value} onChange={(e) => setShipping((prev) => ({ ...prev, [key]: e.target.value }))} required={key !== 'addressLine2'} />
        ))}
        {error ? <p className="text-red-500 text-sm">{error}</p> : null}
        <button disabled={loading || !items.length} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Redirigiendo...' : 'Pagar con Stripe'}</button>
      </form>

      <div className="border p-4 rounded-lg h-fit">
        <h2 className="font-semibold text-xl mb-4">Resumen de compra</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.lineId} className="border-b pb-2">
              <p className="font-medium">{item.name} × {item.quantity}</p>
              <p className="text-xs text-gray-500">{item.selectedOptions.map((opt) => `${opt.optionGroupName}: ${opt.optionValueLabel}`).join(' · ')}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between font-semibold"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
      </div>
    </div>
  );
}
