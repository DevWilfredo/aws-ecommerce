'use client';
import React from 'react';
import { Check, Heart, Lock, Truck, Zap } from 'lucide-react';
import ProductSpecs from './ProductSpecs';
import type { CartSelection, ProductOptionGroup } from '@/types/commerce';
import { cn } from '@/lib/utils';

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

type SwatchToken = {
  color: string;
  border: string;
  iconClass: string;
};

const swatchPalette: Array<{ matches: string[]; token: SwatchToken }> = [
  { matches: ['negro', 'black', 'grafito'], token: { color: '#0f172a', border: '#1e293b', iconClass: 'text-white' } },
  { matches: ['blanco', 'white'], token: { color: '#f8fafc', border: '#94a3b8', iconClass: 'text-slate-800' } },
  { matches: ['azul', 'blue'], token: { color: '#0284c7', border: '#0369a1', iconClass: 'text-white' } },
  { matches: ['rojo', 'red'], token: { color: '#dc2626', border: '#991b1b', iconClass: 'text-white' } },
  { matches: ['verde', 'green'], token: { color: '#16a34a', border: '#166534', iconClass: 'text-white' } },
  { matches: ['morado', 'purple', 'violeta'], token: { color: '#7c3aed', border: '#5b21b6', iconClass: 'text-white' } },
  { matches: ['dorado', 'gold'], token: { color: '#f59e0b', border: '#b45309', iconClass: 'text-slate-900' } },
  { matches: ['plata', 'silver'], token: { color: '#cbd5e1', border: '#64748b', iconClass: 'text-slate-800' } },
  { matches: ['naranja', 'orange'], token: { color: '#f97316', border: '#c2410c', iconClass: 'text-white' } },
  { matches: ['natural', 'titanio'], token: { color: '#9ca3af', border: '#4b5563', iconClass: 'text-white' } },
];

const fallbackSwatch: SwatchToken = {
  color: '#14b8a6',
  border: '#0f766e',
  iconClass: 'text-white',
};

const normalize = (value: string) => value.trim().toLowerCase();

const isColorGroup = (name: string) => {
  const normalizedName = normalize(name);
  return normalizedName.includes('color') || normalizedName.includes('colour');
};

const resolveSwatch = (label: string): SwatchToken => {
  const key = normalize(label);
  const matched = swatchPalette.find((entry) => entry.matches.some((match) => key.includes(match)));
  return matched?.token ?? fallbackSwatch;
};

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export default function ProductInfo({
  title,
  price,
  originalPrice,
  optionGroups,
  specs,
  description,
  inStock,
  selectedOptions,
  onSelectOption,
  onAddToCart,
}: Props) {
  const totalAdjustment = selectedOptions.reduce(
    (acc, option) => acc + Number(option.priceAdjustment || 0),
    0,
  );
  const finalPrice = price + totalAdjustment;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="mb-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{title}</h1>
        <div className="flex flex-wrap items-end gap-3">
          <span className="text-3xl font-bold text-slate-900 sm:text-4xl">{formatPrice(finalPrice)}</span>
          {totalAdjustment > 0 ? (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-800">
              +{formatPrice(totalAdjustment)} en opciones
            </span>
          ) : null}
          {originalPrice ? (
            <span className="text-2xl text-gray-400 line-through">${originalPrice}</span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-slate-500">Precio base: {formatPrice(price)}</p>
      </div>

      {optionGroups.map((group) => {
        const selected = selectedOptions.find((s) => s.optionGroupId === group.id)?.optionValueId;
        const selectedValue = group.optionValues.find((opt) => opt.id === selected);
        const selectedValueAdjustment = Number(selectedValue?.priceAdjustment ?? 0);
        const renderAsColor = isColorGroup(group.name);

        return (
          <div key={group.id}>
            <h3 className="mb-4 text-sm font-semibold">{group.name}</h3>
            <div className="flex flex-wrap gap-3">
              {group.optionValues.map((opt) => {
                const optionAdjustment = Number(opt.priceAdjustment || 0);
                const optionSelected = selected === opt.id;

                if (renderAsColor) {
                  const swatch = resolveSwatch(opt.label);

                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectOption(group, opt.id)}
                      className={cn(
                        'group inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm transition-all duration-200 ease-out active:scale-[0.98]',
                        optionSelected
                          ? 'border-cyan-500 bg-cyan-50 text-slate-900 shadow-[0_8px_20px_rgba(6,182,212,0.18)]'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/40',
                      )}
                    >
                      <span
                        className={cn(
                          'relative inline-flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200',
                          optionSelected ? 'scale-110' : 'group-hover:scale-105',
                        )}
                        style={{ backgroundColor: swatch.color, borderColor: swatch.border }}
                      >
                        <Check
                          className={cn(
                            'h-3.5 w-3.5 transition-opacity duration-150',
                            optionSelected ? `opacity-100 ${swatch.iconClass}` : 'opacity-0',
                          )}
                        />
                      </span>
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectOption(group, opt.id)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.98]',
                      optionSelected
                        ? 'border-transparent bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-[0_8px_20px_rgba(14,165,233,0.28)]'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-sky-400 hover:bg-sky-50',
                    )}
                  >
                    {opt.label}
                    {optionAdjustment > 0 ? (
                      <span className={cn('ml-1', optionSelected ? 'text-cyan-100' : 'text-slate-500')}>
                        (+{formatPrice(optionAdjustment)})
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {selectedValue ? (
              <p className="mt-3 text-xs text-slate-500">
                Seleccionado: <span className="font-semibold text-slate-700">{selectedValue.label}</span>
                {selectedValueAdjustment > 0 ? (
                  <span className="ml-1 rounded-full bg-cyan-50 px-2 py-0.5 font-semibold text-cyan-700">
                    +{formatPrice(selectedValueAdjustment)}
                  </span>
                ) : null}
              </p>
            ) : null}
          </div>
        );
      })}

      <ProductSpecs specs={specs} />
      <p className="text-sm leading-relaxed text-gray-700">{description}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button className="flex-1 rounded-lg border-2 border-black py-3.5 font-semibold text-black">
          <Heart className="mr-1 inline h-5 w-5" /> Wishlist
        </button>
        <button
          onClick={onAddToCart}
          disabled={!inStock}
          className="flex-1 rounded-lg bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.3)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-40"
        >
          Agregar al carrito
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <Truck className="mx-auto mb-2 h-6 w-6 text-gray-700" />
          <p className="text-xs">Envio</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <Lock className="mx-auto mb-2 h-6 w-6 text-gray-700" />
          <p className="text-xs">{inStock ? 'En stock' : 'Sin stock'}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <Zap className="mx-auto mb-2 h-6 w-6 text-gray-700" />
          <p className="text-xs">Garantia</p>
        </div>
      </div>
    </div>
  );
}
