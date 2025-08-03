import ProductCardSkeleton from "./ProductCardSkeleton";

// Loading component that matches your design system
export default function  ProductsLoading() {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <div className="h-16 w-64 mx-auto bg-gray-200 mb-2"></div>
          <div className="h-4 w-48 mx-auto bg-gray-200"></div>
        </div>
        
        {/* Search Bar Skeleton */}
        <div className="mb-8 max-w-xl mx-auto">
          <div className="h-14 bg-gray-200 border-2 border-black shadow-brutal-sm"></div>
        </div>
        
        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  