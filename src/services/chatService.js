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
        .get(`${API_URL}/rooms`)
        .then((res) => res.data)
        .catch((err) => {
            console.error("채팅방 목록 불러오기 실패", err);
            throw err;
        });
};

export const postMatchStart = (petId1, petId2) => {
    return instance
        .post(`${API_URL}/match/start?petId1=${petId1}&petId2=${petId2}`)
        .then((res) => res.data)
        .catch((err) => {
            console.error("매칭 시작 실패", err);
            throw err;
        });
};

export const postMatchCheck = (petId1, petId2) => {
    return instance
        .get(`${API_URL}/match/check`, {
            params: {
                petId1,
                petId2,
            },
        })
        .then((res) => res.data) // true or false
        .catch((err) => {
            console.error("매칭 확인 실패", err);
            throw err;
        });
};

// 거래 매칭 시작
export const postTradeStart = (postId) => {
    return instance
        .post(`${API_URL}/trade/start?postId=${postId}`)
        .then((res) => res.data)
        .catch((err) => {
            console.error("거래 매칭 시작 실패", err);
            throw err;
        });
};

// 거래 매칭 여부 확인
export const postTradeCheck = (postId) => {
    return instance
        .get(`${API_URL}/trade/check`, {
            params: { postId },
        })
        .then((res) => res.data) // true or false
        .catch((err) => {
            console.error("거래 매칭 확인 실패", err);
            throw err;
        });
};
