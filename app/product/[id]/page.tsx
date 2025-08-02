"use client";
import { getProductById } from "../../admin/actions/product";
import { addComment, getComments } from "../../admin/actions/product";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import { useCartStore } from "@/store/cartStore";
import { ProductGallery } from "@/components/product/ProductGallery";
import { useSession } from "next-auth/react";

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

// Remove PageProps interface and use inline type instead
export default function NeoBrutalProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comment states
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const { data: session } = useSession();
  const currentUser = session?.user;
  const router = useRouter();
  const productId = params.productId;
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, commentsData] = await Promise.all([
          getProductById(productId),
          getComments(productId),
        ]);
        
        if (productData) {
          setProduct(productData);
        } else {
          setError("Product not found");
        }
        
        if (commentsData?.success) {
          setComments(commentsData.comments || []);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !currentUser || !productId) return;

    try {
      setSubmittingComment(true);
      setCommentError(null);

      const result = await addComment({
        content: newComment.trim(),
        userId: currentUser.id,
        productId: productId,
      });

      if (result.success && result.comment) {
        setComments([result.comment, ...comments]);
        setNewComment("");
      } else {
        setCommentError(result.error || "Failed to submit comment");
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setCommentError("Failed to submit comment");
    } finally {
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
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 border-2 border-black bg-yellow-400 font-bold"
          >
            TRY AGAIN
          </button>
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
                <div className="mb-4 p-3 border-2 border-red-500 bg-red-100 text-red-700 font-bold">
                  {commentError}
                </div>
              )}

              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-4 border-2 border-black resize-none h-32 font-bold"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-bold text-gray-600">
                    {500 - newComment.length} characters remaining
                  </span>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submittingComment}
                    className={`py-2 px-6 border-2 border-black font-black ${
                      !newComment.trim() || submittingComment
                        ? "bg-gray-300 text-gray-500"
                        : "bg-yellow-400 hover:bg-yellow-300"
                    }`}
                  >
                    {submittingComment ? "POSTING..." : "POST COMMENT"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-8 border-4 border-black p-6 bg-yellow-100 text-center">
              <p className="font-bold text-lg">
                Please log in to leave a comment
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 py-2 px-6 bg-black text-white border-2 border-black font-black"
              >
                LOG IN
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {loadingComments ? (
              <div className="text-center py-8">
                <div className="border-2 border-black p-4 inline-block">
                  <span className="font-bold">LOADING COMMENTS...</span>
                </div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 border-2 border-black p-6">
                <p className="font-bold text-lg">No comments yet!</p>
                <p className="mt-2">
                  Be the first to share your thoughts about this product.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-4 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-lg">
                        {comment.user.name}
                      </h4>
                      <p className="text-sm font-bold text-gray-600">
                        {formatDate(comment.createdAt)}
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
}