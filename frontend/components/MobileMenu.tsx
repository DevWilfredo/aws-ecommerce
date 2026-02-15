'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetClose } from "./ui/sheet";
import {
  ShoppingCart,
  X,
  Menu,
  Smartphone,
  Watch,
  Camera,
  Headphones,
  Laptop,
  Gamepad2,
  Grid2x2,
  type LucideIcon,
} from "lucide-react";
import { Categories } from "@/mocks/categories";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const primaryLinks = [
  { title: "Inicio", href: "/" },
  { title: "Catalogo", href: "/catalog" },
  { title: "Contacto", href: "/contact" },
];

function normalizeCategoryKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const categoryIconByKey: Record<string, LucideIcon> = {
  telefonos: Smartphone,
  "smart watches": Watch,
  camaras: Camera,
  auriculares: Headphones,
  computadoras: Laptop,
  gaming: Gamepad2,
};

const quickCatalogLinks = [
  { id: "all", name: "Ver todo", Icon: Grid2x2 },
  ...Categories.slice(0, 4).map((category) => ({
    id: String(category.id),
    name: category.name,
    Icon: categoryIconByKey[normalizeCategoryKey(category.name)] ?? Grid2x2,
  })),
];

export default function MobileMenu() {
  const loginHref = API ? `${API}/auth/login` : "/login";
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Abrir menu"
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-4/5 max-w-xs">
        <SheetHeader className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/primestore-logo.png" alt="Logo" width={120} height={36} />
          </div>
          <SheetClose asChild>
            <button aria-label="Cerrar" className="rounded-md p-2 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </SheetClose>
        </SheetHeader>

        <div className="mb-4">
          <SearchBar />
        </div>

        <nav className="flex-1 overflow-auto">
          <ul className="space-y-2">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link href={link.href} className="block rounded px-2 py-3 hover:bg-gray-100">
                    <div className="text-sm font-medium">{link.title}</div>
                  </Link>
                </SheetClose>
              </li>
            ))}

            <li>
              <details className="group">
                <summary className="cursor-pointer rounded px-2 py-3 hover:bg-gray-100">Explorar catalogo</summary>
                <ul className="mt-2 space-y-2 pl-4">
                  {quickCatalogLinks.map((item) => (
                    <li key={item.id}>
                      <SheetClose asChild>
                        <Link href="/catalog" className="inline-flex w-full items-center gap-2 rounded px-2 py-2 hover:bg-gray-100">
                          <item.Icon className="h-4 w-4 text-gray-500" />
                          {item.name}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </nav>

        <div className="mt-4 space-y-3 border-t pt-4">
          <SheetClose asChild>
            <Link href="/cart" className="flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5" /> Carrito
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/profile" className="flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-100">
              Perfil
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={loginHref}
              className="block rounded-md bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-3 py-2 text-center text-white shadow-[0_10px_24px_rgba(2,132,199,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Ingresar
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
