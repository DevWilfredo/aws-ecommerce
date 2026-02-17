import { BrandsGrid, BrowseByCategory, Hero, ProductGrid } from '@/components/Home';
import type { Product as ProductCard } from '@/components/Home/ProductGrid';
import Reveal from '@/components/ui/reveal';
import { mockBrands } from '@/mocks/brands';
import { apiFetch } from '@/services/api';
import type { HomeProductsResponse, Product as CatalogProduct } from '@/types/commerce';

const HOME_TABS = ['Novedades', 'Más vendidos', 'Productos destacados'] as const;

function toProductCard(product: CatalogProduct): ProductCard {
  const featuredImage = product.images?.find((image) => image.isFeatured)?.imageUrl;
  const fallbackImage = product.images?.[0]?.imageUrl;

  return {
    id: product.id,
    title: product.name,
    price: Number(product.price).toFixed(2),
    image: featuredImage || fallbackImage || 'https://placehold.co/600x400?text=Sin+imagen',
    href: `/product/${product.id}`,
  };
}

async function getHomeProducts() {
  try {
    const response = await apiFetch<HomeProductsResponse>('/products/home?perTab=4', {
      timeoutMs: 10000,
      cache: 'no-store',
    });

    return {
      Novedades: response.tabs.newArrival.map(toProductCard),
      'Más vendidos': response.tabs.bestseller.map(toProductCard),
      'Productos destacados': response.tabs.featured.map(toProductCard),
    };
  } catch {
    return {
      Novedades: [] as ProductCard[],
      'Más vendidos': [] as ProductCard[],
      'Productos destacados': [] as ProductCard[],
    };
  }
}

const Home = async () => {
  const homeProductsByTab = await getHomeProducts();

  return (
    <>
      <Reveal amount={0.05}>
        <Hero />
      </Reveal>
      <Reveal delay={0.04}>
        <BrowseByCategory />
      </Reveal>
      <Reveal delay={0.08}>
        <ProductGrid
          productsByTab={homeProductsByTab}
          tabs={[...HOME_TABS]}
          defaultTab="Novedades"
        />
      </Reveal>
      <Reveal delay={0.12}>
        <BrandsGrid brands={mockBrands} />
      </Reveal>
    </>
  );
};

export default Home;
