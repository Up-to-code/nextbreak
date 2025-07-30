import Carousel from "@/components/Carousel";
import BrutalTitle from "@/components/common/BrutalTitle";
import ProductCard from "@/components/common/ProductCard";
import SignInDialog from "@/components/SignInDialog";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <WhatsAppButton />

      <SignInDialog />
      <button className="px-6 py-3 bg-white text-black border-4 border-black uppercase font-bold hover:bg-black hover:text-white transition-all">
        Outline
      </button>

      <button className="px-6 py-3 bg-yellow-300 text-black border-4 border-black uppercase font-bold hover:bg-yellow-400 transition-all">
  Secondary
</button>

<button className="px-6 py-3 bg-black text-white border-4 border-black uppercase font-bold hover:bg-white hover:text-black transition-all">
  Primary
</button>
<button className="px-6 py-3 bg-transparent text-black border-4 border-black uppercase font-bold hover:bg-black hover:text-white transition-all">
  Ghost
</button>

<button className="w-full px-6 py-4 bg-green-500 text-white border-4 border-black uppercase font-bold text-lg hover:bg-green-600 transition-all">
  Contact Us on WhatsApp
</button>


      <Carousel />
      {/* <ProductFilter /> */}
      <BrutalTitle
        mainText="Top Sellers"
        accentColor="yellow"
        borderSize="sm"
      />
      <div className="flex flex-wrap gap-10 justify-center items-center my-10">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}
