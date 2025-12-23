import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-10">
            {/* Main hero */}
            <div className="rounded-lg overflow-hidden bg-gray-900 text-white">
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                    {/* Text column */}
                    <div className="col-span-1 md:col-span-7 px-6 md:px-10 py-12 md:py-20">
                        <p className="text-sm text-gray-300 mb-3">Pro.Beyond.</p>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
                            iPhone 14 <span className="text-white">Pro</span>
                        </h1>
                        <p className="mt-4 text-gray-300 max-w-xl">
                            Creado para cambiarlo todo para mejor. Para todas las personas.
                        </p>
                        <div className="mt-8">
                            <Link href="/products/iphone-14-pro" passHref>
                                <Button className="bg-transparent border border-white text-white hover:bg-white/10">
                                    Comprar ahora
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Image column */}
                    <div className="col-span-1 md:col-span-5 relative h-56 md:h-96 flex items-center justify-center">
                        <Image
                            src="/Iphone.webp"
                            alt="iPhone placeholder"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-4">
                    {/* Playstation (top full width) */}
                    <Link
                        href="/products/ps5"
                        className="relative bg-white rounded-lg overflow-hidden h-56 md:h-80"
                    >
                        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
                            <div className="relative hidden md:block">
                                <Image
                                    src="/PlayStation.webp"
                                    alt="Playstation 5"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6 md:p-10 flex flex-col justify-center">
                                <h2 className="text-4xl font-semibold">Playstation 5</h2>
                                <p className="text-gray-600 mt-4 text-base leading-relaxed">
                                    CPUs y GPUs increíblemente potentes, y un SSD con I/O integrado
                                    redefinirán tu experiencia PlayStation.
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Bottom row: AirPods + Vision Pro */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[180px]">
                        {/* AirPods Max */}
                        <Link
                            href="/products/airpods"
                            className="bg-white p-6 md:p-8 rounded-lg flex items-center gap-6"
                        >
                            <div className="relative w-20 h-20">
                                <Image
                                    src="/airpodsmax.webp"
                                    alt="AirPods Max"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold">Apple AirPods Max</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Audio computacional. Pruébalos, son muy potentes.
                                </p>
                            </div>
                        </Link>

                        {/* Vision Pro */}
                        <Link
                            href="/products/vision-pro"
                            className="bg-black text-white p-6 md:p-8 rounded-lg flex items-center gap-6"
                        >
                            <div className="relative w-20 h-20">
                                <Image
                                    src="/visionpro.webp"
                                    alt="Vision Pro"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold">Apple Vision Pro</h4>
                                <p className="text-gray-300 leading-relaxed">
                                    Una forma inmersiva de disfrutar el entretenimiento.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* RIGHT COLUMN — Macbook full height */}
                <Link
                    href="/products/macbook-air"
                    className="bg-gray-50 rounded-lg overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 md:p-12 h-auto md:h-[500px]"
                >
                    <div className="w-full md:w-1/2">
                        <h3 className="text-3xl md:text-5xl font-light">
                            Macbook <span className="font-semibold">Air</span>
                        </h3>
                        <p className="mt-4 text-gray-600 max-w-full md:max-w-sm leading-relaxed">
                            El nuevo MacBook Air de 15 pulgadas ofrece más espacio para lo que amas
                            con una amplia pantalla Liquid Retina.
                        </p>
                        <Button className="mt-6 border border-gray-300">Comprar ahora</Button>
                    </div>

                    <div className="relative w-full md:w-72 h-40 md:h-72 mt-6 md:mt-0">
                        <Image
                            src="/macbook.webp"
                            alt="Macbook Air"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>
            </div>
        </section>
    );
}