'use client';
import React from "react";
import { Heart, Truck, Lock, Zap } from "lucide-react";
import ProductSpecs from "./ProductSpecs";

type Props = {
  title: string;
  price: number;
  originalPrice?: number | null;
  colors: string[];
  storage: string[];
  specs: Array<{ label: string; value: string }>;
  description: string;
  inStock: boolean;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  selectedStorage: string;
  setSelectedStorage: (s: string) => void;
};

export default function ProductInfo({
  title,
  price,
  originalPrice,
  colors,
  storage,
  specs,
  description,
  inStock,
  selectedColor,
  setSelectedColor,
  selectedStorage,
  setSelectedStorage,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">${price}</span>
          {originalPrice ? (
            <span className="text-2xl text-gray-400 line-through">
              ${originalPrice}
            </span>
          ) : null}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Seleccionar color</h3>
        {colors.length ? (
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Sin opciones de color.</p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Capacidad</h3>
        {storage.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {storage.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStorage(s)}
                className={`py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all cursor-pointer ${
                  selectedStorage === s
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Sin opciones de capacidad.</p>
        )}
      </div>

      <ProductSpecs specs={specs} />

      <div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {description}
          <button className="text-blue-600 ml-2 font-medium hover:underline">
            mas...
          </button>
        </p>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 border-2 border-black py-4 rounded-lg font-semibold text-black hover:bg-gray-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2">
          <Heart className="w-5 h-5" /> Agregar a lista de deseos
        </button>
        <button className="flex-1 bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-900 transition-all cursor-pointer">
          Agregar al carrito
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Truck className="w-6 h-6 mx-auto mb-2 text-gray-700" />
          <p className="text-xs font-medium">Envio gratis</p>
          <p className="text-xs text-gray-600">1-2 dias</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Lock className="w-6 h-6 mx-auto mb-2 text-gray-700" />
          <p className="text-xs font-medium">
            {inStock ? "En stock" : "Sin stock"}
          </p>
          <p className="text-xs text-gray-600">
            {inStock ? "Disponible" : "Agotado"}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Zap className="w-6 h-6 mx-auto mb-2 text-gray-700" />
          <p className="text-xs font-medium">Garantia</p>
          <p className="text-xs text-gray-600">1 ano</p>
        </div>
      </div>
    </div>
  );
}
