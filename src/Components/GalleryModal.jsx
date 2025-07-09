"use client";

import { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import apiClient from '@/server/config';

export default function GalleryModal({ isOpen, onClose, initialData = null, onSuccess }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState(initialData?.images || []);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please select only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (5MB max per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, { url: e.target.result, isNew: true }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const imageToRemove = previewImages[index];
    
    if (imageToRemove.isNew) {
      // Remove from selectedImages array
      const newSelectedImages = [...selectedImages];
      const selectedIndex = selectedImages.findIndex((_, i) => {
        const currentPreviewIndex = previewImages
          .slice(0, index + 1)
          .filter(img => img.isNew).length - 1;
        return i === currentPreviewIndex;
      });
      if (selectedIndex > -1) {
        newSelectedImages.splice(selectedIndex, 1);
        setSelectedImages(newSelectedImages);
      }
    }
    
    // Remove from preview
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Gallery title is required');
      return;
    }

    if (selectedImages.length === 0 && (!initialData || previewImages.length === 0)) {
      toast.error('At least one image is required');
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file uploads
      const submitFormData = new FormData();
      
      // Add title
      submitFormData.append('title', formData.title);
      
      // Add images
      selectedImages.forEach((file) => {
        submitFormData.append('images', file);
      });

      const response = await apiClient.post('/api/v1/gallery', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(
        initialData 
          ? 'Gallery updated successfully!' 
          : 'Gallery created successfully!'
      );
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form and close modal
      handleClose();
      
    } catch (error) {
      console.error('Error submitting gallery:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to save gallery. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: ''
    });
    setSelectedImages([]);
    setPreviewImages([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Gallery' : 'Create New Gallery'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Gallery Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff8547] focus:outline-none focus:ring-2 focus:ring-[#ff8547]/50"
              placeholder="Enter gallery title"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Images *
            </label>
            <div className="space-y-4">
              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#ff8547] file:text-white hover:file:bg-[#e67a40]"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Select multiple images (JPEG, PNG, GIF, WebP). Max 5MB per image.
                </p>
              </div>

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                      {image.isNew && (
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                          New
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {previewImages.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FaPlus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No images selected</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Choose Files" above to add images</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#ff8547]/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8547] border border-transparent rounded-md hover:bg-[#e67a40] focus:outline-none focus:ring-2 focus:ring-[#ff8547]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {initialData ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                initialData ? 'Update Gallery' : 'Create Gallery'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
