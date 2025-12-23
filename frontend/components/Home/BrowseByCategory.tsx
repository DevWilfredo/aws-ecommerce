import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Categories } from "@/mocks/categories";

export interface Category {
  id: string | number;
  name: string;
  icon?: string;
  href?: string;
}

export default function BrowseByCategory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with navigation buttons */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Explorar por categoría</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-gray-300 hover:bg-gray-100 hidden sm:inline-flex"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-gray-300 hover:bg-gray-100 hidden sm:inline-flex"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
        {Categories.map((category) => (
          <Link key={category.id} href={category.href ?? '#'} className="group">
            <div className="bg-gray-100 rounded-lg p-6 sm:p-4 flex flex-col items-center justify-center gap-3 h-36 sm:h-40 transition-all duration-300 hover:bg-gray-200 cursor-pointer">
              {/* Icon placeholder */}
              <div className="text-3xl sm:text-4xl">{category.icon}</div>

              {/* Category name */}
              <span className="text-sm sm:text-base font-medium text-center text-gray-800 group-hover:text-gray-900">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}