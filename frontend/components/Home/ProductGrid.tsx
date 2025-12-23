'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  products: Product[];
  tabs?: string[];
  defaultTab?: string;
}

export default function ProductGrid({
  products,
  tabs = ["New Arrival", "Bestseller", "Featured Products"],
  defaultTab,
}: ProductGridProps) {
  const defaultActive = defaultTab ?? tabs[0];
  const [activeTab, setActiveTab] = useState<string>(defaultActive);
  const [favorites, setFavorites] = useState<Record<string | number, boolean>>({});

  const filtered = products.filter((p) => {
    if (activeTab === tabs[0]) return p.tag === tabs[0] || !p.tag; 
    return p.tag === activeTab || (activeTab === tabs[2] && p.featured);
  });

  const toggleFav = (id: string | number) =>
    setFavorites((s) => ({ ...s, [id]: !s[id] }));

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Tabs */}
      <div className="flex items-center justify-start gap-6 mb-6 border-b">
        <nav className="flex gap-6">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
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

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => (
          <article
            key={product.id}
            className="relative bg-white border rounded-lg p-4 shadow-sm flex flex-col overflow-hidden"
          >
            {/* Favorite icon */}
            <button
              aria-label="Toggle favorite"
              onClick={() => toggleFav(product.id)}
              className="absolute right-3 top-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white"
            >
              <HeartIcon
                className={`w-4 h-4 ${favorites[product.id] ? "text-red-500" : "text-gray-300"}`}
                fill={favorites[product.id] ? "currentColor" : "none"}
              />
            </button>

            {/* Image */}
            <Link href={product.href ?? "#"} className="block">
              <div className="relative w-full h-44 sm:h-48 md:h-44 lg:h-44 mb-4 rounded-md overflow-hidden bg-gray-50">
                <Image
                  src={product.image ?? "https://images.unsplash.com/photo-1606813902776-8b17f9e0b3b2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder"}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-sm text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
              <div className="mt-auto">
                <div className="text-lg font-bold mb-3">${product.price}</div>
                <Button asChild className="w-full">
                  <Link href={product.href ?? "#"} className="block text-center">
                    Agregar al Carrito
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