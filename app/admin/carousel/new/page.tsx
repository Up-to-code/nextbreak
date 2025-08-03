"use client";
import React, { useState } from 'react';
import { X, Save, ExternalLink } from 'lucide-react';
import { UploadButton } from '@/lib/uploadthing';
import { createCarouselItem } from '@/actions/carousel';
import Link from 'next/link';

interface CarouselFormData {
  image: string;
  link: string;
}

const NewCarouselPage = () => {
  const [formData, setFormData] = useState<CarouselFormData>({
    image: '',
    link: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.image.trim() || !formData.link.trim()) {
      setError('Image and link are required!');
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      const result = await createCarouselItem({
        image: formData.image,
        link: formData.link
      });

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setError('');
        alert('Carousel item saved successfully!');
        resetForm();
      }
      
    } catch (error) {
      setError('Error saving item. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ image: '', link: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-[6px] border-black rounded-none p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-black mb-2">Add New Carousel Item</h1>
              <p className="text-gray-600">Upload an image and add a link for your carousel</p>
            </div>
            <Link
              href="/admin/carousel"
              className="bg-red-500 text-black border-[4px] border-black px-6 py-3 font-extrabold hover:bg-red-400 transition-colors flex items-center gap-2"
            >
              <X size={20} />
              Cancel
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white border-[4px] border-black rounded-none p-6 mb-6">
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div>
              <h3 className="text-lg font-bold text-black mb-3">Carousel Image</h3>
              
              {!formData.image ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          image: res[0].url
                        }));
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setError(`Upload failed: ${error.message}`);
                    }}
                    className="w-full"
                  />
                  <p className="mt-4 text-sm text-gray-600">JPG, PNG, or GIF (Max 4MB)</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Carousel preview"
                    className="w-full h-64 object-contain border-2 border-black"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Link Input */}
            <div>
              <h3 className="text-lg font-bold text-black mb-3">Link Destination</h3>
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink size={18} className="text-gray-600" />
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                  Where should this carousel item link to?
                </label>
              </div>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white border-[4px] border-black rounded-none p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetForm}
              className="bg-gray-300 text-black border-[3px] border-black px-6 py-3 font-extrabold hover:bg-gray-200 transition-colors"
            >
              Reset Form
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.image || !formData.link}
              className={`flex-1 border-[3px] border-black px-6 py-3 font-extrabold transition-colors ${
                formData.image && formData.link && !isSaving
                  ? 'bg-green-500 text-black hover:bg-green-400' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save size={20} />
                  Save Carousel Item
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCarouselPage;