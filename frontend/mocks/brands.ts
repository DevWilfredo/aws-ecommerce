import type { Brand } from "@/components/Home/BrandCard";
import { Apple } from "@/public/brands/apple";
import Asus from "@/public/brands/Asus";
import Dell from "@/public/brands/Dell";
import Hp from "@/public/brands/Hp";
import Huawei from "@/public/brands/Huawei";
import Lenovo from "@/public/brands/Lenovo";
import Lg from "@/public/brands/Lg";
import { Microsoft } from "@/public/brands/Microsoft";
import Razer from "@/public/brands/Razer";
import Samsung from "@/public/brands/Samsung";
import Sony from "@/public/brands/Sony";
import Xiaomi from "@/public/brands/Xiaomi";

export const mockBrands: Brand[] = [
  { id: "apple", name: "Apple", logo: Apple, href: "/brands/apple" },
  { id: "samsung", name: "Samsung", logo: Samsung, href: "/brands/samsung" },
  { id: "dell", name: "Dell", logo: Dell, href: "/brands/dell" },
  { id: "hp", name: "HP", logo: Hp, href: "/brands/hp" },
  { id: "lenovo", name: "Lenovo", logo: Lenovo, href: "/brands/lenovo" },
  { id: "asus", name: "ASUS", logo: Asus, href: "/brands/asus" },
  { id: "lg", name: "LG Electronics", logo: Lg, href: "/brands/lg" },
  { id: "sony", name: "Sony", logo: Sony, href: "/brands/sony" },
  { id: "microsoft", name: "Microsoft", logo: Microsoft, href: "/brands/microsoft" },
  { id: "xiaomi", name: "Xiaomi", logo: Xiaomi, href: "/brands/xiaomi" },
  { id: "huawei", name: "Huawei", logo: Huawei, href: "/brands/huawei" },
  { id: "razer", name: "Razer", logo: Razer, href: "/brands/razer" },
];