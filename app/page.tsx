import Carousel from "@/components/Carousel";
import BrutalTitle from "@/components/common/BrutalTitle";
import ProductCard from "@/components/common/ProductCard";
import { getProducts } from "./admin/actions/product";

export default async function Home() {
  const products = await getProducts();
  
  const topSellers = [...products]
    .sort((a, b) => (b.buyerCount || 0) - (a.buyerCount || 0))
    .slice(0, 3);
  
  const newArrivals = [...products]
    .filter(product => {
      const week = 7 * 24 * 60 * 60 * 1000;
      return Date.now() - new Date(product.createdAt).getTime() < week;
    })
    .slice(0, 3);

  return (
    <div className="pb-20">
      <Carousel />
      
      <div className="mt-16">
        <BrutalTitle mainText="Top Sellers" accentColor="yellow" />
        <div className="grid md:grid-cols-3 gap-6 my-10 px-4">
          {topSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      <div className="mt-16">
        <BrutalTitle mainText="New Arrivals" accentColor="green" />
        <div className="grid md:grid-cols-3 gap-6 my-10 px-4">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      <div className="mt-16">
        <BrutalTitle mainText="All Products" accentColor="blue" />
        <div className="grid md:grid-cols-3 gap-6 my-10 px-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}