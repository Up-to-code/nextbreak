'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import BrutalTitle from "@/components/common/BrutalTitle";
import ProductCard from "@/components/common/ProductCard";
import { getProducts } from "@/actions/product";
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Product {
  id: string;
  title: string;
  images: string[];
  price: number;
  description: string;
  buyerCount: number;
  createdAt: Date;
}

export default function ProductsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
  
  // Get initial filter values from URL
  const initialSort = params.get('sort') || '';
  const initialMinPrice = params.get('minPrice') || '';
  const initialMaxPrice = params.get('maxPrice') || '';

  // Fetch products when params change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts({
          search: params.get('search') || undefined,
          sort: params.get('sort') || undefined,
          minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
          maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
        });
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [params]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(params.toString());
    if (searchQuery) newParams.set('search', searchQuery);
    else newParams.delete('search');
    router.push(`/products?${newParams.toString()}`);
  };

  const handleFilterChange = () => {
    const newParams = new URLSearchParams(params.toString());
    if (searchQuery) newParams.set('search', searchQuery);
    router.push(`/products?${newParams.toString()}`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    router.push('/products');
  };

  const hasActiveFilters = Boolean(
    params.get('search') || 
    params.get('minPrice') || 
    params.get('maxPrice') || 
    params.get('sort')
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <BrutalTitle 
          mainText="Products" 
          subText="Find what you need" 
          accentColor="blue" 
        />
      </div>
      
      {/* Search Bar Only - Minimal Design */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="relative border-2 border-black shadow-brutal-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pr-12 bg-white focus:outline-none"
              autoFocus
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    const newParams = new URLSearchParams(params.toString());
                    newParams.delete('search');
                    router.push(`/products?${newParams.toString()}`);
                  }}
                  className="p-1 hover:bg-gray-100"
                  aria-label="Clear search"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="p-1 hover:bg-gray-100"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Minimal Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
            <button 
              onClick={resetFilters}
              className="text-sm underline hover:text-gray-800"
            >
              Clear filters
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
       
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try different search terms</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-gray-800"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}