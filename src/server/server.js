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