
import { BrandsGrid, BrowseByCategory, Hero, ProductGrid } from "@/components/Home"
import { mockBrands } from "@/mocks/brands"
import { mockProducts } from "@/mocks/products"

const Home = () => {
  return (
    <>
      <Hero />
      <BrowseByCategory />
      <ProductGrid products={mockProducts} tabs={["New Arrival", "Bestseller", "Featured Products"]} defaultTab="New Arrival" />
      <BrandsGrid brands={mockBrands} />
    </>
  )
}

export default Home