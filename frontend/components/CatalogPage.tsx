'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { ChevronDown, ChevronRight, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import type { Product, ProductAttributeValue } from '@/types/commerce';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const brandGradientButtonClass =
  'rounded-md bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(2,132,199,0.25)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50';

type NumericRange = {
  id: string;
  label: string;
  match: (value: number) => boolean;
};

type ProductMeta = {
  id: string;
  brandName: string | null;
  storageLabel: string | null;
  batteryMah: number | null;
  screenInches: number | null;
  protectionClass: string | null;
  has5G: boolean | null;
};

const batteryRanges: NumericRange[] = [
  { id: 'battery-low', label: '< 4000 mAh', match: (value) => value < 4000 },
  { id: 'battery-mid', label: '4000 - 4999 mAh', match: (value) => value >= 4000 && value < 5000 },
  { id: 'battery-high', label: '5000+ mAh', match: (value) => value >= 5000 },
];

const screenRanges: NumericRange[] = [
  { id: 'screen-compact', label: '< 6.1 in', match: (value) => value < 6.1 },
  { id: 'screen-medium', label: '6.1 - 6.6 in', match: (value) => value >= 6.1 && value <= 6.6 },
  { id: 'screen-large', label: '> 6.6 in', match: (value) => value > 6.6 },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumeric(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function formatStorage(value: number, unit?: string | null) {
  const normalizedUnit = normalizeText((unit ?? 'GB').trim() || 'GB');

  if (normalizedUnit === 'gb' && value >= 1024 && value % 1024 === 0) {
    return `${value / 1024} TB`;
  }

  const finalUnit = unit?.trim() || 'GB';
  return `${formatNumeric(value)} ${finalUnit}`;
}

function findAttribute(
  product: Product,
  candidates: string[],
): ProductAttributeValue | undefined {
  const candidateSet = new Set(candidates.map(normalizeText));

  return product.attributeValues?.find((attributeValue) => {
    const attrName = attributeValue.attribute?.name;
    return attrName ? candidateSet.has(normalizeText(attrName)) : false;
  });
}

function buildProductMeta(product: Product): ProductMeta {
  const storageAttr = findAttribute(product, ['almacenamiento', 'storage', 'built-in memory']);
  const batteryAttr = findAttribute(product, ['bateria', 'battery', 'battery capacity']);
  const screenAttr = findAttribute(product, ['pantalla', 'screen diagonal', 'screen size']);
  const protectionAttr = findAttribute(product, ['resistencia agua', 'protection class', 'water resistance']);
  const fiveGAttr = findAttribute(product, ['5g']);

  const storageNumber = parseNumber(storageAttr?.valueNumber);
  const batteryMah = parseNumber(batteryAttr?.valueNumber);
  const screenInches = parseNumber(screenAttr?.valueNumber);

  const storageLabel =
    storageNumber !== null
      ? formatStorage(storageNumber, storageAttr?.attribute?.unit)
      : storageAttr?.valueText?.trim() || null;

  const protectionClass =
    protectionAttr?.valueText?.trim() ||
    (parseNumber(protectionAttr?.valueNumber) !== null
      ? `${formatNumeric(parseNumber(protectionAttr?.valueNumber) ?? 0)} ${protectionAttr?.attribute?.unit ?? ''}`.trim()
      : null);

  const has5G =
    typeof fiveGAttr?.valueBoolean === 'boolean'
      ? fiveGAttr.valueBoolean
      : fiveGAttr?.valueText
        ? normalizeText(fiveGAttr.valueText) === 'true' || normalizeText(fiveGAttr.valueText) === 'si'
        : null;

  return {
    id: product.id,
    brandName: product.brand?.name?.trim() || null,
    storageLabel,
    batteryMah,
    screenInches,
    protectionClass,
    has5G,
  };
}

function countStringOptions(values: Array<string | null>) {
  const counter = new Map<string, number>();

  for (const value of values) {
    if (!value) continue;
    counter.set(value, (counter.get(value) ?? 0) + 1);
  }

  return Array.from(counter.entries())
    .map(([label, count]) => ({ value: label, label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [brandQuery, setBrandQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [selectedBatteryRanges, setSelectedBatteryRanges] = useState<string[]>([]);
  const [selectedScreenRanges, setSelectedScreenRanges] = useState<string[]>([]);
  const [selectedProtectionClasses, setSelectedProtectionClasses] = useState<string[]>([]);
  const [selected5G, setSelected5G] = useState<string[]>([]);

  const { addProduct } = useCart();
  const productDetailCacheRef = useRef<Map<string, Product>>(new Map());

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

  const enrichProductForCart = useCallback(async (product: Product): Promise<Product> => {
    if (product.optionGroups?.length) return product;

    const cached = productDetailCacheRef.current.get(product.id);
    if (cached?.optionGroups?.length) {
      return {
        ...product,
        optionGroups: cached.optionGroups,
      };
    }

    if (!API) return product;

    try {
      const res = await fetch(`${API}/products/${encodeURIComponent(product.id)}`, {
        cache: 'no-store',
      });
      if (!res.ok) return product;

      const detailed = (await res.json()) as Product;
      productDetailCacheRef.current.set(product.id, detailed);

      return {
        ...product,
        optionGroups: detailed.optionGroups ?? [],
      };
    } catch {
      return product;
    }
  }, []);

  const handleAddToCart = useCallback(
    async (product: Product) => {
      const productWithOptions = await enrichProductForCart(product);
      addProduct(productWithOptions);
    },
    [addProduct, enrichProductForCart],
  );

  const productMetas = useMemo(() => products.map((product) => buildProductMeta(product)), [products]);

  const productMetaById = useMemo(
    () => new Map(productMetas.map((meta) => [meta.id, meta])),
    [productMetas],
  );

  const brandStats = useMemo(() => {
    const counter = new Map<string, number>();

    for (const meta of productMetas) {
      if (!meta.brandName) continue;
      counter.set(meta.brandName, (counter.get(meta.brandName) ?? 0) + 1);
    }

    return Array.from(counter.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [productMetas]);

  const visibleBrandStats = useMemo(() => {
    const normalizedQuery = brandQuery.trim().toLowerCase();
    if (!normalizedQuery) return brandStats;

    return brandStats.filter((brand) =>
      brand.name.toLowerCase().includes(normalizedQuery),
    );
  }, [brandStats, brandQuery]);

  const memoryOptions = useMemo(
    () => countStringOptions(productMetas.map((meta) => meta.storageLabel)),
    [productMetas],
  );

  const protectionOptions = useMemo(
    () => countStringOptions(productMetas.map((meta) => meta.protectionClass)),
    [productMetas],
  );

  const batteryOptions = useMemo(
    () =>
      batteryRanges
        .map((range) => ({
          value: range.id,
          label: range.label,
          count: productMetas.filter(
            (meta) => meta.batteryMah !== null && range.match(meta.batteryMah),
          ).length,
        }))
        .filter((option) => option.count > 0),
    [productMetas],
  );

  const screenOptions = useMemo(
    () =>
      screenRanges
        .map((range) => ({
          value: range.id,
          label: range.label,
          count: productMetas.filter(
            (meta) => meta.screenInches !== null && range.match(meta.screenInches),
          ).length,
        }))
        .filter((option) => option.count > 0),
    [productMetas],
  );

  const fiveGOptions = useMemo(() => {
    const yesCount = productMetas.filter((meta) => meta.has5G === true).length;
    const noCount = productMetas.filter((meta) => meta.has5G === false).length;

    const options: Array<{ value: string; label: string; count: number }> = [];
    if (yesCount > 0) options.push({ value: 'yes', label: 'Yes', count: yesCount });
    if (noCount > 0) options.push({ value: 'no', label: 'No', count: noCount });

    return options;
  }, [productMetas]);

  const filteredProducts = useMemo(() => {
    const selectedBrandSet = new Set(selectedBrands);
    const selectedMemorySet = new Set(selectedMemories);
    const selectedProtectionSet = new Set(selectedProtectionClasses);
    const selectedBatterySet = new Set(selectedBatteryRanges);
    const selectedScreenSet = new Set(selectedScreenRanges);
    const selected5GSet = new Set(selected5G);

    return products.filter((product) => {
      const meta = productMetaById.get(product.id);
      if (!meta) return false;

      if (selectedBrandSet.size > 0) {
        if (!meta.brandName || !selectedBrandSet.has(meta.brandName)) return false;
      }

      if (selectedMemorySet.size > 0) {
        if (!meta.storageLabel || !selectedMemorySet.has(meta.storageLabel)) return false;
      }

      if (selectedBatterySet.size > 0) {
        if (meta.batteryMah === null) return false;
        const hasMatchingRange = batteryRanges.some(
          (range) => selectedBatterySet.has(range.id) && range.match(meta.batteryMah as number),
        );
        if (!hasMatchingRange) return false;
      }

      if (selectedScreenSet.size > 0) {
        if (meta.screenInches === null) return false;
        const hasMatchingRange = screenRanges.some(
          (range) => selectedScreenSet.has(range.id) && range.match(meta.screenInches as number),
        );
        if (!hasMatchingRange) return false;
      }

      if (selectedProtectionSet.size > 0) {
        if (!meta.protectionClass || !selectedProtectionSet.has(meta.protectionClass)) return false;
      }

      if (selected5GSet.size > 0) {
        if (meta.has5G === null) return false;
        const fiveGValue = meta.has5G ? 'yes' : 'no';
        if (!selected5GSet.has(fiveGValue)) return false;
      }

      return true;
    });
  }, [
    products,
    productMetaById,
    selectedBrands,
    selectedMemories,
    selectedBatteryRanges,
    selectedScreenRanges,
    selectedProtectionClasses,
    selected5G,
  ]);

  const categoryLabel =
    products[0]?.category?.name?.trim() ||
    products[0]?.category?.slug?.trim() ||
    'Smartphones';

  const toggleSelection = (
    setter: Dispatch<SetStateAction<string[]>>,
    value: string,
  ) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const clearAllFilters = () => {
    setBrandQuery('');
    setSelectedBrands([]);
    setSelectedMemories([]);
    setSelectedBatteryRanges([]);
    setSelectedScreenRanges([]);
    setSelectedProtectionClasses([]);
    setSelected5G([]);
  };

  const activeFilterCount =
    selectedBrands.length +
    selectedMemories.length +
    selectedBatteryRanges.length +
    selectedScreenRanges.length +
    selectedProtectionClasses.length +
    selected5G.length;

  const renderFiltersPanel = () => (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-xs font-medium text-sky-700 transition hover:text-sky-800"
        >
          Limpiar todo
        </button>
      </div>

      <section className="border-b border-slate-200 pb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Brand</h3>
          <ChevronUp className="h-4 w-4 text-slate-500" />
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="mt-3 max-h-48 overflow-auto pr-1">
          {visibleBrandStats.length ? (
            <ul className="space-y-2">
              {visibleBrandStats.map((brand) => (
                <li key={brand.name}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => toggleSelection(setSelectedBrands, brand.name)}
                      className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                    />
                    <span className="flex-1">{brand.name}</span>
                    <span className="text-xs text-slate-400">{brand.count}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No brands available yet.</p>
          )}
        </div>
      </section>

      <section className="border-b border-slate-200 py-4">
        <div className="mb-2 flex items-center justify-between text-base font-medium text-slate-900">
          <span>Battery capacity</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
        {batteryOptions.length ? (
          <ul className="space-y-2">
            {batteryOptions.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedBatteryRanges.includes(option.value)}
                    onChange={() => toggleSelection(setSelectedBatteryRanges, option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                  />
                  <span className="flex-1">{option.label}</span>
                  <span className="text-xs text-slate-400">{option.count}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No battery data.</p>
        )}
      </section>

      <section className="border-b border-slate-200 py-4">
        <div className="mb-2 flex items-center justify-between text-base font-medium text-slate-900">
          <span>Screen diagonal</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
        {screenOptions.length ? (
          <ul className="space-y-2">
            {screenOptions.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedScreenRanges.includes(option.value)}
                    onChange={() => toggleSelection(setSelectedScreenRanges, option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                  />
                  <span className="flex-1">{option.label}</span>
                  <span className="text-xs text-slate-400">{option.count}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No screen data.</p>
        )}
      </section>

      <section className="border-b border-slate-200 py-4">
        <div className="mb-2 flex items-center justify-between text-base font-medium text-slate-900">
          <span>Protection class</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
        {protectionOptions.length ? (
          <ul className="space-y-2">
            {protectionOptions.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedProtectionClasses.includes(option.value)}
                    onChange={() => toggleSelection(setSelectedProtectionClasses, option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                  />
                  <span className="flex-1">{option.label}</span>
                  <span className="text-xs text-slate-400">{option.count}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No protection data.</p>
        )}
      </section>

      <section className="border-b border-slate-200 py-4">
        <div className="mb-2 flex items-center justify-between text-base font-medium text-slate-900">
          <span>Built-in memory</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
        {memoryOptions.length ? (
          <ul className="space-y-2">
            {memoryOptions.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedMemories.includes(option.value)}
                    onChange={() => toggleSelection(setSelectedMemories, option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                  />
                  <span className="flex-1">{option.label}</span>
                  <span className="text-xs text-slate-400">{option.count}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No memory data.</p>
        )}
      </section>

      <section className="py-4">
        <div className="mb-2 flex items-center justify-between text-base font-medium text-slate-900">
          <span>5G</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
        {fiveGOptions.length ? (
          <ul className="space-y-2">
            {fiveGOptions.map((option) => (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selected5G.includes(option.value)}
                    onChange={() => toggleSelection(setSelected5G, option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                  />
                  <span className="flex-1">{option.label}</span>
                  <span className="text-xs text-slate-400">{option.count}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No 5G data.</p>
        )}
      </section>
    </>
  );

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">Loading catalog...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-slate-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/catalog" className="transition-colors hover:text-slate-900">
              Catalog
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="font-medium text-slate-900">{categoryLabel}</li>
        </ol>
      </nav>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:hidden">
        <p className="text-sm text-slate-700">
          Filtros activos: <span className="font-semibold text-slate-900">{activeFilterCount}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearAllFilters}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Limpiar
          </button>
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtros
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto px-4 pb-5 pt-3">
              <SheetHeader className="px-0">
                <SheetTitle>Filtrar catalogo</SheetTitle>
              </SheetHeader>
              <div className="pt-2">
                {renderFiltersPanel()}
              </div>
              <div className="mt-4">
                <SheetClose asChild>
                  <button
                    type="button"
                    className="w-full rounded-md bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.25)]"
                  >
                    Ver {filteredProducts.length} productos
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden h-fit rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24 lg:block">
          {renderFiltersPanel()}
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg text-slate-700">
              Selected Products:{' '}
              <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
            </p>

            <select
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200 sm:w-auto"
              defaultValue="rating"
            >
              <option value="rating">By rating</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const imageUrl =
                product.images?.find((img) => img.isFeatured)?.imageUrl ??
                product.images?.[0]?.imageUrl ??
                'https://placehold.co/600x400?text=No+Image';

              return (
                <article
                  key={product.id}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300"
                >
                  <div className="relative mb-4 h-44 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-48">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-contain p-4"
                    />
                  </div>
                  <Link href={`/product/${product.id}`} className="text-sm font-medium text-gray-800 hover:underline">
                    {product.name}
                  </Link>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                    <div>
                      <div className="text-xl font-bold">${Number(product.price).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{product.brand?.name}</div>
                    </div>
                    <button
                      onClick={() => {
                        void handleAddToCart(product);
                      }}
                      className={brandGradientButtonClass}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {!filteredProducts.length ? (
            <p className="mt-6 text-sm text-slate-500">
              No products match the selected filters.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
