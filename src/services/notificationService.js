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

export const deleteNotificationById = async (notificationId) => {
    return await instance
        .delete(`${API_URL}/${notificationId}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data || error;
        });
};

export const deleteAllNotificationsByUserId = async (userId) => {
    return await instance
        .delete(`${API_URL}/user/${userId}`)
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data || error;
        });
};
