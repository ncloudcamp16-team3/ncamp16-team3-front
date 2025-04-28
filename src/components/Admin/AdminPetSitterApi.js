export const fetchPetSitter = async (page = 0, size = 10, searchTerm = "", searchField = "") => {
    try {
        let url = `/api/admin/petsitter/list?page=${page}&size=${size}`;

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

        const token = localStorage.getItem("adminToken");
        // console.log("Using token: " + token ? "Valid token exists" : "No token found");
        // console.log("API request URL: " + url);

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        // console.log("API response status: " + response.status);
        const data = await response.json();
        // console.log("API response data:", data);

        if (!response.ok) {
            throw new Error(data.message || "펫시터 목록을 가져오는데 실패했습니다");
        }

        return data;
    } catch (error) {
        console.log("펫시터 API 호출 중 오류 발생: " + error);
        throw error;
    }
};

export const fetchPetSitterDetail = async (id) => {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`/api/admin/petsitter/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "펫시터 정보를 가져오는데 실패했습니다");
        }
        // console.log(data);

        return data;
    } catch (error) {
        console.log("펫시터 상세보기 API 호출 중 오류 발생: " + error);
        throw error;
    }
};

export const fetchPendingPetSitter = async (page = 0, size = 10) => {
    try {
        let url = `/api/admin/petsitter/pending?page=${page}&size=${size}`;

        const token = localStorage.getItem("adminToken");
        // console.log("Using token: " + token ? "Valid token exists" : "No token found");
        // console.log("API request URL: " + url);

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        // console.log("API response status: " + response.status);
        const data = await response.json();
        // console.log("API response data:", data);

        if (!response.ok) {
            throw new Error(data.message || "펫시터 신청 목록을 가져오는데 실패했습니다");
        }

        return data;
    } catch (error) {
        console.log("펫시터 신청 API 호출 중 오류 발생: " + error);
        throw error;
    }
};

export const fetchPendingPetSitterDetail = async (id) => {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`/api/admin/petsitter/pending/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "펫시터 정보를 가져오는데 실패했습니다");
        }
        // console.log(data);

        return data;
    } catch (error) {
        console.log("펫시터 상세보기 API 호출 중 오류 발생: " + error);
        throw error;
    }
};

// 검색 필드 이름을 API 파라미터로 변환하는 함수
function getSearchFieldParam(fieldName) {
    const fieldMap = {
        닉네임: "nickname",
        연령대: "age",
        주거형태: "houseType",
        코멘트: "comment",
    };

    return fieldMap[fieldName] || "all";
}
