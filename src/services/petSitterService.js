import instance from "./axiosInstance";

const API_URL = "/petsitter"; // 상대 URL

// 조건에 맞는 승인된 펫시터 목록 조회
export const getApprovedPetSitters = (params) => {
    return instance
        .get(`${API_URL}/approved`, { params })
        .then((response) => {
            // { message: "조회 성공", data: {...} }
            return response.data;
        })
        .catch((error) => {
            console.error("펫시터 목록을 불러오는 데 실패했습니다.", error);
            throw error;
        });
};

// 모든 승인된 펫시터 목록 조회
export const getAllApprovedPetSitters = (page = 0, size = 50) => {
    return instance
        .get(`${API_URL}/list`, {
            params: {
                page,
                size,
                status: "APPROVE",
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("펫시터 전체 목록을 불러오는 데 실패했습니다.", error);
            throw error;
        });
};

// 펫시터 상세 정보 조회
export const getPetSitterDetails = (sitterId) => {
    return instance
        .get(`${API_URL}/${sitterId}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("펫시터 상세 정보를 불러오는 데 실패했습니다.", error);
            throw error;
        });
};
