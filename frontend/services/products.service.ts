// src/services/products.service.ts
import { apiFetch } from './api';

export type Product = {
  id: string;
  name: string;
  description:string
  price: number;
  stock: number;
  images: object[];
  brand: object;
  category: string;
};

export async function getProducts() {
    return apiFetch<Product[]>('/products');
}

export async function getProductById(id: string) {
  return apiFetch<Product>(`/products/${encodeURIComponent(id)}`);
}