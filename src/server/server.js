import axios from 'axios';

export const getGallery = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/get-images`);
        return response.data;
    } catch (error) {
        console.error("Error fetching gallery:", error);
        throw error;
    }
}

// Delete individual image from gallery
export const deleteImage = async (galleryId, public_id) => {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/delete-image`, {
            data: { 
                galleryId: galleryId,
                public_id: public_id
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
}

// If you want to delete entire gallery, you'd need a separate function
export const deleteEntireGallery = async (galleryId) => {
    try {
        // You would need to create a new backend endpoint for this
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/delete-gallery/${galleryId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting entire gallery:", error);
        throw error;
    }
}