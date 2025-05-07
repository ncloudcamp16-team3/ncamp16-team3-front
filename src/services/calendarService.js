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

export const postSchedule = async ({
    userId,
    title,
    content,
    startDate,
    endDate,
    address,
    latitude,
    longitude,
    fcmToken,
}) => {
    try {
        const response = await instance.post(`${API_URL}/schedule`, {
            userId,
            title,
            content,
            startDate,
            endDate,
            address,
            latitude,
            longitude,
            fcmToken,
        });

        return response.data;
    } catch (error) {
        console.error("캘린더 스케쥴 등록 실패", error);
        throw error;
    }
};

export const putSchedule = async ({ id, userId, title, content, startDate, endDate, address, latitude, longitude }) => {
    try {
        const response = await instance.put(`${API_URL}/schedule`, {
            id,
            userId,
            title,
            content,
            startDate,
            endDate,
            address,
            latitude,
            longitude,
        });

        return response.data;
    } catch (error) {
        console.error("캘린더 스케쥴 수정 실패", error);
        throw error;
    }
};

export const deleteSchedule = async ({ id }) => {
    try {
        const response = await instance.delete(`${API_URL}/schedule/${id}`);
        return response.data;
    } catch (error) {
        console.error("캘린더 스케쥴 삭제 실패", error);
        throw error;
    }
};

export const getEventAll = async () => {
    return await instance
        .get(`${API_URL}/event`, {})
        .then((response) => response.data)
        .catch((error) => {
            console.error("캘린더 이벤트 전체정보 로딩 실패", error);
            throw error;
        });
};

export const getReserveAll = async (userId) => {
    try {
        // userId가 존재하는지 확인
        if (!userId) {
            throw new Error("userId가 없습니다.");
        }

        // 요청 보내기 전에 콘솔로 확인 (디버깅용)
        console.log("Fetching reserves for userId:", userId);

        const response = await instance.get(`${API_URL}/reserve`, {
            params: { userId }, // userId를 쿼리 파라미터로 전달
        });

        // 응답 데이터 확인 (디버깅용)
        console.log("Response Data2:", response.data);

        return response.data; // JSON 배열 반환
    } catch (error) {
        console.error("캘린더 스케쥴 전체정보 로딩 실패", error);
        throw error;
    }
};
