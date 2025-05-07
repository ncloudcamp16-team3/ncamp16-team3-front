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

export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await instance.patch(`${API_URL}/${notificationId}/read`);
        if (response.status === 204) {
            return true; // 성공적으로 처리됨
        }
        return true; // 실패 처리
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return false; // 실패 처리
    }
};

export const sendChatNotification = async ({ userId, channelId, senderId, message, type, createdAt }) => {
    try {
        const response = await instance.post(`${API_URL}/chat`, {
            userId,
            channelId,
            senderId,
            message,
            type,
            createdAt,
        });
        return response.data;
    } catch (error) {
        console.error("채팅 알림 전달 실패", error);
        throw error;
    }
};

export const checkNotification = async (userId) => {
    try {
        const response = await instance.get(`${API_URL}/check-notification?userId=${userId}`);
        if (response && response.data) {
            const { message, data } = response.data; // 예: { exists: false }
            return data; // { exists: true/false }
        }
        return null;
    } catch (error) {
        console.error("알림 읽음 여부 확인 중 오류:", error);
        throw error;
    }
};
