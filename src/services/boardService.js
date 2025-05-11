import instance from "./axiosInstance.js";

const API_URL = "/board"; // 상대 URL
const SIZE = 10; // 상대 URL

export const saveBoard = async (formData) => {
    return await instance
        .post(`${API_URL}`, formData)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const deleteBoard = async (postId) => {
    return await instance
        .delete(`${API_URL}`, {
            params: {
                postId,
            },
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const completeSell = async (postId) => {
    return await instance
        // 프론트
        .post(`${API_URL}/product/complete`, { postId })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

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

export const getBookmarkedAndLiked = async (userId, boardId) => {
    return await instance
        .get(`${API_URL}/status`, {
            params: {
                userId,
                boardId,
            },
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const toggleBookmarked = async (userId, boardId, bookMarked) => {
    if (bookMarked) {
        return await instance
            .delete(`${API_URL}/bookmark/delete`, {
                params: {
                    userId,
                    boardId,
                },
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    } else {
        return await instance
            .get(`${API_URL}/bookmark/add`, {
                params: {
                    userId,
                    boardId,
                },
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    }
};

export const toggleLiked = async (userId, boardId, liked) => {
    if (liked) {
        return await instance
            .delete(`${API_URL}/like/delete`, {
                params: {
                    userId,
                    boardId,
                },
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    } else {
        return await instance
            .get(`${API_URL}/like/add`, {
                params: {
                    userId,
                    boardId,
                },
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    }
};

export const getBoardTypeList = async () => {
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
};

export const getComments = async (boardId) => {
    return await instance
        .get(`${API_URL}/comment`, {
            params: {
                boardId,
            },
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const addComment = async (comment, boardId, userId, commentId) => {
    return await instance
        .post(`${API_URL}/comment`, {
            comment,
            boardId,
            userId,
            commentId,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const updateComment = async (comment, commentId, userId) => {
    return await instance
        .put(`${API_URL}/comment`, {
            comment,
            commentId,
            userId,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};

export const deleteComment = async (commentId, userId) => {
    return await instance
        .delete(`${API_URL}/comment`, {
            params: {
                commentId,
                userId,
            },
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error.response.data;
        });
};
