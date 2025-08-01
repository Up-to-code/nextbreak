"use client";

import { useState, useEffect } from "react";
import {
  getProducts,
  deleteProduct,
  ProductWithStats,
} from "../actions/actions";
import Link from "next/link";

export default function ProductManagement() {
  const [products, setProducts] = useState<ProductWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithStats | null>(
    null
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
      });

      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, pagination.page]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl font-bold">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/add">
          <button className="border-2 border-black bg-[#06D6A0] px-6 py-3 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
            Add Product
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-2 border-black p-3 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-200 relative">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-sm font-bold">
                  ${product.price}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="font-bold text-gray-800">Orders</p>
                    <p className="text-gray-600">{product.orderItems.length}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Reviews</p>
                    <p className="text-gray-600">{product.comments.length}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Buyers</p>
                    <p className="text-gray-600">{product.buyerCount}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Created</p>
                    <p className="text-gray-600">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link href={`/admin/products/${product.id}`} key={product.id} className="flex-1 border-2 border-black bg-[#FFD166] py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex justify-center">
                  Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="border-2 border-black bg-[#EF476F] px-3 py-2 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-xl font-bold mb-2">No products found</p>
            <p>Start by adding your first product!</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setPagination((prev) => ({ ...prev, page }))}
                  className={`px-3 py-2 border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${
                    page === pagination.page
                      ? "bg-[#FFD166] text-black"
                      : "bg-white text-black"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  className="w-full border-2 border-black p-2 rounded"
                  placeholder="Product title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border-2 border-black p-2 rounded"
                  rows={3}
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Price (SAR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border-2 border-black p-2 rounded"
                  placeholder="0.00"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border-2 border-black bg-gray-200 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 border-2 border-black bg-[#06D6A0] py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
