import instance from "./axiosInstance.js";

const API_URL = "/announce";

export const getAnnounces = async (boardType) => {
    return await instance
        .get(`${API_URL}/${boardType.id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const getAnnounceDetail = async (announceId) => {
    return await instance
        .get(`${API_URL}/detail/${announceId}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};
