'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart as HeartIcon } from "lucide-react";
import { Button } from "../ui/button";

export interface Product {
  id: string | number;
  title: string;
  price: number | string;
  image?: string;
  href?: string;
  tag?: string;
  featured?: boolean;
}

interface ProductGridProps {
  products?: Product[];
  productsByTab?: Record<string, Product[]>;
  tabs?: string[];
  defaultTab?: string;
}

function shuffleProducts(list: Product[]) {
  const copy = [...list];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export default function ProductGrid({
  products = [],
  productsByTab: productsByTabFromProps,
  tabs = ["Novedades", "Más vendidos", "Productos destacados"],
  defaultTab,
}: ProductGridProps) {
  const normalizedTabs = useMemo(() => (tabs.length ? tabs : ["Productos"]), [tabs]);

  const defaultActive = normalizedTabs.includes(defaultTab ?? "")
    ? (defaultTab as string)
    : normalizedTabs[0];

  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  const [favorites, setFavorites] = useState<Record<string | number, boolean>>({});

  const safeActiveTab = normalizedTabs.includes(activeTab) ? activeTab : normalizedTabs[0];

  const productsByTab = useMemo(() => {
    if (productsByTabFromProps && Object.keys(productsByTabFromProps).length > 0) {
      return normalizedTabs.reduce<Record<string, Product[]>>((acc, tab) => {
        const tabItems = productsByTabFromProps[tab] ?? [];
        acc[tab] = Array.from(new Map(tabItems.map((product) => [product.id, product])).values());
        return acc;
      }, {});
    }

    const uniqueProducts = Array.from(new Map(products.map((product) => [product.id, product])).values());
    const shuffled = shuffleProducts(uniqueProducts);

    const map: Record<string, Product[]> = {};
    const tabCount = normalizedTabs.length;
    const baseCount = Math.floor(shuffled.length / tabCount);
    const remainder = shuffled.length % tabCount;

    let cursor = 0;

    normalizedTabs.forEach((tab, index) => {
      const size = baseCount + (index < remainder ? 1 : 0);
      map[tab] = shuffled.slice(cursor, cursor + size);
      cursor += size;
    });

    return map;
  }, [normalizedTabs, products, productsByTabFromProps]);

  const filtered = productsByTab[safeActiveTab] ?? [];

  const toggleFav = (id: string | number) => setFavorites((state) => ({ ...state, [id]: !state[id] }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 animate-fade-up sm:px-6 sm:py-12">
      <div className="mb-6 border-b">
        <nav className="flex gap-4 overflow-x-auto pb-1 sm:gap-6">
          {normalizedTabs.map((tab) => {
            const isActive = tab === safeActiveTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium ${
                  isActive ? "text-black border-b-2 border-black" : "text-gray-500"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      {!filtered.length ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
          No hay productos para esta pestaña ahora mismo.
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product, index) => (
          <article
            key={product.id}
            className="hover-lift relative flex flex-col overflow-hidden rounded-xl border bg-white p-4 shadow-sm animate-fade-up"
            style={{ animationDelay: `${Math.min(index, 11) * 55}ms` }}
          >
            <button
              aria-label="Alternar favorito"
              onClick={() => toggleFav(product.id)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white"
            >
              <HeartIcon
                className={`h-4 w-4 ${favorites[product.id] ? "text-red-500" : "text-gray-300"}`}
                fill={favorites[product.id] ? "currentColor" : "none"}
              />
            </button>

            <Link href={product.href ?? "#"} className="block">
              <div className="relative mb-4 h-44 w-full overflow-hidden rounded-md bg-gray-50 sm:h-48 md:h-44 lg:h-44">
                <Image
                  src={
                    product.image ??
                    "https://images.unsplash.com/photo-1606813902776-8b17f9e0b3b2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder"
                  }
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </Link>

            <div className="flex flex-1 flex-col">
              <h3 className="mb-2 line-clamp-2 text-sm text-gray-800">{product.title}</h3>
              <div className="mt-auto">
                <div className="mb-3 text-lg font-bold">${product.price}</div>
                <Button asChild variant="brand" className="w-full">
                  <Link href={product.href ?? "#"} className="block text-center">
                    Agregar al carrito
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
