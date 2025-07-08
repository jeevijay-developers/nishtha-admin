"use client";
import React, { useState } from 'react';
import { FaEdit, FaEye, FaTimes, FaImage } from 'react-icons/fa';
import { MdDateRange, MdPhotoLibrary } from 'react-icons/md';

const GalleryCard = ({ 
  gallery,
  onEdit
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleViewDetails = () => {
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Gallery Thumbnail */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={gallery.thumbnailImage || gallery.images?.[0]?.url || '/placeholder-gallery.jpg'}
          alt={gallery.title}
          className="w-full h-full object-cover"
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
        
        {/* Status Badge */}
        {gallery.status === 'draft' && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Draft
          </div>
        )}
        
        {/* Featured Badge */}
        {gallery.featured && (
          <div className="absolute bottom-3 left-3 bg-[#ff8547] text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Gallery Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {gallery.title}
        </h3>

        {/* Gallery Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncateText(gallery.description, 120)}
        </p>

        {/* Gallery Date and Image Count */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MdDateRange className="w-4 h-4 mr-2 text-[#ff8547]" />
            <span>{formatDate(gallery.createdAt)}</span>
          </div>
          {gallery.images && (
            <div className="flex items-center text-sm text-gray-500">
              <MdPhotoLibrary className="w-4 h-4 mr-2 text-[#ff8547]" />
              <span>{gallery.images.length} {gallery.images.length === 1 ? 'Photo' : 'Photos'}</span>
            </div>
          )}
          {gallery.location && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2 text-[#ff8547]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{gallery.location}</span>
            </div>
          )}
          {gallery.views && (
            <div className="flex items-center text-sm text-gray-500">
              <FaEye className="w-3 h-3 mr-2 text-[#ff8547]" />
              <span>{gallery.views} views</span>
            </div>
          )}
        </div>

        {/* Gallery Category */}
        {gallery.category && (
          <div className="border-t border-gray-100 pt-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 text-xs font-medium text-[#ff8547] bg-[#ff8547]/10 rounded-full">
                {gallery.category}
              </span>
              {gallery.photographer && (
                <span className="text-xs text-gray-500">
                  by {gallery.photographer}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-1 px-3 py-2 text-sm text-[#ff8547] hover:bg-[#ff8547]/10 rounded-md transition-colors duration-200"
          >
            <FaEye className="w-3 h-3" />
            View Gallery
          </button>
          
          <button
            onClick={() => onEdit?.(gallery)}
            className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          >
            <FaEdit className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>

      {/* Detail View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">Gallery Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Gallery Information */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{gallery.title}</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">{gallery.description}</p>
                    
                    {gallery.tags && gallery.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {gallery.tags.map((tag, index) => (
                            <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`font-medium ${gallery.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {gallery.status?.charAt(0).toUpperCase() + gallery.status?.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Visibility:</span>
                        <span className="font-medium">{gallery.isPublic ? 'Public' : 'Private'}</span>
                      </div>
                      
                      {gallery.photographer && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Photographer:</span>
                          <span className="font-medium">{gallery.photographer}</span>
                        </div>
                      )}
                      
                      {gallery.clientName && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Client:</span>
                          <span className="font-medium">{gallery.clientName}</span>
                        </div>
                      )}
                      
                      {gallery.location && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Location:</span>
                          <span className="font-medium">{gallery.location}</span>
                        </div>
                      )}
                      
                      {gallery.eventDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Event Date:</span>
                          <span className="font-medium">{formatDate(gallery.eventDate)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium">{formatDate(gallery.createdAt)}</span>
                      </div>
                      
                      {gallery.updatedAt && gallery.updatedAt !== gallery.createdAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Updated:</span>
                          <span className="font-medium">{formatDate(gallery.updatedAt)}</span>
                        </div>
                      )}
                      
                      {gallery.views && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Views:</span>
                          <span className="font-medium">{gallery.views}</span>
                        </div>
                      )}
                      
                      {gallery.downloads && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Downloads:</span>
                          <span className="font-medium">{gallery.downloads}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Images Grid */}
              {gallery.images && gallery.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos ({gallery.images.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={typeof image === 'string' ? image : image.url}
                          alt={typeof image === 'object' && image.caption ? image.caption : `Gallery ${gallery.title} - Image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0xODcuNSA5My43NUwyMDYuMjUgMTEyLjVMMjEyLjUgMTA2LjI1TDIwMCAxMDBMMjEyLjUgODcuNUwyMDYuMjUgODEuMjVMMTg3LjUgMTAwVjkzLjc1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center">
                          <FaEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                        {/* Image Caption */}
                        {typeof image === 'object' && image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#ff8547]/50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleCloseModal();
                      onEdit?.(gallery);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#ff8547] border border-transparent rounded-md hover:bg-[#e67a40] focus:outline-none focus:ring-2 focus:ring-[#ff8547]/50"
                  >
                    Edit Gallery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryCard;