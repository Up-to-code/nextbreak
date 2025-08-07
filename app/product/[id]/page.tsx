"use client";
import { getProductById } from "../../../actions/product";
import { addComment, getComments } from "../../../actions/product";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import { useCartStore } from "@/store/cartStore";
import { ProductGallery } from "@/components/product/ProductGallery";
import { useSession } from "next-auth/react";
import Image from "next/image"; // Added for points icon

// Types for comments
interface Comment {
  id: string;
  content: string;
  userId: string;
  productId: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Loading Skeleton Components
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 border-4 border-black"></div>
      
      {/* Product info skeleton */}
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 border-2 border-black"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 border border-black"></div>
          <div className="h-4 bg-gray-200 border border-black w-3/4"></div>
          <div className="h-4 bg-gray-200 border border-black w-1/2"></div>
        </div>
        <div className="h-8 bg-gray-200 border-2 border-black w-32"></div>
        <div className="h-12 bg-gray-200 border-2 border-black"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 border-2 border-black"></div>
          <div className="h-12 bg-gray-200 border-2 border-black"></div>
        </div>
      </div>
    </div>
  </div>
);

const CommentSkeleton = () => (
  <div className="animate-pulse border-4 border-black p-6 bg-gray-50">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="h-6 bg-gray-200 border border-black w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 border border-black w-24"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 border border-black"></div>
      <div className="h-4 bg-gray-200 border border-black w-4/5"></div>
      <div className="h-4 bg-gray-200 border border-black w-3/5"></div>
    </div>
  </div>
);

