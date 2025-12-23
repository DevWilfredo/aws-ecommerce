import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NotFound = () => {
    return (
        <section className="bg-white">
            <div className="py-8 px-4 mx-auto max-w-7xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Algo falta.</p>
                    <p className="mb-4 text-lg font-light text-gray-500">Lo sentimos, no podemos encontrar esa página. Encontrarás mucho para explorar en la página de inicio.</p>
                    <Button asChild className="my-4 bg-[#01bffe] border border-[#0a2951] hover:bg-[#0aa5d8]">
                        <Link href="/">Volver al inicio</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default NotFound;