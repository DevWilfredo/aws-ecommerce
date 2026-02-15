'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  User,
  LogIn,
  LogOut,
  ArrowRight,
  Smartphone,
  Watch,
  Camera,
  Headphones,
  Laptop,
  Gamepad2,
  Grid2x2,
  type LucideIcon,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Categories } from "@/mocks/categories";
import { clientApiFetch } from "@/services/client-api";

type MeResponse = {
  sub: string;
  email?: string;
  username?: string;
  groups?: string[];
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

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

const catalogCategories = Categories.map((category) => ({
  id: category.id,
  name: category.name,
  href: category.href ?? "/catalog",
  Icon:
    categoryIconByKey[normalizeCategoryKey(category.slug ?? category.name)] ??
    Grid2x2,
}));

function initialsFromEmail(email?: string) {
  if (!email) return "U";
  const name = email.split("@")[0] || "U";
  const parts = name.split(/[._-]/).filter(Boolean);
  const a = parts[0]?.[0] ?? name[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function Navbar() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [checking, setChecking] = useState(true);

  const avatarText = useMemo(() => initialsFromEmail(me?.email), [me?.email]);

  useEffect(() => {
    let alive = true;

    async function loadMe() {
      try {
        if (!API) {
          if (alive) {
            setMe(null);
            setChecking(false);
          }
          return;
        }

        const data = await clientApiFetch<MeResponse>('/auth/me', {
          method: "GET",
          timeoutMs: 6000,
        });

        if (!alive) return;

        setMe(data);
      } catch {
        if (alive) setMe(null);
      } finally {
        if (alive) setChecking(false);
      }
    }

    loadMe();
    return () => {
      alive = false;
    };
  }, []);

  const loginHref = API ? `${API}/auth/login` : "/login";
  const logoutHref = API ? `${API}/auth/logout` : "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/primestore-logo.png"
              alt="PrimeStore Logo"
              width={150}
              height={150}
              className="h-auto w-[126px] sm:w-[146px]"
            />
          </Link>

          <div className="hidden max-w-md flex-1 md:flex">
            <SearchBar />
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">Inicio</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Catalogo</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[620px] p-4">
                      <div className="grid grid-cols-[220px_1fr] gap-3">
                        <Link
                          href="/catalog"
                          className="group flex min-h-[220px] flex-col justify-between rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 p-4 text-slate-50 ring-1 ring-slate-700/50 transition-colors hover:from-slate-800 hover:to-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        >
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">PrimeStore</p>
                            <h3 className="mt-3 text-xl font-semibold leading-tight text-white">Ver todo el catalogo</h3>
                            <p className="mt-2 text-sm text-slate-200">
                              Explora todas las categorias y descubre lo mas nuevo en tecnologia.
                            </p>
                          </div>
                          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                            Ir a catalogo
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>

                        <ul className="grid grid-cols-2 gap-2">
                          {catalogCategories.map((category) => (
                            <li key={category.id}>
                              <Link
                                href={category.href}
                                className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                              >
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                                  <category.Icon className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-700" />
                                  {category.name}
                                </span>
                                <span className="mt-1 text-xs text-slate-500">Ver productos</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/contact">Contacto</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <CartDrawer />

            {!checking && me ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0" title={me.email ?? "Mi cuenta"}>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-800">
                      {avatarText}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Perfil
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <a href={logoutHref} className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Cerrar sesion
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="brand" className="h-10 px-4">
                <a href={loginHref} className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Ingresar
                </a>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <CartDrawer />
            <MobileMenu />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 md:hidden sm:px-6">
        <SearchBar />
      </div>
    </nav>
  );
}
