export const fetchBoards = async (page = 1, size = 10, boardTypeId = 1) => {
    try {
        let url = `/api/admin/board/list?page=${page}&size=${size}&boardTypeId=${boardTypeId}`;

        const token = localStorage.getItem("adminToken");
        console.log("Using token: " + token ? "Valid token exists" : "No token found");
        console.log("API request URL: " + url);

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("API response status:", response.status);
        const data = await response.json();
        console.log("API response data:", data);

        if (!response.ok) {
            throw new Error(data.message || "게시판 목록을 가져오는데 실패했습니다");
        }

        return data;
    } catch (error) {
        console.log("게시판 API 호출 중 오류 발생: " + error);
        throw error;
    }
};

export const fetchBoardDetail = async (boardId) => {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`/api/admin/board/${boardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "게시글 정보를 가져오는데 실패했습니다");
        }

        return await response.json();
    } catch (error) {
        console.error("게시글 상세정보 API 호출 중 오류 발생: " + error);
        throw error;
    }
};
