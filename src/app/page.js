"use client";
import React, { useState, useEffect } from 'react';
import GalleryCard from '@/Components/GalleryCard';
import { getGallery } from '@/server/server';
import toast, { Toaster } from 'react-hot-toast';

const Page = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch galleries from API
  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const data = await getGallery();
      // console.log('Fetched galleries:', data);
      
      setGalleries(data);
    } catch (err) {
      console.error('Error fetching galleries:', err);
      setError('Failed to fetch galleries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  // Listen for gallery created event to refresh the list
  useEffect(() => {
    const handleGalleryCreated = () => {
      fetchGalleries();
    };

    window.addEventListener('galleryCreated', handleGalleryCreated);
    return () => window.removeEventListener('galleryCreated', handleGalleryCreated);
  }, []);


  // Keyboard support for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showDeleteConfirm && event.key === 'Escape' && !deleting) {
        cancelDeleteGallery();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDeleteConfirm, deleting]);

  const handleDeleteGallery = (gallery) => {
    // Store the gallery for deletion and show confirmation modal
    setGalleryToDelete(gallery);
    setShowDeleteConfirm(true);
    document.body.style.overflow = 'hidden';
  };

  const confirmDeleteGallery = async () => {
    if (!galleryToDelete) return;

    try {
      setDeleting(true);
      
      // Import the function dynamically to avoid circular dependencies
      const { deleteEntireGallery } = await import('@/server/server');
      
      // Delete the gallery
      await deleteEntireGallery(galleryToDelete._id);
      
      // Update the UI by removing the deleted gallery
      setGalleries(prev => prev.filter(g => g._id !== galleryToDelete._id));
      
      // Show success message
      toast.success('Gallery deleted successfully');
      
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast.error('Failed to delete gallery. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setGalleryToDelete(null);
      document.body.style.overflow = 'unset';
    }
  };

  const cancelDeleteGallery = () => {
    setShowDeleteConfirm(false);
    setGalleryToDelete(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
            <p className="text-gray-600">Manage and organize your photo galleries</p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
            <p className="text-gray-600">Manage and organize your photo galleries</p>
          </div>
          
          {/* Error State */}
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-red-400 mb-4">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading galleries</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage and organize your photo galleries</p>
        </div>

        {/* Add Gallery Button */}
        {/* <div className="mb-6">
          <button
            onClick={handleAddGallery}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Gallery
          </button>
        </div> */}

        {/* Galleries Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {galleries.map((gallery) => (
            <GalleryCard
              key={gallery._id}
              gallery={gallery}
              onDelete={handleDeleteGallery}
            />
          ))}
        </div>

        {/* Empty State */}
        {galleries.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No galleries found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first gallery.</p>
            {/* <button
              onClick={handleAddGallery}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Add Your First Gallery
            </button> */}
          </div>
        )}
      </main>

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
                  <h3 className="text-lg font-medium text-gray-900">Delete Gallery</h3>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete "{galleryToDelete?.title}" gallery? This action cannot be undone and will delete all images in this gallery.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDeleteGallery}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteGallery}
                  disabled={deleting}
                  className={`px-4 py-2 text-sm font-medium text-white ${deleting ? 'bg-red-700' : 'bg-red-600'} border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
                >
                  {deleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{deleting ? 'Deleting...' : 'Delete Gallery'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;