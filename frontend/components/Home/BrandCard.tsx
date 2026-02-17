import Image from "next/image";
import React from "react";

export type LogoType = string | React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface Brand {
  id: string | number;
  name: string;
  logo?: LogoType;
  href?: string;
  subtitle?: string;
}

type BrandCardProps = {
  brand: Brand;
  delayMs?: number;
};

export default function BrandCard({ brand, delayMs = 0 }: BrandCardProps) {
  const Logo = typeof brand.logo === "function" ? brand.logo : null;

  return (
    <article
      className="group hover-lift relative block overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50/40 p-4 shadow-sm transition-all hover:border-sky-200 hover:shadow-[0_16px_32px_rgba(2,132,199,0.14)]"
      aria-label={`Marca ${brand.name}`}
    >
      <div
        className="relative flex items-center gap-4 animate-fade-up"
        style={{ animationDelay: `${Math.min(delayMs, 360)}ms` }}
      >
        <span className="pointer-events-none absolute -right-10 -top-10 h-20 w-20 rounded-full bg-sky-200/50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg flex items-center justify-center">
          {typeof brand.logo === "string" ? (
            <Image
              src={brand.logo}
              alt={brand.name}
              width={44}
              height={44}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : Logo ? (
            <Logo className="h-10 w-10 text-gray-900 transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-200" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-gray-900 transition-colors duration-300 group-hover:text-sky-900">
            {brand.name}
          </div>
          <div className="truncate text-xs text-gray-500 transition-colors duration-300 group-hover:text-sky-700/80">
            {brand.subtitle ?? "Entrega entre 24/48 h"}
          </div>
        </div>
      </div>
    </article>
  );
}
