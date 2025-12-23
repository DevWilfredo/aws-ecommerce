'use client';

import Image from "next/image";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";
import { User, LogIn } from "lucide-react";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
];

export default function Navbar() {
    return (
        <nav className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                {/* Logo y SearchBar */}
                <div className="flex items-center gap-4 flex-1">
                    <Link href="/" className="flex items-center">
                        <Image src="/primestore-logo.png" alt="PrimeStore Logo" width={150} height={150} />
                    </Link>

                    {/* Search visible en md+ */}
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
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/profile" title="Mi perfil"><User className="w-5 h-5" /></Link>
                        </Button>
                        <Button asChild>
                            <Link href="/login" className="flex items-center gap-2"><LogIn className="w-4 h-4" />Ingresar</Link>
                        </Button>
                    </div>

                    {/* Mobile: carrito visible + MobileMenu trigger (shadcn Sheet) */}
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
                <a href={href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    );
}