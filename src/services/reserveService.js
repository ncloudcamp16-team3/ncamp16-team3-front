import instance from "./axiosInstance.js";

const API_URL = "/reserve"; // 상대 URL

export const getFacilityListToReserve = async (params = {}) => {
    const { page = 0, size = 10, sortBy = "starPoint", category = "HOTEL", location } = params;
    if (location.latitude === undefined || location.longitude === undefined) return;
    return await instance
        .get(`${API_URL}/facility/list`, {
            params: {
                latitude: location.latitude,
                longitude: location.longitude,
                category,
                sortBy,
                page,
                size,
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("시설 목록을 불러오는 데 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리
        });
};

export const getFacilityToReserveById = async ({ id }) => {
    return await instance
        .get(`${API_URL}/facility/detail/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("시설 정보를 불러오는 데 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리
        });
};

export const getFacilityReviewById = async ({ id, page, size }) => {
    return await instance
        .get(`${API_URL}/facility/${id}/review`, {
            params: {
                page,
                size,
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("예약 목록을 불러오는 데 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리
        });
};

export const getReserveList = async ({ page, size }) => {
    return await instance
        .get(`${API_URL}/list`, {
            params: {
                page,
                size,
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("예약 정보를 불러오는 데 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리
        });
};

export const getReserveDetailById = async ({ id }) => {
    return await instance
        .get(`${API_URL}/detail`, {
            params: {
                id,
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("예약 정보를 불러오는 데 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리
        });
};
