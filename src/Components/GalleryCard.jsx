"use client";
import React, { useState, useEffect } from 'react';
import { FaEye, FaTimes, FaImage } from 'react-icons/fa';
import { MdDeleteOutline, MdPhotoLibrary } from 'react-icons/md';

const GalleryCard = ({ 
  gallery,
  onDelete
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

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
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedImageIndex(0);
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Gallery Thumbnail */}
      <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={handleViewDetails}>
        <img
          src={gallery.images?.[0]?.url || '/placeholder-gallery.jpg'}
          alt={gallery.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0xODcuNSA5My43NUwyMDYuMjUgMTEyLjVMMjEyLjUgMTA2LjI1TDIwMCAxMDBMMjEyLjUgODcuNUwyMDYuMjUgODEuMjVMMTg3LjUgMTAwVjkzLjc1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
          }}
        />

        {/* Image Count Badge */}
        {gallery.images && gallery.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <FaImage className="w-3 h-3" />
            <span>{gallery.images.length}</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <FaEye className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 text-2xl" />
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4">
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
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">All Photos</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {gallery.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`relative group aspect-square overflow-hidden rounded-lg ${
                              selectedImageIndex === index 
                                ? 'ring-2 ring-[#ff8547]' 
                                : 'hover:ring-2 hover:ring-gray-300'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0xODcuNSA5My43NUwyMDYuMjUgMTEyLjVMMjEyLjUgMTA2LjI1TDIwMCAxMDBMMjEyLjUgODcuNUwyMDYuMjUgODEuMjVMMTg3LjUgMTAwVjkzLjc1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gallery Info */}
                  <div className="border-t border-gray-200 pt-4">
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
    </div>
  );
};

export default GalleryCard;