import instance from "./axiosInstance.js";

const API_URL = "/chat"; // 백엔드에서 @RequestMapping("/api/chat")와 일치

export const createChatRoom = (userId2) => {
    return instance
        .post(`${API_URL}/room`, null, {
            params: { userId2 },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("채팅방 생성 실패", error);
            throw error;
        });
};

export const getMyChatRooms = () => {
    return instance
        .get("/chat/rooms")
        .then((res) => res.data)
        .catch((err) => {
            console.error("채팅방 목록 불러오기 실패", err);
            throw err;
        });
};
