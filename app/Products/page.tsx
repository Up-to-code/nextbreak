import ProductCard from "@/components/common/ProductCard";
import Filleter from "./Filleter";
import React from "react";

function page() {
  return (
    <div className="max-w-8xl mx-auto">
      <h1 className="text-center text-4xl font-black uppercase tracking-wide my-10">
        Products
      </h1>
      <div className=" flex  gap-10 justify-center ">
        <div className="mt-5">
          <Filleter />
        </div>
        <div className="flex flex-wrap gap-10 justify-center items-center my-10">
          <ProductCard
            product={{
              name: "MINIMALIST CHAIR",
              price: 89,
              id: 1,
              image: "/api/placeholder/500/600?text=Chair+Front",
            }}
          />

        </div>
      </div>
    </div>
  );
}

export default page;
