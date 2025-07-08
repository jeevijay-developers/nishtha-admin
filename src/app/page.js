
"use client";
import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import GalleryCard from '@/Components/GalleryCard';

const Page = () => {
  // Gallery data with comprehensive schema
  const [galleries, setGalleries] = useState([
    {
      _id: "gallery_001",
      title: "Wedding Photography Collection",
      description: "Beautiful moments captured during wedding ceremonies and celebrations. This collection showcases the joy, emotions, and special moments that make each wedding unique.",
      thumbnailImage: "/logonisi.png",
      images: [
        {
          url: "/logonisi.png",
          caption: "Ceremony moments",
          uploadedAt: "2025-01-15T10:30:00Z"
        },
        {
          url: "/globe.svg",
          caption: "Reception celebration",
          uploadedAt: "2025-01-15T14:20:00Z"
        },
        {
          url: "/next.svg",
          caption: "Couple portraits",
          uploadedAt: "2025-01-15T16:45:00Z"
        },
        {
          url: "/vercel.svg",
          caption: "Family gathering",
          uploadedAt: "2025-01-15T18:30:00Z"
        }
      ],
      category: "Weddings",
      tags: ["wedding", "ceremony", "celebration", "portraits"],
      status: "published",
      isPublic: true,
      location: "Mumbai, India",
      eventDate: "2025-01-15",
      photographer: "John Doe",
      clientName: "Raj & Priya",
      createdAt: "2025-01-15T09:00:00Z",
      updatedAt: "2025-01-20T11:30:00Z",
      views: 245,
      downloads: 12,
      featured: true
    },
    {
      _id: "gallery_002",
      title: "Corporate Event Documentation",
      description: "Professional documentation of corporate events, conferences, and business meetings. Capturing key moments and networking sessions.",
      thumbnailImage: "/window.svg",
      images: [
        {
          url: "/window.svg",
          caption: "Conference presentation",
          uploadedAt: "2025-01-10T09:15:00Z"
        },
        {
          url: "/file.svg",
          caption: "Networking session",
          uploadedAt: "2025-01-10T11:30:00Z"
        },
        {
          url: "/globe.svg",
          caption: "Panel discussion",
          uploadedAt: "2025-01-10T14:45:00Z"
        }
      ],
      category: "Corporate",
      tags: ["corporate", "conference", "business", "networking"],
      status: "published",
      isPublic: false,
      location: "Delhi, India",
      eventDate: "2025-01-10",
      photographer: "Jane Smith",
      clientName: "Tech Corp Ltd",
      createdAt: "2025-01-10T08:00:00Z",
      updatedAt: "2025-01-18T16:20:00Z",
      views: 89,
      downloads: 5,
      featured: false
    },
    {
      _id: "gallery_003",
      title: "Nature & Wildlife Safari",
      description: "Stunning wildlife and nature photography from recent safari expeditions. Capturing the beauty of wildlife in their natural habitat.",
      thumbnailImage: "/vercel.svg",
      images: [
        {
          url: "/vercel.svg",
          caption: "Tiger in the wild",
          uploadedAt: "2025-01-05T06:30:00Z"
        },
        {
          url: "/next.svg",
          caption: "Elephant family",
          uploadedAt: "2025-01-05T08:15:00Z"
        },
        {
          url: "/file.svg",
          caption: "Sunset landscape",
          uploadedAt: "2025-01-05T18:45:00Z"
        },
        {
          url: "/globe.svg",
          caption: "Bird photography",
          uploadedAt: "2025-01-05T07:20:00Z"
        },
        {
          url: "/window.svg",
          caption: "Forest scenery",
          uploadedAt: "2025-01-05T09:10:00Z"
        }
      ],
      category: "Nature",
      tags: ["wildlife", "nature", "safari", "animals", "landscape"],
      status: "draft",
      isPublic: true,
      location: "Jim Corbett National Park, India",
      eventDate: "2025-01-05",
      photographer: "Mike Johnson",
      clientName: "Wildlife Magazine",
      createdAt: "2025-01-05T05:00:00Z",
      updatedAt: "2025-01-05T20:15:00Z",
      views: 156,
      downloads: 8,
      featured: true
    }
  ]);

  const handleEditGallery = (gallery) => {
    console.log('Edit gallery:', gallery);
    // Add your edit functionality here
  };

  const handleAddGallery = () => {
    console.log('Add new gallery');
    // Add your add gallery functionality here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Manage and organize your photo galleries</p>
        </div>

        {/* Galleries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <GalleryCard
              key={gallery._id}
              gallery={gallery}
              onEdit={handleEditGallery}
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
            <button
              onClick={handleAddGallery}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Add Your First Gallery
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;