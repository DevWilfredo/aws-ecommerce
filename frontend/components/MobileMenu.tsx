'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetClose } from "./ui/sheet";
import {
  ShoppingCart,
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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

const categoryIconByKey: Record<string, LucideIcon> = {
  telefonos: Smartphone,
  "smart-watches": Watch,
  camaras: Camera,
  auriculares: Headphones,
  computadoras: Laptop,
  gaming: Gamepad2,
};

const quickCatalogLinks = [
  { id: "all", name: "Ver todo", href: "/catalog", Icon: Grid2x2 },
  ...Categories.map((category) => ({
    id: String(category.id),
    name: category.name,
    href: category.href ?? "/catalog",
    Icon: categoryIconByKey[normalizeCategoryKey(category.slug ?? category.name)] ?? Grid2x2,
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

      <SheetContent side="right" className="w-[88vw] max-w-sm gap-0 p-0">
        <div className="flex h-full flex-col px-4 pb-4 pt-5 sm:px-5">
          <SheetHeader className="mb-4 flex-row items-center justify-center border-b border-slate-200 px-0 pb-4 pt-0">
            <div className="flex items-center gap-2">
              <Image src="/primestore-logo.png" alt="Logo" width={120} height={36} />
            </div>
          </SheetHeader>

          <div className="mb-5">
            <SearchBar onResultSelect={() => setOpen(false)} />
          </div>

          <nav className="flex-1 overflow-auto pr-1">
            <ul className="space-y-1.5">
              {primaryLinks.map((link) => (
                <li key={link.href}>
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                    >
                      {link.title}
                    </Link>
                  </SheetClose>
                </li>
              ))}

              <li className="pt-1">
                <details className="group rounded-lg">
                  <summary className="cursor-pointer rounded-lg px-3 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100">
                    Explorar catalogo
                  </summary>
                  <ul className="mt-1.5 space-y-1 pl-3">
                    {quickCatalogLinks.map((item) => (
                      <li key={item.id}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                          >
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

          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
            <SheetClose asChild>
              <Link
                href="/cart"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-800 transition hover:bg-slate-100"
              >
                <ShoppingCart className="h-5 w-5" /> Carrito
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-800 transition hover:bg-slate-100"
              >
                Perfil
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <a
                href={loginHref}
                className="mt-1 block rounded-lg bg-gradient-to-r from-[#062a4a] via-[#0b4f7d] to-[#0ea5e9] px-3 py-2.5 text-center text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Ingresar
              </a>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
