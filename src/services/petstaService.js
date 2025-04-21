import instance from "./axiosInstance";

const API_URL = "/petsta"; // 상대 URL

export const getPostLists = () => {
    return instance
        .get(`${API_URL}/post/lists`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("게시글을 불러오는 데 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리
        });
};

export const addPhoto = async (formData) => {
    return await instance.post(`${API_URL}/post/add/photo`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const addVideo = async (formData) => {
    return await instance.post(`${API_URL}/post/add/video`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const toggleLike = (postId) => {
    return instance
        .post(`${API_URL}/post/${postId}/like`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("좋아요 토글에 실패했습니다.", error);
            throw error;
        });
};

export const toggleBookmark = (postId) => {
    return instance
        .post(`${API_URL}/post/${postId}/bookmark`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("북마크 토글에 실패했습니다.", error);
            throw error;
        });
};

export const boardUpdate = (Board) => {
    return instance.put(`${API_URL}/update`, Board);
};

export const boardDelete = (idx) => {
    return instance.delete(`${API_URL}/delete/${idx}`);
};

export const boardContent = (idx) => {
    return instance.get(`${API_URL}/content/${idx}`);
};

export const boardCnt = (idx) => {
    return instance.put(`${API_URL}/cnt/${idx}`);
};
