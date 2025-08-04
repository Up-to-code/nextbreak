import Carousel from "@/components/Carousel";
import BrutalTitle from "@/components/common/BrutalTitle";
import ProductCard from "@/components/common/ProductCard";
import { getProducts } from "../actions/product";

export default async function Home() {
  const products = await getProducts();
  
  // Get top sellers (most purchased)
  const topSellers = [...products]
    .sort((a, b) => (b.buyerCount || 0) - (a.buyerCount || 0))
    .slice(0, 3);
  
  // Get new arrivals (created within last week)
  const newArrivals = [...products]
    .filter(product => {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      return Date.now() - new Date(product.createdAt).getTime() < oneWeek;
    })
    .slice(0, 3);

  return (
    <div className="pb-20">
      <Carousel />
      
      <section className="mt-16">
        <BrutalTitle mainText="Top Sellers" accentColor="yellow" />
        <div className="grid md:grid-cols-3 gap-6 my-10 px-4">
          {topSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section className="mt-16">
        <BrutalTitle mainText="New Arrivals" accentColor="green" />
        <div className="grid md:grid-cols-3 gap-6 my-10 px-4">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section className="mt-16">
        <BrutalTitle mainText="All Products" accentColor="blue" />
        <div className="grid md:grid-cols-3 gap-6 my-10 px-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}