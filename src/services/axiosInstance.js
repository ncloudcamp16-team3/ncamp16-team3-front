import axios from "axios";

let csrfToken = null;

// 쿠키에서 accessToken 꺼내는 함수
const getCookie = (name) => {
    const matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return matches ? decodeURIComponent(matches[1]) : null;
};

let waitForCsrfToken = () => Promise.resolve(); // 기본은 그냥 통과

export const initCsrfToken = async () => {
    try {
        const response = await fetch("/api/auth/csrf", {
            credentials: "include",
        });
        const data = await response.json();
        csrfToken = data.csrfToken;

        // 이 시점에만 요청 허용
        waitForCsrfToken = () => Promise.resolve();
    } catch (error) {
        console.error("CSRF 토큰 가져오기 실패:", error);
    }
};
const baseURL = import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api";

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// Axios interceptor 수정
axiosInstance.interceptors.request.use(
    async (config) => {
        await waitForCsrfToken(); // csrfToken 초기화가 끝날 때까지 기다림

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
