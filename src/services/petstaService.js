import instance from "./axiosInstance";

const API_URL = "/petsta"; // 상대 URL

export const getLists = () => {
    return instance.get(`${API_URL}/getLists`);
};

export const addphoto = (formData) => {
    return instance.post(`${API_URL}/post/add/photo`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
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
