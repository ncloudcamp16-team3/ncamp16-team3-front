import instance from "./axiosInstance.js";

const API_URL = "/pet"; // 상대 URL

export const getPet = ({ id }) => {
    return instance
        .get(`${API_URL}/friend/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};
