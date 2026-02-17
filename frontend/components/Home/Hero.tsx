import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 animate-fade-in sm:px-6 sm:py-10">
      <div className="overflow-hidden rounded-2xl bg-gray-900 text-white animate-fade-up">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="col-span-1 px-5 py-10 md:col-span-7 md:px-10 md:py-20">
            <p className="mb-3 text-sm text-gray-300">Pro.Beyond.</p>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
              iPhone 14 <span className="text-white">Pro</span>
            </h1>
            <p className="mt-4 max-w-xl text-gray-300">
              Creado para cambiarlo todo para mejor. Para todas las personas.
            </p>
            <div className="mt-8">
              <Link href="/catalog">
                <Button className="border border-white bg-transparent text-white hover:bg-white/10">
                  Comprar ahora
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative col-span-1 flex h-52 items-center justify-center md:col-span-5 md:h-96">
              <Image src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/Iphone.webp`} alt="iPhone" fill className="object-contain" priority />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Link href="/catalog" className="hover-lift relative h-56 overflow-hidden rounded-2xl bg-white animate-fade-up md:h-80" style={{ animationDelay: '80ms' }}>
            <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
              <div className="relative hidden md:block">
                 <Image src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/PlayStation.webp`} alt="PlayStation 5" fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                 <h2 className="text-3xl font-semibold md:text-4xl">PlayStation 5</h2>
                 <p className="mt-4 text-base leading-relaxed text-gray-600">
                   CPUs y GPUs increíblemente potentes, y un SSD con I/O integrado redefinirán tu experiencia PlayStation.
                 </p>
              </div>
            </div>
          </Link>

          <div className="grid h-auto grid-cols-1 gap-4 md:h-[180px] md:grid-cols-2">
            <Link href="/catalog" className="hover-lift flex items-center gap-6 rounded-2xl bg-white p-6 animate-fade-up md:p-8" style={{ animationDelay: '130ms' }}>
              <div className="relative h-20 w-20">
                <Image src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/airpodsmax.webp`} alt="AirPods Max" fill className="object-contain" />
              </div>
              <div>
                 <h4 className="text-xl font-semibold">Apple AirPods Max</h4>
                 <p className="leading-relaxed text-gray-600">Audio computacional. Pruébalos, son muy potentes.</p>
               </div>
             </Link>

            <Link href="/catalog" className="hover-lift flex items-center gap-6 rounded-2xl bg-black p-6 text-white animate-fade-up md:p-8" style={{ animationDelay: '170ms' }}>
              <div className="relative h-20 w-20">
                <Image src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/visionpro.webp`} alt="Vision Pro" fill className="object-contain" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">Apple Vision Pro</h4>
                <p className="leading-relaxed text-gray-300">Una forma inmersiva de disfrutar el entretenimiento.</p>
              </div>
            </Link>
          </div>
        </div>

        <Link
          href="/catalog"
          className="hover-lift flex h-auto flex-col items-center justify-between overflow-hidden rounded-2xl bg-gray-50 p-6 animate-fade-up md:h-[500px] md:flex-row md:p-12"
          style={{ animationDelay: '110ms' }}
        >
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl font-light md:text-5xl">
               MacBook <span className="font-semibold">Air</span>
             </h3>
             <p className="mt-4 max-w-full leading-relaxed text-gray-600 md:max-w-sm">
               El nuevo MacBook Air de 15 pulgadas ofrece más espacio para lo que amas con una amplia pantalla Liquid Retina.
             </p>
            <Button className="mt-6 border border-gray-300">Comprar ahora</Button>
          </div>

          <div className="relative mt-6 h-40 w-full md:mt-0 md:h-72 md:w-72">
             <Image src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/MacBook.webp`} alt="MacBook Air" fill className="object-contain" />
          </div>
        </Link>
      </div>
    </section>
  );
}
