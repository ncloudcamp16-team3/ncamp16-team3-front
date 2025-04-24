import instance from "./axiosInstance.js";

const API_URL = "/pet"; // 상대 URL

export const getPet = ({ id }) => {
    return instance
        .get(`${API_URL}/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const getMyPets = ({ userId }) => {
    return instance
        .get(`${API_URL}/my/pets/${userId}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const getFriends = ({ page, size, activityStatus, dongName, distance, latitude, longitude }) => {
    return instance
        .post(`${API_URL}/friends`, {
            page,
            size,
            activityStatus,
            dongName,
            distance,
            latitude,
            longitude,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};
