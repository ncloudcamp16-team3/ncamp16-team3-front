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
            console.error("유저정보 로딩 실패", error);
            throw error;
        });
};

export const checkLogin = async () => {
    try {
        const response = await instance.get(`${API_URL}/check`);
        return response.data;
    } catch (error) {
        console.error("로그인 실패", error);
        return null;
    }
};

// API 호출
export const registration = async (formData) => {
    try {
        const response = await instance.post(`${API_URL}/register`, formData);
        return response.data;
    } catch (error) {
        console.error("회원가입 실패", error);
        return null;
    }
};
