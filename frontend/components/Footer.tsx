import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  CreditCard,
  Pocket,
  Headphones,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import GooglePay from "./icons/GooglePay";
import Visa from "./icons/Visa";
import Mastercard from "./icons/Mastercard";
import ApplePay from "./icons/ApplePay";
import PayPal from "./icons/PayPal";

export default function Footer() {
  return (
    <footer className="bg-[#002443] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top feature row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Recogida gratis en tienda</div>
              <div className="text-xs text-gray-500">Servicio disponible 24/7</div>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">
              <Pocket className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Envío Gratis</div>
              <div className="text-xs text-gray-500">Servicio disponible 24/7</div>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Pago Flexible</div>
              <div className="text-xs text-gray-500">Servicio disponible 24/7</div>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Ayuda Conveniente</div>
              <div className="text-xs text-gray-500">Servicio disponible 24/7</div>
            </div>
          </div>
        </div>

        {/* Main link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-600 pt-8 pb-8">
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Acerca de PrimeStore</h4>
            <ul className="text-xs space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white transition">Información de la empresa</Link></li>
              <li><Link href="#" className="hover:text-white transition">Noticias</Link></li>
              <li><Link href="#" className="hover:text-white transition">Inversionistas</Link></li>
              <li><Link href="#" className="hover:text-white transition">Carreras</Link></li>
              <li><Link href="#" className="hover:text-white transition">Publicidad con nosotros</Link></li>
              <li><Link href="#" className="hover:text-white transition">Políticas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Pedidos y Compras</h4>
            <ul className="text-xs space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white transition">Verificar estado del pedido</Link></li>
              <li><Link href="#" className="hover:text-white transition">Envío, Entrega y Recogida</Link></li>
              <li><Link href="#" className="hover:text-white transition">Devoluciones e Intercambios</Link></li>
              <li><Link href="#" className="hover:text-white transition">Garantía de Precio</Link></li>
              <li><Link href="#" className="hover:text-white transition">Retirada de Productos</Link></li>
              <li><Link href="#" className="hover:text-white transition">Tarjetas de Regalo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Categorías Populares</h4>
            <ul className="text-xs space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white transition">Teléfonos</Link></li>
              <li><Link href="#" className="hover:text-white transition">Computadoras</Link></li>
              <li><Link href="#" className="hover:text-white transition">Relojes Inteligentes</Link></li>
              <li><Link href="#" className="hover:text-white transition">Auriculares</Link></li>
              <li><Link href="#" className="hover:text-white transition">TV y Cine en Casa</Link></li>
              <li><Link href="#" className="hover:text-white transition">Accesorios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Soporte y Servicios</h4>
            <ul className="text-xs space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white transition">Centro de Vendedores</Link></li>
              <li><Link href="#" className="hover:text-white transition">Contáctanos</Link></li>
              <li><Link href="#" className="hover:text-white transition">Centro de Ayuda</Link></li>
              <li><Link href="#" className="hover:text-white transition">Garantía de Devolución de Dinero</Link></li>
              <li><Link href="#" className="hover:text-white transition">Política de Garantía</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-600 pt-6">
          <div className="flex items-center gap-3">
            <Image 
              src="/primestore-logo.png" 
              alt="PrimeStore logo" 
              width={160} 
              height={80}
              className="object-contain"
            />
            <div className="text-xs text-gray-300">
              © {new Date().getFullYear()} PrimeStore. Todos los Derechos Reservados.
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Payment methods */}
            <div className="flex items-center gap-2">
              <GooglePay className="w-10 h-10" />
              <Visa className="w-10 h-10" aria-label="Visa" />
              <Mastercard className="w-10 h-10" aria-label="MasterCard" />
              <ApplePay className="w-10 h-10" aria-label="ApplePay" />
              <PayPal className="w-10 h-10" aria-label="Paypal"/> 
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Link href="#" aria-label="facebook" className="hover:text-white transition"><Facebook className="w-4 h-4" /></Link>
              <Link href="#" aria-label="twitter" className="hover:text-white transition"><Twitter className="w-4 h-4" /></Link>
              <Link href="#" aria-label="instagram" className="hover:text-white transition"><Instagram className="w-4 h-4" /></Link>
              <Link href="#" aria-label="linkedin" className="hover:text-white transition"><Linkedin className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}