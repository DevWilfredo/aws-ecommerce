'use client';

import { useState } from "react";
import Link from "next/link";
import ProductGallery from "@/components/ProductDetail/ProductGallery";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import Reviews from "@/components/ProductDetail/Reviews";

type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  colors: string[];
  storage: string[];
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  specs: {
    processor: string;
    ram: string;
    mainCamera: string;
    frontCamera: string;
    battery: string;
    display: string;
  };
  description: string;
  inStock: boolean;
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

const mockProduct: Product = {
  id: "1",
  title: "Apple iPhone 14 Pro Max",
  price: 1399,
  originalPrice: 1499,
  colors: ["#1a1a1a", "#c9b5d8", "#e8e8e8", "#d4af37"],
  storage: ["128GB", "256GB", "512GB", "1TB"],
  image: "/Iphone-pro-1.png",
  images: ["/Iphone-pro-1.png", "/Iphone.webp", "/PlayStation.webp", "/Iphone-pro-1.png"],
  rating: 4.8,
  reviews: 125,
  specs: {
    processor: "Apple A16 Bionic",
    ram: "6GB",
    mainCamera: "48+12+12 MP",
    frontCamera: "12 MP",
    battery: "4323 mAh",
    display: "6.7 inch",
  },
  description:
    "Enhanced capabilities thanks foam enlarged display of 6.7 millimeter work without recharging throughout the day. Incredible photos in weak, yestand in bright lightning in the new sympathetic two-camera setup.",
  inStock: true,
};

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Grace Carey",
    avatar: "https://placehold.co/600x400?text=G",
    rating: 4.5,
    date: "24 January 2023",
    title: "",
    content:
      "I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn't be happier with my purchase! ... Highly recommend! ❤️",
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

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = mockProduct;

  const [mainImage, setMainImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(product.storage[0]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 border-b">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Inicio</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-gray-900">Catálogo</Link>
          <span>/</span>
          <Link href="/catalog?category=smartphones" className="hover:text-gray-900">Smartphones</Link>
          <span>/</span>
          <Link href="/catalog?brand=apple" className="hover:text-gray-900">Apple</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={product.images} mainImage={mainImage} onSelect={setMainImage} />

          <ProductInfo
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            colors={product.colors}
            storage={product.storage}
            specs={product.specs}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedStorage={selectedStorage}
            setSelectedStorage={setSelectedStorage}
          />
        </div>
      </div>

      <Reviews reviews={mockReviews} rating={product.rating} total={product.reviews} />
    </div>
  );
}