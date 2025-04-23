import instance from "./axiosInstance.js";

const API_URL = "/petmeeting"; // 상대 URL

export const getFriends = ({ currentPage, size, activityStatus, dongName, distance, latitude, longitude }) => {
    return instance
        .post(`${API_URL}/friends`, {
            page: currentPage,
            size,
            activityStatus,
            dongName,
            distance,
            latitude,
            longitude,
        })
        .then((response) => {
            console.log("요청 결과 메시지", response.data.message);
            return response.data.data;
        })
        .catch((error) => {
            console.log("에러 발생 메시지", error.response.data.message);
            throw error.response.data.data;
        });
};
