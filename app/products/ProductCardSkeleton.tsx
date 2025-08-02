// components/common/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
    return (
      <div className="bg-white border-2 border-black shadow-brutal-sm p-4 animate-pulse">
        <div className="aspect-square bg-gray-200 mb-4"></div>
        <div className="h-4 bg-gray-200 mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 mb-4 w-1/2"></div>
        <div className="h-6 bg-gray-200 w-1/3"></div>
      </div>
    );
  }