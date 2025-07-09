"use client";
import Image from 'next/image';
import GalleryModal from './GalleryModal';
import { useState } from 'react';

const Navbar = () => {

  const [showModal, setShowModal] = useState(false);

  const handleAddGallery = () => {
    // Add your gallery functionality here
    setShowModal(true);
  };

  return (
    <nav className="fixed w-full bg-white shadow-md border-b border-gray-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/logonisi.png"
              alt="Nishtha Admin Logo"
              width={50}
              height={50}
              className="h-15 w-auto"
            />
            <span className="ml-3 text-xl font-semibold text-gray-800">
              Nishtha Admin
            </span>
          </div>

          {/* Add Gallery Button */}
          <div className="flex items-center">
            <button
              onClick={handleAddGallery}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="w-4 h-4 mr-2 inline-block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Gallery
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <GalleryModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </nav>
  );
};

export default Navbar;