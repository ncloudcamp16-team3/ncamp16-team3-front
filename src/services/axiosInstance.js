import axios from "axios";

// 쿠키에서 accessToken 꺼내는 함수
const getCookie = (name) => {
    const matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return matches ? decodeURIComponent(matches[1]) : null;
};

// CSRF 토큰을 가져오는 함수
const getCsrfToken = async () => {
    try {
        const response = await fetch("/api/auth/csrf", {
            credentials: "include", // 쿠키 전송 허용
        });
        const data = await response.json();
        return data.csrfToken; // CSRF 토큰 반환
    } catch (error) {
        console.error("CSRF 토큰을 가져오는 데 실패했습니다.", error);
        return null; // 실패 시 null 반환
    }
};

const baseURL =
    import.meta.env.MODE === "development"
        ? "http://localhost:8080/api" // 로컬 개발 환경
        : "/api"; // 배포 환경

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true, // 쿠키 전송 허용
});

// 요청 보내기 전에 accessToken 쿠키에서 가져오기
axiosInstance.interceptors.request.use(
    async (config) => {
        // CSRF 토큰 받아오기
        const csrfToken = await getCsrfToken();
        if (csrfToken) {
            // CSRF 토큰을 헤더에 추가
            config.headers["X-XSRF-TOKEN"] = csrfToken;
            console.log("잉잉");
        }

        // accessToken 쿠키에서 가져오기
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
