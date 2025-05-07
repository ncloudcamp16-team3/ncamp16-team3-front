import adminAxios from "./adminAxios.js";

export const fetchFacility = async (page = 0, size = 10, facilityTypeId = null, searchTerm = "", searchField = "") => {
    try {
        let url = `/api/admin/facility/list?page=${page}&size=${size}`;

        if (facilityTypeId != null) {
            url += `&facilityTypeId=${facilityTypeId}`;
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

        if (response.status != 200) {
            throw new Error(response.data.message || "펫시터 목록을 가져오는데 실패했습니다");
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchFacilityDetail = async (id) => {
    try {
        const response = await adminAxios.get(`/api/admin/facility/${id}`);

        if (response.status != 200) {
            throw new Error(response.data.message || "업체 정보를 가져오는데 실패했습니다");
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

// 검색 필드 이름을 API 파라미터로 변환하는 함수
function getSearchFieldParam(fieldName) {
    const fieldMap = {
        업체명: "name",
        주소: "address",
        전화번호: "tel",
        상세내용: "detail",
    };

    return fieldMap[fieldName] || "all";
}
