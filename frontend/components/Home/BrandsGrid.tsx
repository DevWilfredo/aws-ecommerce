import BrandCard, { Brand } from "./BrandCard";


interface BrandsGridProps {
  title?: string;
  brands: Brand[];
  cols?: number;
}

export default function BrandsGrid({ title = "Explora las marcas Oficiales que trabajan con Nosotros", brands, cols = 6 }: BrandsGridProps) {
  const lgCols = `lg:grid-cols-${cols}`;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-lg font-semibold mb-6">{title}</h2>

      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${lgCols} gap-4`}>
        {brands.map((b) => (
          <BrandCard key={b.id} brand={b} />
        ))}
      </div>
    </section>
  );
}