import Carousel from "@/components/Carousel";
import BrutalTitle from "@/components/common/BrutalTitle";
import ProductCard from "@/components/common/ProductCard";
import SignInDialog from "@/components/SignInDialog";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import Image from "next/image";
 const products = [
  {
    id: 1,
    name: "React Masterclass",
    price: 199,
    image: "/react-course.jpg",
  },
  {
    id: 2,
    name: "React Masterclass",
    price: 199,
    image: "/react-course.jpg",
  },
  {
    id: 3,
    name: "React Masterclass",
    price: 199,
    image: "/react-course.jpg",
  },
];
export default function Home() {
  return (
    <div>



      <Carousel />
      {/* <ProductFilter /> */}
      <BrutalTitle
        mainText="Top Sellers"
        accentColor="yellow"
        borderSize="sm"
      />
      <div className="flex flex-wrap gap-10 justify-center items-center my-10">
        <ProductCard product={products[0]}/>
        <ProductCard product={products[1]}/>
        <ProductCard product={products[2]}/>
      </div>
            {/* <ProductFilter /> */}
            <BrutalTitle
        mainText="Top Sellers"
        accentColor="yellow"
        borderSize="sm"
      />
      <div className="flex flex-wrap gap-10 justify-center items-center my-10">
        <ProductCard product={products[0]}/>
        <ProductCard product={products[1]}/>
        <ProductCard product={products[2]}/>
      </div>
      
    </div>
  );
}
