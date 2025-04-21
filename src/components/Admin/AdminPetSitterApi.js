export const fetchPetSitter = async (page = 0, size = 10) => {
    try {
        let url = `/api/admin/petsitter/list?page=${page}&size=${size}`;

        const token = localStorage.getItem("adminToken");
        console.log("Using token: " + token ? "Valid token exists" : "No token found");
        console.log("API request URL: " + url);

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("API response status: " + response.status);
        const data = await response.json();
        console.log("API response data:", data);

        if (!response.ok) {
            throw new Error(data.message || "펫시터 목록을 가져오는데 실패했습니다");
        }

        return data;
    } catch (error) {
        console.log("펫시터 API 호출 중 오류 발생: " + error);
        throw error;
    }
};