const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-black border-t-transparent rounded-full animate-spin`}></div>
  );
};

export default function NeoBrutalProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Fixed: Simplified params handling - Next.js params are always objects
  const productId = params.id;
  console.log("🎬 [COMPONENT INIT] NeoBrutalProductPage initialized");
  console.log("📋 [PARAMS] Product ID:", productId);
  
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comment states
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Additional loading states
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const { data: session } = useSession();
  const currentUser = session?.user;
  const router = useRouter();
  const { addToCart } = useCartStore();

  // Calculate points earned for this product
  const pointsEarned = Math.floor((product?.price || 0) * 5) * quantity;

  useEffect(() => {
    const fetchData = async () => {
      console.log("🚀 [FETCH START] Starting data fetch for productId:", productId);
      
      if (!productId) {
        console.log("❌ [FETCH] No product ID available");
        setError("Invalid product ID");
        setLoading(false);
        setLoadingComments(false);
        return;
      }

      try {
        console.log("⏳ [FETCH] Setting loading states to true");
        setLoading(true);
        setLoadingComments(true);
        setError(null);

        console.log("📡 [API CALL] Making parallel requests");
        const startTime = performance.now();
        
        const [productData, commentsData] = await Promise.all([
          getProductById(productId),
          getComments(productId),
        ]);
        
        const endTime = performance.now();
        console.log(`⚡ [API RESPONSE] Requests completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        // Process product data
        if (productData) {
          console.log("✅ [PRODUCT] Setting product data");
          setProduct(productData);
        } else {
          console.log("❌ [PRODUCT] No product data received");
          setError("Product not found");
        }
        
        // Process comments data
        if (commentsData?.success) {
          console.log("✅ [COMMENTS] Setting comments data");
          setComments(commentsData.comments || []);
        } else {
          console.log("❌ [COMMENTS] Failed to load comments");
        }
        
      } catch (err) {
        console.error("💥 [FETCH ERROR] Caught error during data fetch:", err);
        setError("Failed to load product data");
      } finally {
        console.log("🏁 [FETCH END] Setting loading states to false");
        setLoading(false);
        setLoadingComments(false);
      }
    };

    console.log("🎬 [COMPONENT] useEffect triggered with productId:", productId);
    fetchData();
  }, [productId]);

  useEffect(() => {
    console.log("📱 [MOBILE CHECK] Setting up mobile detection");
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 768;
      console.log("📏 [MOBILE CHECK] Window width:", window.innerWidth, "- Mobile:", isMobileNow);
      setIsMobile(isMobileNow);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      console.log("🧹 [CLEANUP] Removing mobile detection listener");
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleAddToCart = async () => {
    console.log("🛒 [ADD TO CART] Function called");

    if (!product || addingToCart) {
      console.log("🚫 [ADD TO CART] Blocked");
      return;
    }

    try {
      console.log("⏳ [ADD TO CART] Setting loading state");
      setAddingToCart(true);
      
      const cartItem = {
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images?.[0] || "",
      };
      
      // Simulate brief loading for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      addToCart(cartItem, quantity);
      
      console.log("✅ [ADD TO CART] Successfully added to cart store");
      setIsAddedToCart(true);
      
      if (navigator.vibrate) {
        console.log("📳 [VIBRATION] Triggering haptic feedback");
        navigator.vibrate(100);
      }
      
      setTimeout(() => {
        console.log("🔄 [TIMER] Resetting success state");
        setIsAddedToCart(false);
      }, 3000);
      
    } catch (err) {
      console.error("💥 [ADD TO CART ERROR] Failed to add to cart:", err);
    } finally {
      console.log("🏁 [ADD TO CART] Resetting loading state");
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || buyingNow) return;
    
    try {
      setBuyingNow(true);
      await handleAddToCart();
      router.push("/checkout");
    } catch (err) {
      console.error("Failed to process buy now:", err);
    } finally {
      setBuyingNow(false);
    }
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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("💬 [COMMENT SUBMIT] Form submitted");

    if (!newComment.trim() || !currentUser || !productId || submittingComment) {
      console.log("🚫 [COMMENT SUBMIT] Validation failed");
      return;
    }

    try {
      console.log("⏳ [COMMENT SUBMIT] Starting submission process");
      setSubmittingComment(true);
      setCommentError(null);

      const commentData = {
        content: newComment.trim(),
        userId: currentUser.id,
        productId: productId,
      };
      
      console.log("📤 [COMMENT API] Sending comment data");
      
      const result = await addComment(commentData);

      if (result.success && result.comment) {
        console.log("✅ [COMMENT SUCCESS] Comment added successfully");
        setComments([result.comment, ...comments]);
        setNewComment("");
      } else {
        console.log("❌ [COMMENT ERROR] Server returned error");
        setCommentError(result.error || "Failed to submit comment");
      }
    } catch (err) {
      console.error("💥 [COMMENT SUBMIT ERROR] Exception caught:", err);
      setCommentError("Something went wrong. Please try again.");
    } finally {
      console.log("🏁 [COMMENT SUBMIT] Resetting submission state");
      setSubmittingComment(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const retryLoad = () => {
    console.log("🔄 [RETRY] User clicked retry button");
    setError(null);
    setLoading(true);
    setLoadingComments(true);
    window.location.reload();
  };

  // Loading state - show skeleton while data is loading
  if (loading) {
    console.log("🎭 [RENDER] Showing loading skeleton");
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto p-3 sm:p-6">
          <ProductSkeleton />
          
          {/* Comments skeleton */}
          <div className="mt-16 border-t-4 border-black pt-8">
            <div className="h-8 bg-gray-200 border-2 border-black w-64 mb-8"></div>
            <div className="space-y-6">
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    console.log("🚨 [RENDER] Showing error state");
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="border-4 border-black p-8 text-center bg-red-100 max-w-md mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black mb-4">OOPS! SOMETHING WENT WRONG</h2>
          <p className="font-bold mb-6 text-gray-700">
            {error === "Product not found" 
              ? "This product doesn't exist or has been removed."
              : "We couldn't load this product right now."}
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={retryLoad}
              className="w-full py-3 px-6 border-4 border-black bg-yellow-400 hover:bg-yellow-300 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              🔄 TRY AGAIN
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 px-6 border-4 border-black bg-white hover:bg-gray-100 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              🏠 GO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
            <Image
                   width={20}
                   height={20}
                   src={"/SAR.svg"}
                   alt="Reward Points"
                   className="border border-gray-300"
                   /> {product.price.toFixed(2)}
            </div>

            {/* Points Earned Section - Added Here */}
            <div className="flex items-center gap-3 bg-yellow-50 border-2 border-black p-3">
            
                <Image 
                  src="/points.jpg" 
                  width={50} 
                  height={50} 
                  alt="Reward Points" 
                  className="border border-gray-300"
                />
             
              <div>
                <p className="font-bold">
                  Earn <span className="text-yellow-700">{pointsEarned} points</span>
                </p>
                <p className="text-sm text-gray-600">
                  (5 point for every 1  <Image
                   width={20}
                   height={20}
                   src={"/SAR.svg"}
                   alt="Reward Points"
                   className="border border-gray-300"
                   /> spent)
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-bold">Quantity:</span>
              <div className="flex items-center border-2 border-black">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={`px-3 py-1 font-bold text-lg transition-colors ${
                    quantity <= 1 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  -
                </button>
                <span className="px-4 font-bold">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= 10}
                  className={`px-3 py-1 font-bold text-lg transition-colors ${
                    quantity >= 10 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
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
                  disabled={isAddedToCart || addingToCart}
                  className={`py-4 px-6 border-4 border-black font-black text-lg tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 ${
                    isAddedToCart
                      ? "bg-green-500 text-white"
                      : addingToCart
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-300 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <LoadingSpinner size="sm" />
                      ADDING...
                    </>
                  ) : isAddedToCart ? (
                    "✓ ADDED TO CART!"
                  ) : (
                    "🛒 ADD TO CART"
                  )}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={buyingNow || addingToCart}
                  className={`py-4 px-6 border-4 border-black font-black text-lg tracking-wider flex items-center justify-center gap-2 transition-all ${
                    buyingNow || addingToCart
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed shadow-[6px_6px_0px_0px_rgba(128,128,128,1)]"
                      : "bg-black text-white shadow-[6px_6px_0px_0px_rgba(255,193,7,1)] hover:bg-gray-800 active:shadow-[3px_3px_0px_0px_rgba(255,193,7,1)] active:translate-x-1 active:translate-y-1"
                  }`}
                >
                  {buyingNow ? (
                    <>
                      <LoadingSpinner size="sm" />
                      PROCESSING...
                    </>
                  ) : (
                    "⚡ BUY NOW"
                  )}
                </button>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full py-3 px-6 border-2 border-black bg-blue-100 hover:bg-blue-200 font-bold transition-colors"
            >
              📤 SHARE THIS PRODUCT
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 border-t-4 border-black pt-8">
          <h2 className="text-3xl font-black text-black mb-8 tracking-wider">
            💬 CUSTOMER COMMENTS ({comments.length})
          </h2>

          {/* Comment Form */}
          {currentUser ? (
            <div className="mb-8 border-4 border-black p-6 bg-gray-50">
              <h3 className="text-xl font-black mb-4">LEAVE A COMMENT</h3>

              {commentError && (
                <div className="mb-4 p-3 border-2 border-red-500 bg-red-100 text-red-700 font-bold flex items-center gap-2">
                  <span>⚠️</span>
                  {commentError}
                </div>
              )}

              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-4 border-2 border-black resize-none h-32 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  maxLength={500}
                  disabled={submittingComment}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-bold text-gray-600">
                    {500 - newComment.length} characters remaining
                  </span>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submittingComment}
                    className={`py-2 px-6 border-2 border-black font-black flex items-center gap-2 transition-all ${
                      !newComment.trim() || submittingComment
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-300 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
                    }`}
                  >
                    {submittingComment ? (
                      <>
                        <LoadingSpinner size="sm" />
                        POSTING...
                      </>
                    ) : (
                      "POST COMMENT"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-8 border-4 border-black p-6 bg-yellow-100 text-center">
              <p className="font-bold text-lg mb-4">
                🔒 Please log in to leave a comment
              </p>
              <button
                onClick={() => router.push("/login")}
                className="py-2 px-6 bg-black text-white border-2 border-black font-black hover:bg-gray-800 transition-colors"
              >
                LOG IN
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {loadingComments ? (
              <div className="space-y-6">
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 border-2 border-black p-6 bg-gray-50">
                <div className="text-6xl mb-4">💭</div>
                <p className="font-black text-xl mb-2">No comments yet!</p>
                <p className="font-bold text-gray-600">
                  Be the first to share your thoughts about this product.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-4 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-lg flex items-center gap-2">
                        👤 {comment.user.name}
                      </h4>
                      <p className="text-sm font-bold text-gray-600">
                        🕒 {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold leading-relaxed">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] z-50">
          <div className="flex justify-between items-center gap-4">
            <div className="text-xl font-black">
            <Image
                   width={20}
                   height={20}
                   src={"/SAR.svg"}
                   alt="Reward Points"
                   className="border border-gray-300"
                   /> {product.price.toFixed(2)}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAddedToCart || addingToCart}
              className={`py-3 px-6 border-4 border-black font-black flex items-center gap-2 transition-all ${
                isAddedToCart 
                  ? "bg-green-500 text-white" 
                  : addingToCart
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-300"
              }`}
            >
              {addingToCart ? (
                <>
                  <LoadingSpinner size="sm" />
                  ADDING...
                </>
              ) : isAddedToCart ? (
                "✓ ADDED"
              ) : (
                "ADD TO CART"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}