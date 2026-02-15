import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Categories } from "@/mocks/categories";

export interface Category {
  id: string | number;
  name: string;
  icon?: string;
  href?: string;
}

export default function BrowseByCategory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold sm:text-2xl">Explorar por categoria</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full border border-gray-300 hover:bg-gray-100 sm:inline-flex"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full border border-gray-300 hover:bg-gray-100 sm:inline-flex"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-6 md:gap-6">
        {Categories.map((category) => (
          <Link key={category.id} href={category.href ?? "#"} className="group">
            <div className="flex h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl bg-gray-100 p-4 transition-all duration-300 hover:bg-gray-200 sm:h-40">
              <div className="text-3xl sm:text-4xl">{category.icon}</div>
              <span className="text-center text-sm font-medium text-gray-800 group-hover:text-gray-900 sm:text-base">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
