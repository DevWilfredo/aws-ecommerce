'use client';
import React from 'react';
import { Heart, Truck, Lock, Zap } from 'lucide-react';
import ProductSpecs from './ProductSpecs';
import type { CartSelection, ProductOptionGroup } from '@/types/commerce';

type Props = {
  productId: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  optionGroups: ProductOptionGroup[];
  specs: Array<{ label: string; value: string }>;
  description: string;
  inStock: boolean;
  selectedOptions: CartSelection[];
  onSelectOption: (group: ProductOptionGroup, valueId: string) => void;
  onAddToCart: () => void;
};

export default function ProductInfo({ title, price, originalPrice, optionGroups, specs, description, inStock, selectedOptions, onSelectOption, onAddToCart }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">${price}</span>
          {originalPrice ? <span className="text-2xl text-gray-400 line-through">${originalPrice}</span> : null}
        </div>
      </div>

      {optionGroups.map((group) => {
        const selected = selectedOptions.find((s) => s.optionGroupId === group.id)?.optionValueId;
        return (
          <div key={group.id}>
            <h3 className="text-sm font-semibold mb-4">{group.name}</h3>
            <div className="flex flex-wrap gap-3">
              {group.optionValues.map((opt) => (
                <button key={opt.id} onClick={() => onSelectOption(group, opt.id)} className={`px-4 py-2 rounded-full border text-sm ${selected === opt.id ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
                  {opt.label} {Number(opt.priceAdjustment) > 0 ? `(+${Number(opt.priceAdjustment).toFixed(2)})` : ''}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <ProductSpecs specs={specs} />
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>

      <div className="flex gap-4">
        <button className="flex-1 border-2 border-black py-4 rounded-lg font-semibold text-black"><Heart className="w-5 h-5 inline mr-1" /> Wishlist</button>
        <button onClick={onAddToCart} disabled={!inStock} className="flex-1 bg-black text-white py-4 rounded-lg font-semibold disabled:opacity-40">Agregar al carrito</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg"><Truck className="w-6 h-6 mx-auto mb-2 text-gray-700" /><p className="text-xs">Envío</p></div>
        <div className="text-center p-4 bg-gray-50 rounded-lg"><Lock className="w-6 h-6 mx-auto mb-2 text-gray-700" /><p className="text-xs">{inStock ? 'En stock' : 'Sin stock'}</p></div>
        <div className="text-center p-4 bg-gray-50 rounded-lg"><Zap className="w-6 h-6 mx-auto mb-2 text-gray-700" /><p className="text-xs">Garantía</p></div>
      </div>
    </div>
  );
}
