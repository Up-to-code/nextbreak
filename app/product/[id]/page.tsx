"use client";
import { getProductById } from "../../admin/actions/product";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import { useCartStore } from "@/store/cartStore";
import { ProductGallery } from "@/components/product/ProductGallery";

const NeoBrutalProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(
      {
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images?.[0] || "",
      },
      quantity
    );

    setIsAddedToCart(true);
    if (navigator.vibrate) navigator.vibrate(100);
    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const incrementQuantity = () => quantity < 10 && setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.title,
          text: `Check out this product: ${product?.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      console.error("Sharing failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="border-4 border-black p-8 text-center">
          <h2 className="text-2xl font-bold">LOADING PRODUCT...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="border-4 border-black p-8 text-center bg-red-100">
          <h2 className="text-2xl font-bold">ERROR</h2>
          <p className="mt-2">{error || "Product not available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          {/* Product Gallery */}
          <ProductGallery images={product.images} productName={product.title} />

          {/* Product Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-wider">
                {product.title}
              </h1>


              <p className="text-lg font-bold text-black leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="text-3xl font-black text-black">
              SAR {product.price.toFixed(2)}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-bold">Quantity:</span>
              <div className="flex items-center border-2 border-black">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-1 bg-gray-200 font-bold text-lg"
                >
                  -
                </button>
                <span className="px-4 font-bold">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-1 bg-gray-200 font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddedToCart}
                  className={`py-4 px-6 border-4 border-black font-black text-lg tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                    isAddedToCart
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 hover:bg-yellow-300"
                  }`}
                >
                  {isAddedToCart ? "✓ ADDED TO CART!" : "🛒 ADD TO CART"}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-4 px-6 bg-black text-white border-4 border-black font-black text-lg tracking-wider shadow-[6px_6px_0px_0px_rgba(255,193,7,1)]"
                >
                  ⚡ BUY NOW
                </button>
              </div>

 
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 shadow-[0_-4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center">
            <div className="text-xl font-black">
              SAR {product.price.toFixed(2)}
            </div>
            <button
              onClick={handleAddToCart}
              className={`py-3 px-6 border-4 border-black font-black ${
                isAddedToCart ? "bg-green-500 text-white" : "bg-yellow-400"
              }`}
            >
              {isAddedToCart ? "✓ ADDED" : "ADD TO CART"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeoBrutalProductPage;
