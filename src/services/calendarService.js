import instance from "./axiosInstance.js";

const API_URL = "/calendar"; // 상대 URL

export const getScheduleAll = async (userId) => {
    return await instance
        .get(`${API_URL}/schedule`, {
            params: { userId },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("캘린더 스케쥴 전체정보 로딩 실패", error);
            throw error;
        });
};

export const getScheduleByDate = async () => {
    return await instance
        .get(`${API_URL}/schedule/date`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("캘린더 스케쥴 선택날짜 로딩 실패", error);
            throw error;
        });
};
