'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, totalItems, subtotal, updateQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  const formatAdjustment = (value: number) =>
    value > 0 ? ` (+$${Number(value).toFixed(2)})` : '';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
      <SheetContent side="right" className="flex w-full flex-col px-8 py-4 sm:w-96">
        <SheetHeader>
          <SheetTitle>Mi Carrito</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Tu carrito esta vacio.</p>
          ) : (
            items.map((item) => (
              <div key={item.lineId} className="flex gap-3 border-b pb-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded object-cover"
                  unoptimized
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>

                  {item.selectedOptions.length ? (
                    <ul className="mt-1 space-y-1 text-xs text-gray-500">
                      {item.selectedOptions.map((opt) => (
                        <li key={`${item.lineId}-${opt.optionGroupId}-${opt.optionValueId}`}>
                          <span className="font-medium text-slate-600">{opt.optionGroupName}:</span>{' '}
                          {opt.optionValueLabel}
                          <span className="text-cyan-700">{formatAdjustment(opt.priceAdjustment)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Configuracion por defecto</p>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      className="rounded border px-2"
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      className="rounded border px-2"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.lineId)} className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <SheetClose asChild>
              <Button asChild variant="brand" className="w-full">
                <Link href="/cart">Ver carrito</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                asChild
                variant="brand"
                className="w-full bg-gradient-to-r from-[#0a3558] via-[#0c5f93] to-[#22b8f7]"
              >
                <Link href="/checkout">Ir a checkout</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
