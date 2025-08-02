"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, ArrowLeft } from 'lucide-react';
import { UploadButton } from "@/lib/uploadthing";
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  buyerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductEditPage = ({
  params,
}: {
  params: { productId: string };
}) => {
  const productId = params.productId;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrls: [] as string[],
  });

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { getProductById } = await import('@/actions/product');
        const productData = await getProductById(productId);
        
        if (productData) {
          setProduct(productData);
          setFormData({
            title: productData.title,
            description: productData.description,
            price: productData.price.toString(),
            imageUrls: productData.images,
          });
        } else {
          alert('Product not found');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        alert('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    // Validation improvements
    if (!formData.title.trim()) {
      alert('Title is required!');
      return;
    }
    
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue)) { // Fixed: Removed extra parenthesis
      alert('Please enter a valid price');
      return;
    }

    setSaving(true);
    
    try {
      const { updateProduct } = await import('@/actions/product');
      
      const result = await updateProduct({
        id: productId,
        title: formData.title,
        description: formData.description,
        price: priceValue,
        images: formData.imageUrls
      });

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert('Product updated successfully!');
        router.push('/admin/products');
      }
    } catch (error) {
      alert('Error updating product. Please try again.');
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/admin/products');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Product not found state
  if (!product) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
          <p className="text-red-600 mb-4">Product not found</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin/products')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Edit Product</h1>
                <p className="text-sm text-gray-500">ID: {product.id}</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Stats */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Product Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{product.buyerCount}</div>
              <div className="text-xs text-blue-500">Buyers</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {new Date(product.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-green-500">Created</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {new Date(product.updatedAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-purple-500">Updated</div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (SAR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Describe your product..."
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Product Images</h3>
          
          <div className="mb-4">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                const newUrls = res.map(file => file.url);
                setFormData(prev => ({
                  ...prev,
                  imageUrls: [...prev.imageUrls, ...newUrls]
                }));
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>

          {formData.imageUrls.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-1/2 translate-x-1/2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No images uploaded yet</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.title.trim() || !formData.price}
            className={`flex-1 py-3 px-4 rounded-md font-medium flex items-center justify-center transition ${
              saving 
                ? 'bg-green-600 text-white' 
                : (!formData.title.trim() || !formData.price)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Product
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductEditPage;