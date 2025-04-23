import instance from "./axiosInstance.js";

const API_URL = "/auth"; // 상대 URL

export const logout = async () => {
    return await instance
        .post(`${API_URL}/logout`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("로그아웃 실패", error);
            throw error;
        });
};

export const getUserInfo = async () => {
    return await instance
        .get(`${API_URL}/userinfo`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("로그인 실패", error);
            throw error;
        });
};
