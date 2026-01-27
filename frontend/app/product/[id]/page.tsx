'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductGallery from "@/components/ProductDetail/ProductGallery";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import Reviews from "@/components/ProductDetail/Reviews";

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
    name: string;
    optionValues: Array<{ label: string }>;
  }>;
};

type Review = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  images?: string[];
};

const placeholderImage = "https://placehold.co/600x600?text=Producto";

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Grace Carey",
    avatar: "https://placehold.co/600x400?text=G",
    rating: 4.5,
    date: "24 January 2023",
    title: "",
    content:
      "I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase! ... Highly recommend! <3",
    images: [],
  },
  {
    id: "2",
    author: "Ronald Richards",
    avatar: "https://placehold.co/600x400?text=R",
    rating: 5,
    date: "24 January 2023",
    title: "",
    content:
      "This phone has 1T storage and is durable. Plus all the new iPhones have a C port! ...",
    images: [],
  },
  {
    id: "3",
    author: "Darcy King",
    avatar: "https://placehold.co/600x400?text=U",
    rating: 4,
    date: "24 January 2023",
    title: "",
    content: "Might be the only one to say this but the camera is a little funky. ...",
    images: ["/Iphone.webp", "/Iphone-pro-1.png"],
  },
];

const formatAttributeValue = (
  value: ApiProduct["attributeValues"][number]
) => {
  if (value.valueText) return value.valueText;
  if (value.valueNumber) {
    return value.attribute.unit
      ? `${value.valueNumber} ${value.attribute.unit}`
      : value.valueNumber;
  }
  if (value.valueBoolean !== null) {
    return value.valueBoolean ? "Si" : "No";
  }
  return "N/A";
};

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState(placeholderImage);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("No se pudo cargar el producto");
        }
        const data: ApiProduct = await res.json();
        if (isMounted) {
          setProduct(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(String(err?.message ?? err));
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!product?.images?.length) return [placeholderImage];
    return [...product.images]
      .sort((a, b) => a.position - b.position)
      .map((img) => img.imageUrl);
  }, [product]);

  const colorOptions = useMemo(() => {
    const group = product?.optionGroups?.find((g) =>
      g.name.toLowerCase().includes("color")
    );
    return group?.optionValues?.map((v) => v.label) ?? [];
  }, [product]);

  const storageOptions = useMemo(() => {
    const group = product?.optionGroups?.find((g) =>
      g.name.toLowerCase().includes("almacenamiento")
    );
    return group?.optionValues?.map((v) => v.label) ?? [];
  }, [product]);

  const specs = useMemo(() => {
    if (!product?.attributeValues?.length) return [];
    return product.attributeValues.map((item) => ({
      label: item.attribute.name,
      value: formatAttributeValue(item),
    }));
  }, [product]);

  useEffect(() => {
    if (images.length) setMainImage(images[0]);
  }, [images]);

  useEffect(() => {
    if (colorOptions.length) setSelectedColor(colorOptions[0]);
  }, [colorOptions]);

  useEffect(() => {
    if (storageOptions.length) setSelectedStorage(storageOptions[0]);
  }, [storageOptions]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  const price = Number(product.price);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 border-b">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-gray-900">
            Catalogo
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?category=${product.category.slug}`}
            className="hover:text-gray-900"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?brand=${product.brand.slug}`}
            className="hover:text-gray-900"
          >
            {product.brand.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery
            images={images}
            mainImage={mainImage}
            onSelect={setMainImage}
          />

          <ProductInfo
            title={product.name}
            price={price}
            originalPrice={null}
            colors={colorOptions}
            storage={storageOptions}
            specs={specs}
            description={product.description}
            inStock={product.stock > 0}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedStorage={selectedStorage}
            setSelectedStorage={setSelectedStorage}
          />
        </div>
      </div>

      <Reviews reviews={mockReviews} rating={4.8} total={125} />
    </div>
  );
}
