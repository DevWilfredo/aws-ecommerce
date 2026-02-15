'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Tu carrito</h1>
      {items.length === 0 ? (
        <div className="space-y-3"><p>No hay productos en el carrito.</p><Link className="underline" href="/catalog">Ir al catálogo</Link></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.lineId} className="border rounded-lg p-4 flex gap-4">
                <Image src={item.image} alt={item.name} width={90} height={90} className="rounded object-cover" unoptimized />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.selectedOptions.map((opt) => `${opt.optionGroupName}: ${opt.optionValueLabel}`).join(' · ')}</p>
                  <div className="mt-2 flex gap-2 items-center">
                    <button className="border px-2 rounded" onClick={() => updateQuantity(item.lineId, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="border px-2 rounded" onClick={() => updateQuantity(item.lineId, item.quantity + 1)}>+</button>
                    <button className="ml-4 text-red-500" onClick={() => removeItem(item.lineId)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border rounded-lg p-4 h-fit">
            <p className="font-semibold">Resumen</p>
            <div className="flex justify-between mt-3"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <Link href="/checkout" className="mt-4 block text-center bg-black text-white py-2 rounded">Ir a checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}
