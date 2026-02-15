'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ProductGallery from '@/components/ProductDetail/ProductGallery';
import ProductInfo from '@/components/ProductDetail/ProductInfo';
import Reviews from '@/components/ProductDetail/Reviews';
import { useCart } from '@/context/CartContext';
import type { CartSelection, Product, ProductOptionGroup } from '@/types/commerce';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedOptionByGroup, setSelectedOptionByGroup] = useState<Record<string, string>>({});
  const { addProduct } = useCart();

  const images = useMemo(
    () =>
      product?.images?.length
        ? [...product.images].sort((a, b) => a.position - b.position).map((img) => img.imageUrl)
        : [placeholderImage],
    [product],
  );

  const optionGroups: ProductOptionGroup[] = useMemo(
    () =>
      (product.optionGroups ?? []).map((group) => ({
        id: group.id,
        name: group.name,
        optionValues: group.optionValues.map((value) => ({
          id: value.id,
          label: value.label,
          priceAdjustment: Number(value.priceAdjustment ?? 0),
        })),
      })),
    [product.optionGroups],
  );

  const specs = useMemo(
    () =>
      product?.attributeValues?.length
        ? product.attributeValues.map((item) => ({
            label: item.attribute.name,
            value: formatAttributeValue(item),
          }))
        : [],
    [product],
  );

  const selectedOptions = useMemo(
    () =>
      optionGroups
        .map((group) => {
          const selectedId = selectedOptionByGroup[group.id];
          const selectedValue =
            group.optionValues.find((option) => option.id === selectedId) ?? group.optionValues[0];
          if (!selectedValue) return null;

          return {
            optionGroupId: group.id,
            optionGroupName: group.name,
            optionValueId: selectedValue.id,
            optionValueLabel: selectedValue.label,
            priceAdjustment: Number(selectedValue.priceAdjustment),
          };
        })
        .filter((v): v is CartSelection => Boolean(v)),
    [optionGroups, selectedOptionByGroup],
  );

  const onSelectOption = (group: ProductOptionGroup, valueId: string) => {
    const value = group.optionValues.find((item) => item.id === valueId);
    if (!value) return;

    setSelectedOptionByGroup((prev) => ({
      ...prev,
      [group.id]: value.id,
    }));
  };

  const mainImage = selectedImage && images.includes(selectedImage) ? selectedImage : images[0];
  const price = Number(product.price);
  const cartProduct: Product = { ...product, optionGroups };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-white">
      <div className="mx-auto max-w-7xl border-b px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="transition hover:text-gray-900">Inicio</Link>
          <span>/</span>
          <Link href="/catalog" className="transition hover:text-gray-900">Catalogo</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={images} mainImage={mainImage} onSelect={setSelectedImage} />
          <ProductInfo
            productId={product.id}
            title={product.name}
            price={price}
            originalPrice={null}
            optionGroups={optionGroups}
            specs={specs}
            description={product.description}
            inStock={product.stock > 0}
            selectedOptions={selectedOptions}
            onSelectOption={onSelectOption}
            onAddToCart={() => addProduct(cartProduct, selectedOptions)}
          />
        </div>
      </div>
      <Reviews reviews={[]} rating={4.8} total={125} />
    </div>
  );
}
