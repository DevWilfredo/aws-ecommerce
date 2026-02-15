'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, totalItems, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="Carrito de compras" className="relative">
          <ShoppingCart className="size-6" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col px-8 py-4">
        <SheetHeader>
          <SheetTitle>Mi Carrito</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Tu carrito está vacío.</p>
          ) : (
            items.map((item) => (
              <div key={item.lineId} className="flex gap-3 border-b pb-3">
                <Image src={item.image} alt={item.name} width={64} height={64} className="rounded object-cover" unoptimized />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.selectedOptions.map((opt) => `${opt.optionGroupName}: ${opt.optionValueLabel}`).join(' · ')}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.lineId, item.quantity - 1)} className="border px-2 rounded">-</button>
                    <span className="text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="border px-2 rounded">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.lineId)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button asChild className="w-full"><Link href="/cart">Ver carrito</Link></Button>
            <Button asChild variant="outline" className="w-full"><Link href="/checkout">Ir a checkout</Link></Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
