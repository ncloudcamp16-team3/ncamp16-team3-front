import adminAxios from "./adminAxios.js";

export const fetchBoards = async (page = 0, size = 10, boardTypeId = null, searchTerm = "", searchField = "") => {
    try {
        // 기본 URL 구성
        let url = `/api/admin/board/list?page=${page}&size=${size}`;

        // boardTypeId가 있는 경우 URL에 추가
        if (boardTypeId) {
            url += `&boardTypeId=${boardTypeId}`;
        }

        // 검색어가 있는 경우 URL에 추가
        if (searchTerm) {
            url += `&searchTerm=${encodeURIComponent(searchTerm)}`;

            // 검색 필드가 있는 경우 URL에 추가
            if (searchField && searchField !== "전체") {
                // 검색 필드에 따라 다른 파라미터 이름 사용
                const fieldParam = getSearchFieldParam(searchField);
                url += `&searchField=${fieldParam}`;
            }
        }

        const response = await adminAxios.get(url);

        // console.log(response);

        if (response.status != 200) {
            throw new Error(response.data.message || "게시판 목록을 가져오는데 실패했습니다");
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchBoardDetail = async (boardId) => {
    try {
        const response = await adminAxios.get(`api/admin/board/${boardId}`);

        if (response.status != 200) {
            throw new Error(response.data.message || "게시글 정보를 가져오는데 실패했습니다");
        }

        return response.data;
    } catch (error) {
        console.error("게시글 상세정보 API 호출 중 오류 발생: " + error);
        throw error;
    }
};

// 검색 필드 이름을 API 파라미터로 변환하는 함수
function getSearchFieldParam(fieldName) {
    const fieldMap = {
        제목: "title",
        내용: "content",
        작성자: "author",
    };

    return fieldMap[fieldName] || "all";
}
