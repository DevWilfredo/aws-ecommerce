import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NotFound = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 lg:text-9xl">404</h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Algo falta.</p>
          <p className="mb-4 text-lg font-light text-gray-500">
            Lo sentimos, no podemos encontrar esa página. Encontrarás mucho para explorar en la página de inicio.
          </p>
          <Button asChild className="my-4 border border-[#0a2951] bg-[#01bffe] hover:bg-[#0aa5d8]">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
