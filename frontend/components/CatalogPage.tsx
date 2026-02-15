'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/commerce';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addProduct } = useCart();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (!API) return;
        const res = await fetch(`${API}/products`, { cache: 'no-store' });
        const data = (await res.json()) as Product[];
        if (active) setProducts(data);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-10">Cargando catálogo...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">Catálogo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const imageUrl = product.images?.find((img) => img.isFeatured)?.imageUrl ?? product.images?.[0]?.imageUrl ?? 'https://placehold.co/600x400?text=No+Image';

          return (
            <article key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="relative w-full h-44 mb-4 bg-gray-100 rounded overflow-hidden">
                <Image src={imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-4" />
              </div>
              <Link href={`/product/${product.id}`} className="text-sm font-medium text-gray-800 hover:underline">{product.name}</Link>
              <div className="mt-auto flex items-center justify-between pt-4 gap-2">
                <div>
                  <div className="text-lg font-bold">${Number(product.price).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{product.brand?.name}</div>
                </div>
                <button onClick={() => addProduct(product)} className="bg-black text-white px-4 py-2 rounded text-sm">Añadir al carrito</button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
