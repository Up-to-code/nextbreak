import Carousel from "@/components/Carousel";
import BrutalTitle from "@/components/common/BrutalTitle";
import ProductCard from "@/components/common/ProductCard";
 import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Carousel />
      {/* <ProductFilter /> */}
      <BrutalTitle mainText="Top Sellers" accentColor="yellow" borderSize="sm" />
      <div className="flex flex-wrap gap-10 justify-center items-center my-10">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}
