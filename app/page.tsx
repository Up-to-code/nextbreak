import Carousel from "@/components/Carousel";
import BrutalTitle from "@/components/common/BrutalTitle";
import ProductCard from "@/components/common/ProductCard";
import { getProducts } from "./admin/actions/product";

export default async function Home() {
  const products = await getProducts();
  
  // Sort products by buyer count (top sellers)
  const topSellers = [...products]
    .sort((a, b) => b.buyerCount - a.buyerCount)
    .slice(0, 3);
  
  // Get newest products (created within last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const newArrivals = [...products]
    .filter(product => new Date(product.createdAt) > oneWeekAgo)
    .slice(0, 3);

  return (
    <div className="pb-20">
      <Carousel />
      
      {/* Top Sellers Section */}
      <div className="mt-16">
        <BrutalTitle
          mainText="Top Sellers"
          accentColor="yellow"
          borderSize="sm"
        />
        <div className="flex flex-wrap gap-10 justify-center items-center my-10">
          {topSellers.length > 0 ? (
            topSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full py-10">
              No top sellers yet
            </p>
          )}
        </div>
      </div>
      
      {/* New Arrivals Section */}
      <div className="mt-16">
        <BrutalTitle
          mainText="New Arrivals"
          accentColor="green"
          borderSize="sm"
        />
        <div className="flex flex-wrap gap-10 justify-center items-center my-10">
          {newArrivals.length > 0 ? (
            newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full py-10">
              No new arrivals this week
            </p>
          )}
        </div>
      </div>
      
      {/* All Products Section */}
      <div className="mt-16">
        <BrutalTitle
          mainText="Browse All Products"
          accentColor="blue"
          borderSize="sm"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center items-center my-10 px-4">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full py-10 col-span-3">
              No products available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}