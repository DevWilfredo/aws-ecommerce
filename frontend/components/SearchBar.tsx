'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Loader2, SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { clientApiFetch } from '@/services/client-api';
import type { Product } from '@/types/commerce';

type SearchBarProps = {
  className?: string;
  onResultSelect?: () => void;
};

type ProductSearchItem = {
  id: string;
  name: string;
  brandName: string;
  categoryName: string;
  imageUrl: string;
  price: number;
  searchableText: string;
  normalizedName: string;
  normalizedBrand: string;
  normalizedCategory: string;
};

const PLACEHOLDER_IMAGE = 'https://placehold.co/160x160?text=Producto';
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

let cachedProductIndex: ProductSearchItem[] | null = null;
let productIndexRequest: Promise<ProductSearchItem[]> | null = null;

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function toSearchItem(product: Product): ProductSearchItem {
  const name = product.name?.trim() || 'Producto';
  const brandName = product.brand?.name?.trim() || '';
  const categoryName = product.category?.name?.trim() || '';
  const imageUrl =
    product.images?.find((img) => img.isFeatured)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    PLACEHOLDER_IMAGE;
  const price = Number(product.price) || 0;
  const normalizedName = normalizeText(name);
  const normalizedBrand = normalizeText(brandName);
  const normalizedCategory = normalizeText(categoryName);

  return {
    id: product.id,
    name,
    brandName,
    categoryName,
    imageUrl,
    price,
    searchableText: `${normalizedName} ${normalizedBrand} ${normalizedCategory}`.trim(),
    normalizedName,
    normalizedBrand,
    normalizedCategory,
  };
}

async function loadProductIndex() {
  if (cachedProductIndex) return cachedProductIndex;

  if (!productIndexRequest) {
    productIndexRequest = clientApiFetch<Product[]>('/products', {
      timeoutMs: 9000,
    })
      .then((products) => {
        cachedProductIndex = products.map(toSearchItem);
        return cachedProductIndex;
      })
      .catch((error: unknown) => {
        productIndexRequest = null;
        throw error;
      });
  }

  return productIndexRequest;
}

function useDebouncedValue(value: string, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [delayMs, value]);

  return debouncedValue;
}

export function SearchBar({ className, onResultSelect }: SearchBarProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingIndex, setIsLoadingIndex] = useState(false);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [indexItems, setIndexItems] = useState<ProductSearchItem[]>(() => cachedProductIndex ?? []);
  const debouncedQuery = useDebouncedValue(query, 260);
  const trimmedQuery = debouncedQuery.trim();

  const ensureIndexLoaded = useCallback(async () => {
    if (cachedProductIndex) {
      setIndexItems(cachedProductIndex);
      setIndexError(null);
      return;
    }

    if (isLoadingIndex) return;

    setIsLoadingIndex(true);
    setIndexError(null);

    try {
      const products = await loadProductIndex();
      setIndexItems(products);
    } catch (error) {
      setIndexError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar los resultados de búsqueda. Intenta nuevamente más tarde.',
      );
    } finally {
      setIsLoadingIndex(false);
    }
  }, [isLoadingIndex]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const topMatches = useMemo(() => {
    if (!trimmedQuery) return [];

    const normalizedQuery = normalizeText(trimmedQuery);
    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];

    const scored = indexItems
      .map((item) => {
        if (!tokens.every((token) => item.searchableText.includes(token))) {
          return null;
        }

        let score = 0;
        if (item.normalizedName.startsWith(normalizedQuery)) score += 10;
        else if (item.normalizedName.includes(normalizedQuery)) score += 6;

        if (item.normalizedBrand.startsWith(normalizedQuery)) score += 4;
        if (item.normalizedCategory.startsWith(normalizedQuery)) score += 3;
        if (item.normalizedCategory.includes(normalizedQuery)) score += 1;

        return { item, score };
      })
      .filter((entry): entry is { item: ProductSearchItem; score: number } => Boolean(entry))
      .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

    return scored.slice(0, 3).map((entry) => entry.item);
  }, [indexItems, trimmedQuery]);

  const shouldShowDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <div className="group flex h-11 items-center overflow-hidden rounded-md border border-slate-300 bg-white shadow-xs transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            setIsOpen(true);
            void ensureIndexLoaded();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false);
          }}
          placeholder="Buscar..."
          aria-label="Buscar productos"
          className="h-full w-full border-0 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          aria-label="Buscar productos"
          onClick={() => {
            setIsOpen(true);
            void ensureIndexLoaded();
          }}
          className="inline-flex h-full w-11 items-center justify-center border-l border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </div>

      {shouldShowDropdown ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-[90] rounded-xl border border-slate-200 bg-white p-2 shadow-[0_20px_48px_rgba(15,23,42,0.15)]">
          {isLoadingIndex ? (
            <div className="flex items-center gap-2 px-2 py-3 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
              Buscando productos...
            </div>
          ) : indexError ? (
            <div className="space-y-2 px-2 py-2">
              <p className="text-sm text-rose-600">{indexError}</p>
              <button
                type="button"
                onClick={() => void ensureIndexLoaded()}
                className="inline-flex h-9 items-center rounded-md border border-slate-300 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reintentar
              </button>
            </div>
          ) : topMatches.length ? (
            <ul className="space-y-1">
              {topMatches.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/product/${item.id}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                      onResultSelect?.();
                    }}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-slate-50"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-sky-700">
                        {item.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {item.brandName || 'Marca no disponible'}
                        {item.categoryName ? ` · ${item.categoryName}` : ''}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {priceFormatter.format(item.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2 py-3 text-sm text-slate-600">
              No encontramos coincidencias para &quot;{query.trim()}&quot;.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

