"use client";
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { UploadButton } from '@/lib/uploadthing';
 
interface ProductFormData {
  title: string;
  description: string;
  price: string;
  imageUrls: string[];
}

const SimpleProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    imageUrls: [],
  });

  const [isSaving, setIsSaving] = useState(false);

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
    if (!formData.title.trim() || !formData.price.trim()) {
      alert('Title and price are required!');
      return;
    }

    setIsSaving(true);
    
    try {
      // Import the server action
      const { createProduct } = await import('@/app/admin/actions/product');
      
      const result = await createProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        images: formData.imageUrls
      });

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert('Product saved successfully!');
        resetForm();
      }
      
    } catch (error) {
      alert('Error saving product. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', imageUrls: [] });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Add New Product</h1>
            <button
              onClick={resetForm}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
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
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
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
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                console.log("Files: ", res);
                const newUrls = res.map(file => file.url);
                setFormData(prev => ({
                  ...prev,
                  imageUrls: [...prev.imageUrls, ...newUrls]
                }));
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>

          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <button
            onClick={handleSave}
            disabled={isSaving || !formData.title.trim() || !formData.price.trim()}
            className={`w-full py-3 rounded-md font-medium flex items-center justify-center ${
              formData.title.trim() && formData.price.trim() && !isSaving
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Product
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SimpleProductForm;