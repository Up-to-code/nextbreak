import ProductCard from "@/components/common/ProductCard";
import Filleter from "./Filleter";
import React from "react";

function page() {
  return (
    <div className="max-w-8xl mx-auto">
      <h1 className="text-center text-4xl font-black uppercase tracking-wide my-10">Products</h1>
      <div className=" flex  gap-10 justify-center ">
        <div className="mt-5">
          <Filleter />
        </div>
        <div className="flex flex-wrap gap-10 justify-center items-center my-10">
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </div>
  );
}

export default page;
