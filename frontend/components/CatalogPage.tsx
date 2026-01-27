import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: object[];
  brand: object;
  category: string;
};

const res = await fetch("http://localhost:3000/api/products", { cache: "no-store" });
const products = await res.json();

export default function Catalog() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar - filtros*/}
      <aside className="col-span-1 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <button className="text-sm text-blue-500 hover:underline">Limpiar</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="font-medium mb-3">Marca</h4>
          <div className="space-y-2">
            {["Apple", "Samsung", "Xiaomi", "Poco", "Honor"].map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-gray-700">{brand}</span>
                <span className="ml-auto text-xs text-gray-400">({Math.round(Math.random() * 150)})</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="font-medium mb-3">Búsqueda</h4>
          <input
            type="search"
            placeholder="Buscar productos..."
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
          <p className="mt-2 text-xs text-gray-500">Presiona fuera del campo para aplicar (pendiente)</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="font-medium mb-3">Ordenar por</h4>
          <select className="w-full border rounded-md px-3 py-2 text-sm">
            <option value="popular">Más populares</option>
            <option value="price_asc">Precio: bajo a alto</option>
            <option value="price_desc">Precio: alto a bajo</option>
            <option value="newest">Nuevos</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 text-sm text-gray-500">
          <strong>Más filtros</strong>
          <div className="mt-2">Pantalla, Batería, Memoria — (estructura lista)</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="col-span-1 lg:col-span-3">
        {/* Breadcrumb + resumen */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            <Link href="/" className="text-gray-500 hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Catálogo</span>
          </div>
          <div className="text-sm text-gray-600">
            Productos seleccionados: <span className="font-semibold text-gray-800">{products.length}</span>
          </div>
        </div>

        {/* Encabezado de la grilla */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Smartphones</h1>
          <div className="text-sm text-gray-600">Vista de lista / grilla (próx.)</div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product : any) => (
            <article key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="relative w-full h-44 mb-4 bg-gray-100 rounded overflow-hidden">
                <Image src={product.images[2].imageUrl} alt='holaa' fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-4" />
              </div>
              <Link href={`/product/${product.id}`} className="text-sm font-medium text-gray-800 hover:underline">
                {product.name}
              </Link>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div>
                  <div className="text-lg font-bold">${product.price}</div>
                  <div className="text-xs text-gray-500">{product.brand.name}</div>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded text-sm">Comprar Ahora</button>
              </div>
            </article>
          ))}
        </div>

        {/* Paginación - estructura */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button className="px-3 py-2 border rounded">Prev</button>
          <button className="px-3 py-2 border rounded bg-black text-white">1</button>
          <button className="px-3 py-2 border rounded">2</button>
          <button className="px-3 py-2 border rounded">Next</button>
        </div>
      </main>
    </div>
  );
}