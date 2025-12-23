import Image from "next/image";
import Link from "next/link";
import React from "react";

export type LogoType = string | React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface Brand {
  id: string | number;
  name: string;
  logo?: LogoType;
  href?: string;
  subtitle?: string;
}

export default function BrandCard({ brand }: { brand: Brand }) {
  const Logo = typeof brand.logo === "function" ? brand.logo : null;

  return (
    <Link
      href={brand.href ?? "#"}
      className="block"
      aria-label={`Open ${brand.name} store`}
    >
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
          {typeof brand.logo === "string" ? (
            <Image
              src={brand.logo}
              alt={brand.name}
              width={44}
              height={44}
              className="object-contain"
            />
          ) : Logo ? (
            <Logo className="w-10 h-10 text-gray-900" />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{brand.name}</div>
          <div className="text-xs text-gray-500 truncate">{brand.subtitle ?? "Delivery entre 24/48 hrs"}</div>
        </div>
      </div>
    </Link>
  );
}