'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { User, LogIn, LogOut } from "lucide-react";

import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "./ui/navigation-menu";

import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

// Shadcn dropdown (recomendado para avatar menu)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MeResponse = {
  sub: string;
  email?: string;
  username?: string;
  groups?: string[];
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const components: { title: string; href: string; description: string }[] = [
  { title: "Alert Dialog", href: "/docs/primitives/alert-dialog", description: "..." },
  { title: "Hover Card", href: "/docs/primitives/hover-card", description: "..." },
  { title: "Progress", href: "/docs/primitives/progress", description: "..." },
  { title: "Scroll-area", href: "/docs/primitives/scroll-area", description: "..." },
  { title: "Tabs", href: "/docs/primitives/tabs", description: "..." },
  { title: "Tooltip", href: "/docs/primitives/tooltip", description: "..." },
];

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
          // Si no hay API base, no podemos verificar sesión
          if (alive) {
            setMe(null);
            setChecking(false);
          }
          return;
        }

        const res = await fetch(`${API}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!alive) return;

        if (res.ok) {
          const data = (await res.json()) as MeResponse;
          setMe(data);
        } else {
          setMe(null);
        }
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
    <nav className="border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo y SearchBar */}
        <div className="flex items-center gap-4 flex-1">
          <Link href="/" className="flex items-center">
            <Image src="/primestore-logo.png" alt="PrimeStore Logo" width={150} height={150} />
          </Link>

          <div className="hidden md:flex flex-1">
            <SearchBar />
          </div>
        </div>

        {/* Navegación Central - visible en md+ */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">Inicio</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Categorías</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem key={component.title} title={component.title} href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/contact">Contacto</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-3">
          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <CartDrawer />

            {/* Si está logueado, muestra avatar + menu */}
            {!checking && me ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0" title={me.email ?? "Mi cuenta"}>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-800 text-sm font-semibold">
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
                    {/* Logout: backend borra cookies y cierra Cognito */}
                    <a href={logoutHref} className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // si no está logueado (o aún verificando), muestra botón ingresar
              <Button asChild>
                <a href={loginHref} className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Ingresar
                </a>
              </Button>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <CartDrawer />
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

interface ListItemProps {
  href: string;
  title: string;
  children: React.ReactNode;
}

function ListItem({ title, children, href }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
