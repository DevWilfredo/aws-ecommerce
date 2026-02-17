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
import { useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/commerce';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ApiUnavailableState, CatalogPageLoader } from '@/components/ui/loaders';
import { clientApiFetch } from '@/services/client-api';
import { Categories } from '@/mocks/categories';

const brandGradientButtonClass =
  'rounded-md bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(2,132,199,0.25)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50';

type CategoryOption = {
  slug: string;
  name: string;
  href: string;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeCategorySlug(value: string) {
  return normalizeText(value).replace(/\s+/g, '-').trim();
}

const catalogCategoryOptions: CategoryOption[] = Categories.map((category) => {
  const slug = normalizeCategorySlug(category.slug ?? category.name);
  return {
    slug,
    name: category.name,
    href: category.href ?? `/catalog?category=${encodeURIComponent(slug)}`,
  };
});

const categoryNameBySlug = new Map(catalogCategoryOptions.map((category) => [category.slug, category.name]));

function categorySlugFromProduct(product: Product) {
  return normalizeCategorySlug(product.category?.slug?.trim() || product.category?.name?.trim() || '');
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export default function Catalog() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadSeed, setReloadSeed] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [brandQuery, setBrandQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { addProduct } = useCart();
  const productDetailCacheRef = useRef<Map<string, Product>>(new Map());

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        if (active) setLoadError(null);

        const data = await clientApiFetch<Product[]>('/products', {
          timeoutMs: 10000,
        });

        if (active) setProducts(data);
      } catch (error) {
        if (active) {
          setProducts([]);
          setLoadError(
            error instanceof Error
              ? error.message
              : 'No pudimos cargar el catálogo. Intenta nuevamente más tarde.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [reloadSeed]);

  useEffect(() => {
    const rawCategoryQuery = searchParams?.get('category');

    const nextCategories = rawCategoryQuery
      ? Array.from(
          new Set(
            rawCategoryQuery
              .split(',')
              .map((value) => normalizeCategorySlug(value))
              .filter((slug) => categoryNameBySlug.has(slug)),
          ),
        )
      : [];

    setSelectedCategories((prev) => (arraysEqual(prev, nextCategories) ? prev : nextCategories));
  }, [searchParams]);

  const enrichProductForCart = useCallback(async (product: Product): Promise<Product> => {
    if (product.optionGroups?.length) return product;

    const cached = productDetailCacheRef.current.get(product.id);
    if (cached?.optionGroups?.length) {
      return {
        ...product,
        optionGroups: cached.optionGroups,
      };
    }

    try {
      const detailed = await clientApiFetch<Product>(`/products/${encodeURIComponent(product.id)}`, {
        timeoutMs: 9000,
      });
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

  const brandStats = useMemo(() => {
    const counter = new Map<string, number>();

    for (const product of products) {
      const brandName = product.brand?.name?.trim();
      if (!brandName) continue;
      counter.set(brandName, (counter.get(brandName) ?? 0) + 1);
    }

    return Array.from(counter.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [products]);

  const visibleBrandStats = useMemo(() => {
    const normalizedQuery = normalizeText(brandQuery.trim());
    if (!normalizedQuery) return brandStats;

    return brandStats.filter((brand) =>
      normalizeText(brand.name).includes(normalizedQuery),
    );
  }, [brandQuery, brandStats]);

  const categoryStats = useMemo(() => {
    return catalogCategoryOptions.map((category) => ({
      ...category,
      count: products.filter((product) => categorySlugFromProduct(product) === category.slug).length,
    }));
  }, [products]);

  const categoryCountBySlug = useMemo(
    () => new Map(categoryStats.map((category) => [category.slug, category.count])),
    [categoryStats],
  );

  const filteredProducts = useMemo(() => {
    const selectedBrandSet = new Set(selectedBrands);
    const selectedCategorySet = new Set(selectedCategories);

    return products.filter((product) => {
      const brandName = product.brand?.name?.trim() || '';
      const productCategorySlug = categorySlugFromProduct(product);

      if (selectedBrandSet.size > 0 && !selectedBrandSet.has(brandName)) {
        return false;
      }

      if (selectedCategorySet.size > 0 && !selectedCategorySet.has(productCategorySlug)) {
        return false;
      }

      return true;
    });
  }, [products, selectedBrands, selectedCategories]);

  const unavailableSelectedCategoryNames = useMemo(
    () =>
      selectedCategories
        .filter((slug) => (categoryCountBySlug.get(slug) ?? 0) === 0)
        .map((slug) => categoryNameBySlug.get(slug) ?? slug),
    [categoryCountBySlug, selectedCategories],
  );

  const showingUnavailableCategoriesOnly =
    selectedCategories.length > 0 && unavailableSelectedCategoryNames.length === selectedCategories.length;

  const preferredPhoneCategory =
    categoryStats.find((category) => category.slug === 'telefonos') ||
    categoryStats.find((category) => category.count > 0);

  const categoryLabel = useMemo(() => {
    if (selectedCategories.length === 1) {
      return categoryNameBySlug.get(selectedCategories[0]) ?? 'Catálogo';
    }

    if (selectedCategories.length > 1) {
      return 'Resultados';
    }

    return products[0]?.category?.name?.trim() || products[0]?.category?.slug?.trim() || 'Catálogo';
  }, [products, selectedCategories]);

  const toggleSelection = (
    setter: Dispatch<SetStateAction<string[]>>,
    value: string,
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const clearAllFilters = () => {
    setBrandQuery('');
    setSelectedBrands([]);
    setSelectedCategories([]);
  };

  const activeFilterCount = selectedBrands.length + selectedCategories.length;

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
          <h3 className="text-base font-semibold text-slate-900">Categorías</h3>
          <ChevronUp className="h-4 w-4 text-slate-500" />
        </div>

        <div className="mt-3 max-h-48 overflow-auto pr-1">
          <ul className="space-y-2">
            {categoryStats.map((category) => (
              <li key={category.slug}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => toggleSelection(setSelectedCategories, category.slug)}
                    className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                  />
                  <span className="flex-1">{category.name}</span>
                  <span className="text-xs text-slate-400">{category.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Marca</h3>
          <ChevronUp className="h-4 w-4 text-slate-500" />
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar marca"
            value={brandQuery}
            onChange={(event) => setBrandQuery(event.target.value)}
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
            <p className="text-sm text-slate-500">No hay marcas para ese término.</p>
          )}
        </div>
      </section>
    </>
  );

  if (loading) return <CatalogPageLoader />;

  if (loadError) {
    return (
      <ApiUnavailableState
        className="max-w-7xl py-10"
        title="No pudimos cargar el catálogo"
        message={loadError}
        onRetry={() => {
          setLoading(true);
          setReloadSeed((prev) => prev + 1);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-fade-in sm:px-6">
      <nav aria-label="Ruta de navegación" className="mb-8 text-sm text-slate-500 animate-fade-up">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-slate-900">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/catalog" className="transition-colors hover:text-slate-900">
              Catálogo
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="font-medium text-slate-900">{categoryLabel}</li>
        </ol>
      </nav>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 animate-fade-up lg:hidden">
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
                <SheetTitle>Filtrar catálogo</SheetTitle>
              </SheetHeader>
              <div className="pt-2">{renderFiltersPanel()}</div>
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
        <aside className="hidden h-fit rounded-xl border border-slate-200 bg-white p-4 animate-fade-up lg:sticky lg:top-24 lg:block">
          {renderFiltersPanel()}
        </aside>

        <div className="animate-fade-up [animation-delay:100ms]">
          <div className="mb-6">
            <p className="text-lg text-slate-700">
              Productos seleccionados: <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {filteredProducts.map((product, index) => {
              const imageUrl =
                product.images?.find((img) => img.isFeatured)?.imageUrl ??
                product.images?.[0]?.imageUrl ??
                'https://placehold.co/600x400?text=Sin+imagen';

              return (
                <article
                  key={product.id}
                  className="hover-lift flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 11) * 55}ms` }}
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
            showingUnavailableCategoriesOnly ? (
              <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-5 text-sm text-sky-900">
                <p className="font-semibold">
                  Aún no tenemos productos en {unavailableSelectedCategoryNames.join(', ')}.
                </p>
                <p className="mt-2 text-sky-800">
                  Estamos ampliando el catálogo. Por ahora solo tenemos teléfonos disponibles.
                </p>
                {preferredPhoneCategory ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategories([preferredPhoneCategory.slug]);
                      setIsFiltersOpen(false);
                    }}
                    className="mt-3 inline-flex rounded-md bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.25)]"
                  >
                    Ver {preferredPhoneCategory.name}
                  </button>
                ) : null}
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                 No encontramos productos con esos filtros. Prueba limpiando alguno para ver más resultados.
               </p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
