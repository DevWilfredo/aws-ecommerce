import BrandCard, { Brand } from "./BrandCard";


interface BrandsGridProps {
  title?: string;
  brands: Brand[];
  cols?: number;
}

export default function BrandsGrid({ title = "Explora las marcas Oficiales que trabajan con Nosotros", brands, cols = 6 }: BrandsGridProps) {
  const lgColsClass =
    cols === 3
      ? "lg:grid-cols-3"
      : cols === 4
        ? "lg:grid-cols-4"
        : cols === 5
          ? "lg:grid-cols-5"
          : "lg:grid-cols-6";

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 animate-fade-up sm:px-6">
      <h2 className="mb-6 text-lg font-semibold">{title}</h2>

      <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 ${lgColsClass}`}>
        {brands.map((b, index) => (
          <BrandCard key={b.id} brand={b} delayMs={index * 45} />
        ))}
      </div>
    </section>
  );
}
