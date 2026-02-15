'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProductGallery from '@/components/ProductDetail/ProductGallery';
import ProductInfo from '@/components/ProductDetail/ProductInfo';
import Reviews from '@/components/ProductDetail/Reviews';
import { useCart } from '@/context/CartContext';
import type { CartSelection, ProductOptionGroup } from '@/types/commerce';

type ApiProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  images: Array<{ imageUrl: string; position: number }>;
  attributeValues: Array<{
    attribute: { name: string; unit?: string | null; dataType: string };
    valueText: string | null;
    valueNumber: string | null;
    valueBoolean: boolean | null;
  }>;
  optionGroups: Array<{
    id: string;
    name: string;
    optionValues: Array<{ id: string; label: string; priceAdjustment: number }>;
  }>;
};

const placeholderImage = 'https://placehold.co/600x600?text=Producto';

const formatAttributeValue = (value: ApiProduct['attributeValues'][number]) => {
  if (value.valueText) return value.valueText;
  if (value.valueNumber) return value.attribute.unit ? `${value.valueNumber} ${value.attribute.unit}` : value.valueNumber;
  if (value.valueBoolean !== null) return value.valueBoolean ? 'Si' : 'No';
  return 'N/A';
};

export default function ProductDetailClient({ product }: { product: ApiProduct }) {
  const [mainImage, setMainImage] = useState(placeholderImage);
  const [selectedOptions, setSelectedOptions] = useState<CartSelection[]>([]);
  const { addProduct } = useCart();

  const images = useMemo(() => (product?.images?.length ? [...product.images].sort((a, b) => a.position - b.position).map((img) => img.imageUrl) : [placeholderImage]), [product]);

  const optionGroups: ProductOptionGroup[] = useMemo(
    () => (product.optionGroups ?? []).map((group) => ({ id: group.id, name: group.name, optionValues: group.optionValues.map((value) => ({ id: value.id, label: value.label, priceAdjustment: Number(value.priceAdjustment ?? 0) })) })),
    [product.optionGroups],
  );

  const specs = useMemo(() => (product?.attributeValues?.length ? product.attributeValues.map((item) => ({ label: item.attribute.name, value: formatAttributeValue(item) })) : []), [product]);

  useEffect(() => {
    if (images.length) setMainImage(images[0]);
  }, [images]);

  useEffect(() => {
    setSelectedOptions(
      optionGroups
        .map((group) => {
          const first = group.optionValues[0];
          if (!first) return null;
          return {
            optionGroupId: group.id,
            optionGroupName: group.name,
            optionValueId: first.id,
            optionValueLabel: first.label,
            priceAdjustment: Number(first.priceAdjustment),
          };
        })
        .filter((v): v is CartSelection => Boolean(v)),
    );
  }, [optionGroups]);

  const onSelectOption = (group: ProductOptionGroup, valueId: string) => {
    const value = group.optionValues.find((item) => item.id === valueId);
    if (!value) return;

    setSelectedOptions((prev) => {
      const rest = prev.filter((item) => item.optionGroupId !== group.id);
      return [...rest, {
        optionGroupId: group.id,
        optionGroupName: group.name,
        optionValueId: value.id,
        optionValueLabel: value.label,
        priceAdjustment: Number(value.priceAdjustment),
      }];
    });
  };

  const price = Number(product.price);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 border-b">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/">Inicio</Link><span>/</span><Link href="/catalog">Catalogo</Link><span>/</span><span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={images} mainImage={mainImage} onSelect={setMainImage} />
          <ProductInfo productId={product.id} title={product.name} price={price} originalPrice={null} optionGroups={optionGroups} specs={specs} description={product.description} inStock={product.stock > 0} selectedOptions={selectedOptions} onSelectOption={onSelectOption} onAddToCart={() => addProduct({ ...product, price, optionGroups } as any, selectedOptions)} />
        </div>
      </div>
      <Reviews reviews={[]} rating={4.8} total={125} />
    </div>
  );
}
