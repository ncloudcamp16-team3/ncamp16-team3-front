import instance from "./axiosInstance.js";

const API_URL = "/petmeeting"; // 상대 URL

export const getFriends = ({ page, size, activityStatus, dongName, distance, latitude, longitude }) => {
    console.log("요청 페이지 : " + page);
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
