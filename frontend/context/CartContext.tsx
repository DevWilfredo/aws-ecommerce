'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { CartItem, CartSelection, Product } from '@/types/commerce';

type CartContextValue = {
  items: CartItem[];
  addProduct: (product: Product, selected?: CartSelection[]) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function defaultSelectionFromProduct(product: Product): CartSelection[] {
  return (product.optionGroups ?? [])
    .map((group) => {
      const first = group.optionValues?.[0];
      if (!first) return null;

      return {
        optionGroupId: group.id,
        optionGroupName: group.name,
        optionValueId: first.id,
        optionValueLabel: first.label,
        priceAdjustment: Number(first.priceAdjustment ?? 0),
      };
    })
    .filter((item): item is CartSelection => Boolean(item));
}

function imageFromProduct(product: Product): string {
  return (
    product.images?.find((img) => img.isFeatured)?.imageUrl ??
    product.images?.[0]?.imageUrl ??
    'https://placehold.co/600x400?text=No+Image'
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addProduct = (product: Product, selected?: CartSelection[]) => {
    const selectedOptions = selected?.length ? selected : defaultSelectionFromProduct(product);
    const optionsKey = selectedOptions.map((s) => `${s.optionGroupId}:${s.optionValueId}`).sort().join('|');

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.selectedOptions.map((s) => `${s.optionGroupId}:${s.optionValueId}`).sort().join('|') === optionsKey);

      if (existing) {
        return prev.map((item) => (item.lineId === existing.lineId ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [
        ...prev,
        {
          lineId: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          image: imageFromProduct(product),
          quantity: 1,
          basePrice: Number(product.price),
          selectedOptions,
        },
      ];
    });
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    setItems((prev) => prev.flatMap((item) => {
      if (item.lineId !== lineId) return [item];
      if (quantity <= 0) return [];
      return [{ ...item, quantity }];
    }));
  };

  const removeItem = (lineId: string) => setItems((prev) => prev.filter((item) => item.lineId !== lineId));

  const clearCart = () => setItems([]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => {
      const optionExtra = item.selectedOptions.reduce((acc, opt) => acc + Number(opt.priceAdjustment), 0);
      return sum + (item.basePrice + optionExtra) * item.quantity;
    }, 0);

    return {
      items,
      addProduct,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
