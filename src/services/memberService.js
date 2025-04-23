import instance from "./axiosInstance.js";

const API_URL = "/user"; // 상대 URL

export const toggleFollow = (userId) => {
    return instance
        .post(`${API_URL}/${userId}/follow`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("북마크 토글에 실패했습니다.", error);
            throw error;
        });
};
