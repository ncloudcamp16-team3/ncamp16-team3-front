import instance from "./axiosInstance.js";

const API_URL = "/petmeeting"; // 상대 URL

export const getFriends = ({ page, size, activityStatus, dongName, distance, latitude, longitude }) => {
    return instance
        .post(`${API_URL}/friends`, {
            page,
            size,
            activityStatus,
            dongName,
            distance,
            latitude,
            longitude,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};
