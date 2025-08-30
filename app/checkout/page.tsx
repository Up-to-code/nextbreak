"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, Loader2, UserIcon, Gift } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/layout/AuthDialog";
import { createOrder } from "@/actions/order";
import { getUserData, updateUserPoints } from "@/actions/actions";
import Image from "next/image";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCartStore();

  const [isPending, setIsPending] = useState(false);
  const [authDialog, setAuthDialog] = useState<"signin" | "signup" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pointsChoice, setPointsChoice] = useState<"use" | "save">("save");
  const [userPoints, setUserPoints] = useState(0);

  // Fetch user points when session changes
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (session?.user?.id) {
        try {
          const user = await getUserData(session.user.id);
          setUserPoints(user?.points || 0);
        } catch (error) {
          console.error('Failed to fetch user points', error);
          setUserPoints(0);
        }
      } else {
        setUserPoints(0);
      }
    };

    fetchUserPoints();
  }, [session]);

  // Calculate points earned (1 SAR = 5 points)
  const pointsEarned = Math.floor(totalPrice() * 5);
  
  // NEW DISCOUNT LOGIC: ALWAYS DEDUCT 250 POINTS
  let discountAmount = 0;
  let pointsUsed = 0;
  
  if (pointsChoice === "use" && userPoints >= 250) {
    // خصم 250 نقطة دائماً
    pointsUsed = 250;
    
    // حساب الخصم الأقصى المسموح (25% من قيمة الطلب)
    const maxDiscountByPercentage = totalPrice() * 0.25;
    
    // الخصم الأساسي (50 ريال مقابل 250 نقطة)
    const baseDiscount = 50;
    
    // الخصم الفعلي (محدود بـ 25% أو قيمة الطلب الكاملة)
    discountAmount = Math.min(baseDiscount, maxDiscountByPercentage, totalPrice());
    
    // ملاحظة: سيتم خصم 250 نقطة حتى لو كان الخصم أقل من 50 ريال
  }
  
  const finalTotal = Math.max(0, totalPrice() - discountAmount);

  const handleSubmitOrder = async () => {
    if (!session?.user?.id) {
      setAuthDialog("signin");
      return;
    }

    // Prevent order if trying to use points but insufficient
    if (pointsChoice === "use" && userPoints < 250) {
      setErrorMessage("You need at least 250 points to redeem");
      return;
    }

    setErrorMessage("");
    setIsPending(true);

    try {
      // Prepare order items
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      }));

      // Create order
      const result = await createOrder({
        userId: session.user.id,
        items: orderItems,
        totalPrice: finalTotal,
        discount: discountAmount,
        pointsUsed: pointsUsed,
        pointsEarned,
        paymentMethod: "Cash on Delivery",
        originalPrice: totalPrice(),
      });

      if (result.success && result.order?.id) {
        // Calculate new points balance
        const newPointsBalance = userPoints - pointsUsed + pointsEarned;
        
        try {
          // Prevent negative points balance
          if (newPointsBalance >= 0) {
            await updateUserPoints(session.user.id, newPointsBalance);
            setUserPoints(newPointsBalance);
          } else {
            console.error("Negative points balance prevented:", newPointsBalance);
            setErrorMessage("Order placed, but points update failed. Contact support.");
          }
          
          clearCart();
          router.push(`/order-confirmation/${result.order.id}`);
        } catch (error) {
          console.error('Failed to update points', error);
          setErrorMessage("Order placed, but failed to update points. Contact support.");
        }
      } else {
        setErrorMessage(result.error || "Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white border-4 border-black p-6 sm:p-10 text-center max-w-md w-full mx-4">
          <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🛒</div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 uppercase">CART IS EMPTY</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 font-bold">GO SHOP NOW!</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-black text-white text-lg sm:text-xl font-black px-6 sm:px-8 py-3 sm:py-4 border-4 border-black hover:bg-gray-800 transition-all uppercase w-full sm:w-auto"
          >
            START SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:py-8 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl font-black mb-3 sm:mb-4 uppercase">CHECKOUT</h1>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border-4 border-red-500 p-3 sm:p-4 mb-6 sm:mb-8">
            <p className="font-black text-lg sm:text-xl uppercase text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Auth Warning */}
        {!session && (
          <div className="bg-yellow-100 border-4 border-yellow-500 p-4 sm:p-6 mb-6 sm:mb-8 text-center">
            <UserIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
            <h3 className="font-black text-xl sm:text-2xl mb-3 sm:mb-4 uppercase">SIGN IN REQUIRED!</h3>
            <button
              onClick={() => setAuthDialog("signin")}
              className="bg-black text-white font-black px-5 sm:px-6 py-2 sm:py-3 border-4 border-black hover:bg-gray-800 transition-all uppercase w-full sm:w-auto"
            >
              SIGN IN NOW
            </button>
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          
          {/* Cart Items */}
          <div className="bg-white border-4 border-black p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h2 className="text-2xl sm:text-3xl font-black uppercase">YOUR ITEMS</h2>
              <div className="bg-gray-100 border-2 border-black px-3 sm:px-4 py-1 sm:py-2 font-black text-lg sm:text-xl self-start sm:self-auto">
                {totalItems()} ITEMS
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 border-2 border-black p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover border-2 border-black self-center sm:self-auto"
                      />
                    )}

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-black text-base sm:text-lg uppercase">{item.name}</h3>
                      <div className="flex items-center justify-center sm:justify-start text-base sm:text-lg font-bold mt-1">
                        <Image width={16} height={16} src={"/SAR.svg"} alt="SAR" className="mr-1" />
                        {item.price.toFixed(2)} EACH
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-center bg-white border-2 border-black self-center">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-8 sm:w-10 sm:h-10 border-r-2 border-black hover:bg-gray-100 flex items-center justify-center font-black"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-12 sm:w-16 text-center font-black text-base sm:text-lg border-0 focus:ring-0"
                        min="1"
                      />
                      
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 sm:w-10 sm:h-10 border-l-2 border-black hover:bg-gray-100 flex items-center justify-center font-black"
                      >
                        <Plus size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-2">
                      <div className="flex items-center font-black text-lg sm:text-xl">
                        <Image width={16} height={16} src={"/SAR.svg"} alt="SAR" className="mr-1" />
                        {(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 sm:p-2 border-2 border-black"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points Section */}
          {session && (
            <div className="bg-white border-4 border-black p-4 sm:p-6">
              <h3 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 uppercase flex items-center justify-center sm:justify-start">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
                YOUR POINTS
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-100 border-2 border-black p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black">{userPoints}</div>
                  <div className="text-base sm:text-lg font-black uppercase">CURRENT POINTS</div>
                </div>
                
                <div className="bg-gray-100 border-2 border-black p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black">+{pointsEarned}</div>
                  <div className="text-base sm:text-lg font-black uppercase">POINTS TO EARN</div>
                </div>
              </div>
              
              {/* POINTS REDEMPTION */}
              {userPoints >= 250 ? (
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={() => setPointsChoice("use")}
                    className={`w-full p-3 sm:p-4 border-4 border-black font-black text-left transition-all ${
                      pointsChoice === "use" 
                        ? "bg-green-200 ring-4 ring-green-500" 
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1">
                        <div className="text-lg sm:text-xl uppercase">REDEEM POINTS</div>
                        <div className="text-base sm:text-lg">
                          GET {Math.min(50, Math.floor(totalPrice() * 0.25), totalPrice())} SAR OFF
                          <span className="text-red-600 text-sm">
                            {totalPrice() * 0.25 < 50 ? ` (LIMITED BY 25% CAP)` : ` (UP TO 50 SAR)`}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm mt-1 font-bold">
                          • 250 points will ALWAYS be deducted
                          <br />
                          • Discount: {Math.min(50, Math.floor(totalPrice() * 0.25), totalPrice())} SAR (capped at 25% = {Math.floor(totalPrice() * 0.25)} SAR)
                          <br />
                          {userPoints > 250 && `• Your remaining points: ${userPoints - 250}`}
                        </div>
                      </div>
                      {pointsChoice === "use" && (
                        <div className="bg-black text-white px-2 sm:px-3 py-1 text-base sm:text-lg font-black mt-2 sm:mt-0 self-center">
                          SELECTED
                        </div>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPointsChoice("save")}
                    className={`w-full p-3 sm:p-4 border-4 border-black font-black text-left transition-all ${
                      pointsChoice === "save" 
                        ? "bg-blue-200 ring-4 ring-blue-500" 
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1">
                        <div className="text-lg sm:text-xl uppercase">SAVE POINTS</div>
                        <div className="text-base sm:text-lg">SAVE FOR ANOTHER TIME</div>
                        <div className="text-xs sm:text-sm mt-1 font-bold">
                          • Keep your {userPoints} points + earn {pointsEarned} more
                          <br />
                          • Total after order: {userPoints + pointsEarned} points
                        </div>
                      </div>
                      {pointsChoice === "save" && (
                        <div className="bg-black text-white px-2 sm:px-3 py-1 text-base sm:text-lg font-black mt-2 sm:mt-0 self-center">
                          SELECTED
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              ) : (
                // INSUFFICIENT POINTS MESSAGE
                <div className="bg-yellow-100 border-4 border-yellow-500 p-3 sm:p-4 text-center">
                  <p className="font-black text-lg sm:text-xl uppercase mb-2">
                    {userPoints > 0 
                      ? `NEED ${250 - userPoints} MORE POINTS TO REDEEM` 
                      : "START EARNING POINTS TODAY!"}
                  </p>
                  <div className="mt-2 text-sm sm:text-lg font-bold flex flex-col gap-1">
                    <span>• 250 points required for redemption</span>
                    <span>• 250 points will ALWAYS be deducted (no partial redemption)</span>
                    <span>• Discount varies from 1 to 50 SAR (capped at 25% of order)</span>
                    <span className="mt-2 text-green-700 font-black">
                      EARN {pointsEarned} POINTS WITH THIS ORDER!
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white border-4 border-black p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 uppercase">ORDER TOTAL</h2>

            {/* User Info */}
            {session && (
              <div className="bg-gray-100 border-2 border-black p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center">
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <div>
                    <div className="font-black text-base sm:text-lg uppercase">{session.user?.name}</div>
                    <div className="font-bold text-sm sm:text-base">
                      {userPoints} POINTS • +{pointsEarned} EARNED
                      {pointsChoice === "use" && pointsUsed > 0 && (
                        <span className="text-red-600"> • -{pointsUsed} USED</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex justify-between text-xl sm:text-2xl font-black">
                <span>SUBTOTAL</span>
                <div className="flex items-center">
                  <Image width={18} height={18} src={"/SAR.svg"} alt="SAR" className="mr-1" />
                  {totalPrice().toFixed(2)}
                </div>
              </div>
              
              {/* Show discount only if applied (250+ points used) */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-xl sm:text-2xl font-black text-green-600">
                  <span>POINTS DISCOUNT</span>
                  <div className="flex items-center">
                    <Image width={18} height={18} src={"/SAR.svg"} alt="SAR" className="mr-1" />
                    -{discountAmount.toFixed(2)}
                    <span className="text-xs sm:text-sm ml-1 sm:ml-2">(250 points deducted)</span>
                  </div>
                </div>
              )}
              
              <div className="border-t-4 border-black pt-3 sm:pt-4">
                <div className="flex justify-between text-2xl sm:text-4xl font-black">
                  <span>TOTAL</span>
                  <div className="flex items-center">
                    <Image width={22} height={22} className="sm:w-7 sm:h-7 mr-1 sm:mr-2" src={"/SAR.svg"} alt="SAR" />
                    {finalTotal.toFixed(2)}
                  </div>
                </div>
                
                {/* Special free order message */}
                {finalTotal === 0 && (
                  <div className="text-center mt-3 sm:mt-4 bg-green-100 border-2 border-green-500 p-3 sm:p-4">
                    <p className="text-xl sm:text-2xl font-black uppercase text-green-800">FREE ORDER!</p>
                    <p className="text-xs sm:text-sm font-bold mt-1 sm:mt-2">250 points will still be deducted</p>
                  </div>
                )}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isPending || (pointsChoice === "use" && userPoints < 250)}
              className={`w-full py-4 sm:py-6 font-black text-xl sm:text-2xl transition-all border-4 border-black uppercase ${
                isPending || (pointsChoice === "use" && userPoints < 250)
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500"
              }`}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  PROCESSING...
                </div>
              ) : pointsChoice === "use" && userPoints < 250 ? (
                "INSUFFICIENT POINTS"
              ) : (
                <div className="flex items-center justify-center">
                  {finalTotal === 0 ? "CLAIM FREE ORDER" : "PLACE ORDER"}
                  {finalTotal > 0 && (
                    <>
                      <Image width={20} height={20} className="ml-2 sm:ml-3 sm:w-6 sm:h-6" src={"/SAR.svg"} alt="SAR" />
                      {finalTotal.toFixed(2)}
                    </>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      {authDialog && (
        <AuthDialog
          mode={authDialog}
          onClose={() => setAuthDialog(null)}
          onSwitchMode={() =>
            setAuthDialog(authDialog === "signin" ? "signup" : "signin")
          }
        />
      )}
    </div>
  );
};

export default CheckoutPage;