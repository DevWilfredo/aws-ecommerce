'use client';
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "./ui/sheet";
import { ShoppingCart, X, Menu } from "lucide-react";

const items = [
  { title: "Inicio", href: "/" },
  { title: "Categorías", href: "/catalog" },
  { title: "Contacto", href: "/contact" },
];

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Abrir menú"
          className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-4/5 max-w-xs">
        <SheetHeader className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image src="/primestore-logo.png" alt="Logo" width={120} height={36} />
          </div>
          <SheetClose asChild>
            <button aria-label="Cerrar" className="p-2 rounded-md hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </SheetClose>
        </SheetHeader>

        <div className="mb-4">
          <SearchBar />
        </div>

        <nav className="flex-1 overflow-auto">
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="block py-3 px-2 rounded hover:bg-gray-100" >
                  <div className="text-sm font-medium">{it.title}</div>
                </Link>
              </li>
            ))}
            {/* ejemplo de sublista para categorías */}
            <li>
              <details className="group">
                <summary className="py-3 px-2 rounded cursor-pointer hover:bg-gray-100">Categorías</summary>
                <ul className="pl-4 mt-2 space-y-2">
                  <li><Link href="/catalog?category=smartphones" className="block py-2 px-2 rounded hover:bg-gray-100">Smartphones</Link></li>
                  <li><Link href="/catalog?category=accessories" className="block py-2 px-2 rounded hover:bg-gray-100">Accesorios</Link></li>
                </ul>
              </details>
            </li>
          </ul>
        </nav>

        <div className="mt-4 border-t pt-4 space-y-3">
          <Link href="/cart" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100">
            <ShoppingCart className="w-5 h-5" /> Carrito
          </Link>
          <Link href="/profile" className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100">Perfil</Link>
          <Link href="/login" className="block text-center py-2 px-3 rounded bg-black text-white">Ingresar</Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}