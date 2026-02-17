import type { Category } from "@/components/Home/BrowseByCategory";

export const Categories: Category[] = [
  {
    id: 1,
    name: "Teléfonos",
    slug: "telefonos",
    icon: "\u{1F4F1}",
    href: "/catalog?category=telefonos",
  },
  {
    id: 2,
    name: "Relojes inteligentes",
    slug: "smart-watches",
    icon: "\u{231A}",
    href: "/catalog?category=smart-watches",
  },
  {
    id: 3,
    name: "Cámaras",
    slug: "camaras",
    icon: "\u{1F4F7}",
    href: "/catalog?category=camaras",
  },
  {
    id: 4,
    name: "Auriculares",
    slug: "auriculares",
    icon: "\u{1F3A7}",
    href: "/catalog?category=auriculares",
  },
  {
    id: 5,
    name: "Computadoras",
    slug: "computadoras",
    icon: "\u{1F4BB}",
    href: "/catalog?category=computadoras",
  },
  {
    id: 6,
    name: "Videojuegos",
    slug: "gaming",
    icon: "\u{1F3AE}",
    href: "/catalog?category=gaming",
  },
];
