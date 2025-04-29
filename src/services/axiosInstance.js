import axios from "axios";

let csrfToken = null;

// 쿠키에서 accessToken 꺼내는 함수
const getCookie = (name) => {
    const matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return matches ? decodeURIComponent(matches[1]) : null;
};

let resolveTokenReady;
let waitForCsrfToken = new Promise((resolve) => {
    resolveTokenReady = resolve;
});

export const initCsrfToken = async () => {
    try {
        const response = await fetch("/api/auth/csrf", {
            credentials: "include", // ✅ 쿠키 저장을 위한 필수 옵션
        });
        const data = await response.json();
        csrfToken = data.csrfToken;
        resolveTokenReady(); // ✅ 이제 waitForCsrfToken을 통과시킴
    } catch (error) {
        console.error("CSRF 토큰 가져오기 실패:", error);
        resolveTokenReady(); // 실패해도 진행은 시킴
    }
};

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api",
    withCredentials: true, // ✅ 이거 있어야 쿠키 보내짐!
});

// Axios interceptor 수정
axiosInstance.interceptors.request.use(
    async (config) => {
        await waitForCsrfToken; // csrfToken 초기화가 끝날 때까지 기다림

        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }

        const token = getCookie("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
