import instance from "./axiosInstance.js";

const API_URL = "/board"; // 상대 URL
const SIZE = 10; // 상대 URL

export const getBoardDetail = async (boardId) => {
    return await instance
        .get(`${API_URL}/detail/${boardId}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const getBoardType = async () => {
    return await instance
        .get(`${API_URL}/type`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const searchPost = async ({ boardTypeId, keyword, page }) => {
    return await instance
        .get(`${API_URL}/search`, {
            params: {
                boardTypeId,
                page,
                size: SIZE,
                ...(keyword && { keyword }),
            },
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });

    /*if (keyword) {
        return await instance
            .get(`${API_URL}/posts/`, { boardType: boardType, keyword: keyword })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    } else {
        return await instance
            .get(`${API_URL}/posts/`, { boardType: boardType })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    }*/
};
