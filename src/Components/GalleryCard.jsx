"use client";
import React, { useState, useEffect } from 'react';
import { FaEye, FaTimes, FaImage, FaTrash } from 'react-icons/fa';
import { MdDeleteOutline, MdPhotoLibrary } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { deleteImage } from '@/server/server';

const GalleryCard = ({ 
  gallery,
  onDelete
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isViewModalOpen) return;

      switch (event.key) {
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNextImage();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isViewModalOpen, selectedImageIndex]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && gallery.images.length > 1) {
      handleNextImage();
    }
    if (isRightSwipe && gallery.images.length > 1) {
      handlePrevImage();
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleViewDetails = () => {
    setIsViewModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const handleImageClick = (index) => {
    setImageLoading(true);
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    setImageLoading(true);
    setSelectedImageIndex((prev) => 
      prev === gallery.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setImageLoading(true);
    setSelectedImageIndex((prev) => 
      prev === 0 ? gallery.images.length - 1 : prev - 1
    );
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  const handleDeleteImage = async (publicId, index) => {
    if (!publicId) {
      toast.error('Cannot delete image: Missing public_id');
      return;
    }

    // Check if this is the last image - prevent deletion
    if (gallery.images.length <= 1) {
      toast.error('Cannot delete the last image in a gallery');
      return;
    }

    // Store the image info for deletion and show confirmation modal
    setImageToDelete({ publicId, index });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      setDeleting(true);
      await deleteImage(gallery._id, imageToDelete.publicId);
      
      // Update state locally to remove the image
      const updatedImages = [...gallery.images];
      updatedImages.splice(imageToDelete.index, 1);
      gallery.images = updatedImages;
      
      // If the deleted image was the current one, reset to the first image
      if (selectedImageIndex === imageToDelete.index) {
        setSelectedImageIndex(0);
      } else if (selectedImageIndex > imageToDelete.index) {
        // If the deleted image was before the current one, adjust index
        setSelectedImageIndex(selectedImageIndex - 1);
      }
      
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
      setImageToDelete(null);
    }
  };

  const cancelDeleteImage = () => {
    setShowDeleteConfirm(false);
    setImageToDelete(null);
  };

  const deleteIndividualImage = async (image) => {
    try {
      if (!gallery._id || !image.public_id) {
        toast.error('Cannot delete this image');
        return;
      }

      // Store the image info for deletion and show confirmation modal
      setImageToDelete({ publicId: image.public_id, index: gallery.images.findIndex(img => img.public_id === image.public_id) });
      setShowDeleteConfirm(true);
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200`}>
      {/* Gallery Thumbnail */}
      <div className="h-48 bg-gray-200 cursor-pointer" onClick={handleViewDetails}>
        <img
          src={gallery.images?.[0]?.url || '/placeholder-gallery.jpg'}
          alt={gallery.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isViewModalOpen ? '' : 'hover:scale-105'
          }`}
        />        
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-6">
        {/* Gallery Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {gallery.title}
        </h3>

        {/* Gallery Info */}
        <div className="mb-4 space-y-2">
          {gallery.images && (
            <div className="flex items-center text-sm text-gray-500">
              <MdPhotoLibrary className="w-4 h-4 mr-2 text-[#ff8547]" />
              <span>{gallery.images.length} {gallery.images.length === 1 ? 'Photo' : 'Photos'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-1 px-3 py-2 text-sm text-[#ff8547] hover:bg-[#ff8547]/10 rounded-md transition-colors duration-200"
          >
            <FaEye className="w-4 h-4" />
            View
          </button>
          
          <button
            onClick={() => onDelete?.(gallery)}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            <MdDeleteOutline className="w-4 h-4" /> 
            Delete
          </button>
        </div>
      </div>

      {/* Gallery Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 p-2 sm:p-4">
          <div className="w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{gallery.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{gallery.images?.length || 0} photos</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              {gallery.images && gallery.images.length > 0 ? (
                <div className="p-4 sm:p-6">
                  {/* Main Image Viewer */}
                  <div className="mb-6">
                    <div 
                      className="relative bg-gray-100 rounded-lg overflow-hidden"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff8547]"></div>
                        </div>
                      )}
                      <img
                        src={gallery.images[selectedImageIndex]?.url}
                        alt={`Gallery image ${selectedImageIndex + 1}`}
                        className={`w-full h-64 sm:h-96 object-contain transition-opacity duration-300 ${
                          imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0xODcuNSA5My43NUwyMDYuMjUgMTEyLjVMMjEyLjUgMTA2LjI1TDIwMCAxMDBMMjEyLjUgODcuNUwyMDYuMjUgODEuMjVMMTg3LjUgMTAwVjkzLjc1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                          setImageLoading(false);
                        }}
                        onLoad={() => setImageLoading(false)}
                      />
                      
                      {/* Navigation Arrows */}
                      {gallery.images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-20"
                            aria-label="Previous image"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-20"
                            aria-label="Next image"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10">
                        {selectedImageIndex + 1} of {gallery.images.length}
                      </div>

                      {/* Swipe Indicator for Mobile */}
                      {gallery.images.length > 1 && (
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs sm:hidden z-10">
                          Swipe to navigate
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {gallery.images.length > 1 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">All Photos ({gallery.images.length})</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {gallery.images.map((image, index) => (
                          <div
                            key={index}
                            className={`relative group aspect-square overflow-hidden rounded-lg ${
                              selectedImageIndex === index 
                                ? 'ring-2 ring-[#ff8547]' 
                                : 'hover:ring-2 hover:ring-gray-300'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110 cursor-pointer"
                              onClick={() => handleImageClick(index)}
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0xODcuNSA5My43NUwyMDYuMjUgMTEyLjVMMjEyLjUgMTA2LjI1TDIwMCAxMDBMMjEyLjUgODcuNUwyMDYuMjUgODEuMjVMMTg3LjUgMTAwVjkzLjc1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                              }}
                            />
                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(image.public_id, index);
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                              title="Delete image"
                            >
                              <MdDeleteOutline size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gallery Info */}
                  <div className="border-t border-gray-200 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Total Photos:</span>
                        <span className="ml-2 text-gray-600">{gallery.images.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <FaImage className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                  <p className="text-gray-600">This gallery doesn't contain any images yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#ff8547]/50 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleCloseModal();
                    onDelete?.(gallery);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#ff8547] border border-transparent rounded-md hover:bg-[#e67a40] focus:outline-none focus:ring-2 focus:ring-[#ff8547]/50 transition-colors duration-200"
                >
                  Delete Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Delete Image</h3>
                  <p className="text-sm text-gray-600">Are you sure you want to delete this image? This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDeleteImage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteImage}
                  disabled={!deleting}
                  className={`px-4 py-2 text-sm font-medium text-white ${deleting ? 'bg-red-700' : 'bg-red-600'} border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors duration-200`}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryCard;