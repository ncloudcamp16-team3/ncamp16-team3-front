import axios from "axios";

let csrfToken = null;

// 쿠키에서 accessToken 꺼내는 함수
const getCookie = (name) => {
    const matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return matches ? decodeURIComponent(matches[1]) : null;
};

// CSRF 토큰을 가져오는 함수 (앱 시작할 때만 한번 호출)
export const initCsrfToken = async () => {
    try {
        const response = await fetch("/api/auth/csrf", {
            credentials: "include",
        });
        const data = await response.json();
        csrfToken = data.csrfToken; // 메모리에 저장
    } catch (error) {
        console.error("CSRF 토큰 가져오기 실패:", error);
    }
};

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api";

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
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
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
