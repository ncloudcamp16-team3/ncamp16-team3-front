import instance from "./axiosInstance.js";

const API_URL = "/reserve"; // 상대 URL

export const getFacilityListsToReserve = ({
    page = 1,
    size = 10,
    sortBy = "starPoint",
    category = "HOTEL",
    location,
    today,
}) => {
    return instance
        .get(`${API_URL}/facility/lists`, {
            params: {
                latitude: location.latitude,
                longitude: location.longitude,
                category,
                sortBy,
                day: today,
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

export const getFacilityToReserveById = (id) => {
    return instance.get(`/facility/${id}/detail`).catch((error) => {
        console.error("시설 정보를 불러오는 데 실패했습니다.", error);
        throw error;
    });
};

export const getReserveListById = ({ id }) => {
    return instance
        .get(`${API_URL}/Reserve`, {
            params: {
                id,
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("예약 목록을 불러오는 데 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리
        });
};

export const getReserveDetailById = ({ uid, rid }) => {
    return instance
        .get(`${API_URL}/reserve/detail`, {
            params: {
                uid,
                rid,
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("예약 정보를 불러오는 데 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리
        });
};

export const addTempReserve = async (reserveData) => {
    return await instance.post(`${API_URL}/temp`, reserveData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

// ✅ 예약 목록을 불러오는 요청 함수
export const fetchMyReserveList = async () => {
    return await instance.get(`${API_URL}/my`);
};
