import instance from "./axiosInstance.js";

const API_URL = "/notification";

export const getNotificationsByUserId = async (userId) => {
    return await instance
        .get(`${API_URL}/user/${userId}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data || error;
        });
};
