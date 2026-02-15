import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  Facebook,
  Headphones,
  Pocket,
  Truck,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import GooglePay from "./icons/GooglePay";
import Visa from "./icons/Visa";
import Mastercard from "./icons/Mastercard";
import ApplePay from "./icons/ApplePay";
import PayPal from "./icons/PayPal";

const featureCards = [
  { title: "Recogida gratis en tienda", subtitle: "Servicio disponible 24/7", Icon: Truck },
  { title: "Envio gratis", subtitle: "Servicio disponible 24/7", Icon: Pocket },
  { title: "Pago flexible", subtitle: "Servicio disponible 24/7", Icon: CreditCard },
  { title: "Ayuda conveniente", subtitle: "Servicio disponible 24/7", Icon: Headphones },
];

const footerColumns = [
  {
    title: "Acerca de PrimeStore",
    links: [
      "Informacion de la empresa",
      "Noticias",
      "Inversionistas",
      "Carreras",
      "Publicidad con nosotros",
      "Politicas",
    ],
  },
  {
    title: "Pedidos y compras",
    links: [
      "Verificar estado del pedido",
      "Envio, entrega y recogida",
      "Devoluciones e intercambios",
      "Garantia de precio",
      "Retirada de productos",
      "Tarjetas de regalo",
    ],
  },
  {
    title: "Categorias populares",
    links: [
      "Telefonos",
      "Computadoras",
      "Relojes inteligentes",
      "Auriculares",
      "TV y cine en casa",
      "Accesorios",
    ],
  },
  {
    title: "Soporte y servicios",
    links: [
      "Centro de vendedores",
      "Contactanos",
      "Centro de ayuda",
      "Garantia de devolucion de dinero",
      "Politica de garantia",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#002443] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {featureCards.map(({ title, subtitle, Icon }) => (
            <article key={title} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{subtitle}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-8 border-t border-slate-600 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{column.title}</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {column.links.map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-t border-slate-600 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Image
              src="/primestore-logo.png"
              alt="PrimeStore logo"
              width={150}
              height={70}
              className="h-auto w-[130px]"
            />
            <p className="text-xs text-slate-300">
              (c) {new Date().getFullYear()} PrimeStore. Todos los derechos reservados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <GooglePay className="h-10 w-10" />
            <Visa className="h-10 w-10" aria-label="Visa" />
            <Mastercard className="h-10 w-10" aria-label="MasterCard" />
            <ApplePay className="h-10 w-10" aria-label="ApplePay" />
            <PayPal className="h-10 w-10" aria-label="Paypal" />
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <Link href="#" aria-label="facebook" className="transition hover:text-white">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" aria-label="twitter" className="transition hover:text-white">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" aria-label="instagram" className="transition hover:text-white">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" aria-label="linkedin" className="transition hover:text-white">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
