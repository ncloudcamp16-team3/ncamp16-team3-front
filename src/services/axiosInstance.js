import axios from "axios";

// 쿠키에서 accessToken 꺼내는 함수
const getCookie = (name) => {
    const matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return matches ? decodeURIComponent(matches[1]) : null;
};

const axiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true, // ✅ 이거 꼭 추가 (쿠키 전송 허용)
});

// 요청 보내기 전에 accessToken 쿠키에서 가져오기
axiosInstance.interceptors.request.use(
    (config) => {
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
