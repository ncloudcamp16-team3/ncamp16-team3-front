import axios from "axios";

const API_BASE_URL = "/api/bookmarks";

export const getMyPosts = async (page = 0, size = 2) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/my-posts`, {
            params: { page, size },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get my posts:", error);
        throw error;
    }
};
