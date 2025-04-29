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

export const getFcmToken = async ({ userId, fcmToken }) => {
    console.log("FCM Token to be sent:", fcmToken); // FCM 토큰이 제대로 전달되는지 확인
    try {
        const response = await instance.post(`${API_URL}/fcm`, {
            userId, // userId는 숫자여야 함
            fcmToken, // fcmToken은 문자열이어야 함
        });
        console.log("FCM 토큰 등록 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("fcm 토큰 갱신 실패", error);
        throw error;
    }
};

export const checkFcmTokenExists = async ({ userId }) => {
    try {
        const response = await instance.get(`${API_URL}/exists`, {
            params: { userId },
        });
        console.log("Response Data:", response.data); // 응답 데이터 확인
        return response.data.exists === true; // exists가 false일 경우 문제가 없으므로 확인
    } catch (error) {
        console.error("FCM 토큰 존재 확인 실패:", error);
        return false; // 에러 발생 시 안전하게 false 처리
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
