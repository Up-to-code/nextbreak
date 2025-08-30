"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  User as UserIcon,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useCartStore, type CartItem } from "@/store/cartStore";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { AuthDialog } from "./AuthDialog";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface LoadingStates {
  cart: boolean;
  signOut: boolean;
  checkout: boolean;
  cartItemOperations: Record<number, boolean>;
}

function NavBar(): JSX.Element | null {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [authDialog, setAuthDialog] = useState<"signin" | "signup" | null>(null);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    cart: false,
    signOut: false,
    checkout: false,
    cartItemOperations: {},
  });

  // Animation states
  const [isCartAnimating, setIsCartAnimating] = useState<boolean>(false);
  const [lastCartCount, setLastCartCount] = useState<number>(0);

  const { data: session } = useSession();
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCartButtonRef = useRef<HTMLButtonElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Cart functions
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();

  // Animation effect when cart items change
  useEffect(() => {
    const currentCount = totalItems();
    
    if (currentCount > lastCartCount) {
      setIsCartAnimating(true);
      
      const timer = setTimeout(() => {
        setIsCartAnimating(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
    
    setLastCartCount(currentCount);
  }, [totalItems(), lastCartCount]);

  // Menu links
  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
    { name: "Policies", href: "/policies" },
  ];

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsProfileDropdownOpen(false);
    document.body.style.overflow = "";
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        isCartOpen &&
        !cartButtonRef.current?.contains(target) &&
        !mobileCartButtonRef.current?.contains(target) &&
        !document.querySelector(".cart-dropdown")?.contains(target) &&
        !document.querySelector(".mobile-cart")?.contains(target)
      ) {
        setIsCartOpen(false);
        document.body.style.overflow = "";
      }

      if (
        isProfileDropdownOpen &&
        !profileButtonRef.current?.contains(target) &&
        !document.querySelector(".profile-dropdown")?.contains(target)
      ) {
        setIsProfileDropdownOpen(false);
      }

      if (
        isMobileMenuOpen &&
        !mobileMenuButtonRef.current?.contains(target) &&
        !document.querySelector(".mobile-menu")?.contains(target)
      ) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, isProfileDropdownOpen, isMobileMenuOpen]);

  // Close menus on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAllMenus();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeAllMenus]);

  // Toggle functions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? "hidden" : "";
      return newState;
    });
    setIsCartOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? "hidden" : "";
      return newState;
    });
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
  };

  // Auth handlers
  const handleAuthDialog = (mode: "signin" | "signup") => {
    setAuthDialog(mode);
    closeAllMenus();
  };

  // Cart actions
  const handleCartAction = async (
    action: () => Promise<void> | void,
    itemId?: number
  ) => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        cart: !itemId,
        cartItemOperations: itemId
          ? { ...prev.cartItemOperations, [itemId]: true }
          : prev.cartItemOperations,
      }));
      await action();
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        cart: false,
        cartItemOperations: itemId
          ? { ...prev.cartItemOperations, [itemId]: false }
          : prev.cartItemOperations,
      }));
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, signOut: true }));
      await signOut();
      closeAllMenus();
    } finally {
      setLoadingStates((prev) => ({ ...prev, signOut: false }));
    }
  };

  // Fixed checkout handler - allows checkout for both logged in and guest users
  const handleCheckout = () => {
    setLoadingStates((prev) => ({ ...prev, checkout: true }));
    
    // Close cart and restore scroll
    setIsCartOpen(false);
    document.body.style.overflow = "";
    
    // Navigate to checkout regardless of login status
    // The checkout page will handle authentication if needed
    requestAnimationFrame(() => {
      router.push("/checkout");
      setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, checkout: false }));
      }, 300);
    });
  };

  // Helper functions
  const truncateName = (name: string, maxLength: number = 20): string =>
    name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;

  // Cart item component
  const CartItem = ({ item }: { item: CartItem }) => {
    const isLoading = loadingStates.cartItemOperations[item.id] || false;
    
    return (
      <li className="border-b-4 border-black p-3 hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold uppercase text-sm">
              {truncateName(item.name)}
            </h3>
            <p className="font-bold text-green-600 flex items-center gap-1">
              <Image
                width={20}
                height={20}
                src="/SAR.svg"
                alt="SAR Currency"
                className="border border-gray-300"
              /> 
              {item.price.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() =>
              handleCartAction(() => removeFromCart(item.id), item.id)
            }
            disabled={isLoading}
            className="w-6 h-6 bg-red-600 text-white flex items-center justify-center border-2 border-black hover:bg-red-700 transition-colors ml-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            aria-label={`Remove ${item.name}`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-3 w-3" />
            ) : (
              <X size={14} />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() =>
                handleCartAction(() => decreaseQuantity(item.id), item.id)
              }
              disabled={isLoading || item.quantity <= 1}
              className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                isLoading || item.quantity <= 1
                  ? "bg-gray-400 cursor-not-allowed text-gray-600"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              aria-label="Decrease quantity"
            >
              {isLoading ? <Loader2 className="animate-spin h-3 w-3" /> : "-"}
            </button>
            <span className="mx-3 font-bold min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                handleCartAction(() => increaseQuantity(item.id), item.id)
              }
              disabled={isLoading}
              className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              aria-label="Increase quantity"
            >
              {isLoading ? <Loader2 className="animate-spin h-3 w-3" /> : "+"}
            </button>
          </div>
          <span className="font-extrabold text-lg flex items-center gap-1">
            <Image
              width={20}
              height={20}
              src="/SAR.svg"
              alt="SAR Currency"
              className="border border-gray-300"
            /> 
            {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </li>
    );
  };

  // Don't render navbar on admin pages
  if (pathname.includes("/admin")) {
    return null;
  }

  return (
    <nav className="bg-white text-black h-[80px] border-b-4 border-black sticky top-0 z-50 shadow-[0_4px_0_0_#000]">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo and Desktop Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:no-underline focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
            >
              <Image 
                src="/logo.png" 
                alt="logo" 
                width={150} 
                height={150} 
                className="-mt-4"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="uppercase font-bold hover:text-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded px-2 py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Desktop Cart */}
            <div className="relative">
              <button
                ref={cartButtonRef}
                onClick={toggleCart}
                disabled={loadingStates.cart}
                className={`relative p-3 border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCartAnimating ? 'animate-bounce' : ''
                }`}
                aria-label={`Shopping Cart (${totalItems()} items)`}
                aria-expanded={isCartOpen}
              >
                {loadingStates.cart ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  <>
                    <ShoppingCart size={24} />
                    {totalItems() > 0 && (
                      <span className={`absolute -top-2 -right-2 bg-red-600 text-white text-xs font-extrabold w-6 h-6 flex items-center justify-center border-2 border-black animate-pulse transition-transform ${
                        isCartAnimating ? 'scale-110' : ''
                      }`}>
                        {totalItems()}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Desktop Cart Dropdown */}
              {isCartOpen && (
                <div className="cart-dropdown absolute right-0 mt-2 w-96 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] z-50">
                  <div className="p-4 border-b-4 border-black bg-yellow-400">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-extrabold uppercase">
                        Your Cart ({totalItems()})
                      </h2>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-6 h-6 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        aria-label="Close Cart"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-lg font-bold mb-2">YOUR CART IS EMPTY</p>
                        <p className="text-sm text-gray-600 mb-4">
                          Add some courses to get started!
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="bg-black text-white px-6 py-2 font-extrabold uppercase border-4 border-white hover:bg-red-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          Browse Courses
                        </button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <ul className="space-y-4">
                          {cartItems.map((item) => (
                            <CartItem key={item.id} item={item} />
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="p-4 bg-yellow-400 border-t-4 border-black">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-extrabold uppercase">Total:</span>
                        <span className="font-extrabold text-xl text-green-600 flex items-center gap-1">
                          <Image
                            width={20}
                            height={20}
                            src="/SAR.svg"
                            alt="SAR Currency"
                            className="border border-gray-300"
                          /> 
                          {totalPrice().toFixed(2)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleCartAction(clearCart)}
                          disabled={loadingStates.cart}
                          className="bg-red-600 text-white py-2 font-extrabold uppercase border-4 border-white hover:bg-red-700 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                        >
                          {loadingStates.cart ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                            "Clear All"
                          )}
                        </button>
                        <button
                          onClick={handleCheckout}
                          disabled={loadingStates.checkout || cartItems.length === 0}
                          className="bg-black text-white py-2 font-extrabold uppercase border-4 border-white hover:bg-green-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 w-full"
                          title={!session ? "Continue as guest or sign in on checkout page" : "Proceed to checkout"}
                        >
                          {loadingStates.checkout ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                            "Checkout"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Auth */}
            {session ? (
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={toggleProfileDropdown}
                  aria-expanded={isProfileDropdownOpen}
                  aria-controls="profile-dropdown"
                  aria-haspopup="true"
                  className="flex items-center space-x-2 bg-black text-white px-4 py-2 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <UserIcon size={18} />
                  <span className="hidden sm:inline">Account</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div
                    id="profile-dropdown"
                    className="profile-dropdown absolute right-0 mt-2 w-64 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] z-50"
                  >
                    <div className="p-4 border-b-4 border-black bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-black">
                          <UserIcon size={18} className="text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">
                            {truncateName(session.user?.name || "User", 15)}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 font-bold hover:bg-yellow-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 font-bold hover:bg-yellow-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <hr className="border-gray-200 my-1" />
                      <button
                        onClick={handleSignOut}
                        disabled={loadingStates.signOut}
                        className="w-full text-left px-4 py-2 font-bold hover:bg-red-100 rounded flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                      >
                        {loadingStates.signOut ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                          "Sign Out"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleAuthDialog("signin")}
                  className="text-black px-6 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  onClick={() => handleAuthDialog("signup")}
                  className="bg-black text-white px-6 py-3 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Button */}
            <button
              ref={mobileCartButtonRef}
              onClick={toggleCart}
              disabled={loadingStates.cart}
              className={`relative w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 transition-all ${
                isCartAnimating ? 'animate-bounce' : ''
              }`}
              aria-label={`Shopping Cart (${totalItems()} items)`}
              aria-expanded={isCartOpen}
            >
              {loadingStates.cart ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <ShoppingCart size={20} />
                  {totalItems() > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs font-extrabold w-5 h-5 flex items-center justify-center border-2 border-black animate-pulse transition-transform ${
                      isCartAnimating ? 'scale-110' : ''
                    }`}>
                      {totalItems()}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              ref={mobileMenuButtonRef}
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cart Overlay */}
      {isCartOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => {
              setIsCartOpen(false);
              document.body.style.overflow = "";
            }}
          />
          
          {/* Mobile Cart Panel - MODIFIED: Removed top border and changed header background */}
          <div className="mobile-cart fixed inset-x-0 top-0 bottom-0 bg-white z-40 flex flex-col border-r-4 border-b-4 border-l-4 border-black transform transition-transform duration-300 ease-out">
            {/* Cart Header - CHANGED: White background instead of yellow */}
            <div className="p-4 border-b-4 border-black bg-white flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold uppercase">
                  Your Cart ({totalItems()})
                </h2>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    document.body.style.overflow = "";
                  }}
                  className="w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-label="Close Cart"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <ShoppingCart size={48} className="text-gray-400 mb-4" />
                  <p className="text-lg font-bold mb-2">YOUR CART IS EMPTY</p>
                  <p className="text-gray-600 mb-6">
                    Add some courses to get started!
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      document.body.style.overflow = "";
                      router.push("/products");
                    }}
                    className="bg-black text-white px-6 py-3 font-extrabold uppercase border-4 border-white hover:bg-red-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Cart Footer - Always visible when items exist */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-yellow-400 border-t-4 border-black flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-extrabold uppercase text-lg">Total:</span>
                  <span className="font-extrabold text-xl text-green-600 flex items-center gap-1">
                    <Image
                      width={24}
                      height={24}
                      src="/SAR.svg"
                      alt="SAR Currency"
                      className="border border-gray-300"
                    /> 
                    {totalPrice().toFixed(2)}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    disabled={loadingStates.checkout || cartItems.length === 0}
                    className="w-full bg-black text-white py-4 font-extrabold uppercase text-lg border-4 border-white hover:bg-green-600 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                    title={!session ? "Continue as guest or sign in on checkout page" : "Proceed to checkout"}
                  >
                    {loadingStates.checkout ? (
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    ) : (
                      !session ? "CHECKOUT AS GUEST" : "PROCEED TO CHECKOUT"
                    )}
                  </button>
                  <button
                    onClick={() => handleCartAction(clearCart)}
                    disabled={loadingStates.cart}
                    className="w-full bg-red-600 text-white py-3 font-extrabold uppercase border-4 border-white hover:bg-red-700 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                  >
                    {loadingStates.cart ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      "Clear All"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="mobile-menu md:hidden fixed inset-0 top-[80px] bg-white z-40 overflow-y-auto"
        >
          <div className="px-4 py-6">
            {session && (
              <div className="flex items-center space-x-3 mb-6 p-4 bg-yellow-100 border-4 border-black shadow-[4px_4px_0_0_#000]">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-black">
                  <UserIcon size={24} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAllMenus}
                  className="block text-black bg-yellow-300 px-5 py-4 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:bg-yellow-400 hover:shadow-[6px_6px_0_0_#000] transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {link.name}
                </Link>
              ))}

              {session && (
                <>
                  <Link
                    href="/profile"
                    onClick={closeAllMenus}
                    className="block text-black bg-yellow-300 px-5 py-4 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:bg-yellow-400 hover:shadow-[6px_6px_0_0_#000] transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    onClick={closeAllMenus}
                    className="block text-black bg-yellow-300 px-5 py-4 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:bg-yellow-400 hover:shadow-[6px_6px_0_0_#000] transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={loadingStates.signOut}
                    className="w-full text-left text-white bg-red-600 px-5 py-4 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:bg-red-700 hover:shadow-[6px_6px_0_0_#000] transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center disabled:opacity-50"
                  >
                    {loadingStates.signOut ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      "Sign Out"
                    )}
                  </button>
                </>
              )}
            </div>

            {!session && (
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleAuthDialog("signin")}
                  className="text-black px-6 py-4 font-extrabold uppercase border-4 border-black bg-white shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-label="Sign In"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthDialog("signup")}
                  className="bg-black text-white px-6 py-4 font-extrabold uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-label="Sign Up"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
    </nav>
  );
}

export default NavBar;