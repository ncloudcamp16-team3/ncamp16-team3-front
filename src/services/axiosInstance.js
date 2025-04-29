import axios from "axios";


// 쿠키에서 accessToken 꺼내는 함수
const getCookie = (name) => {
    const matches = document.cookie.match(
        new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
    );
    return matches ? decodeURIComponent(matches[1]) : null;
};
const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api",
    withCredentials: true, // ✅ 이거 있어야 쿠키 보내짐!
});

// Axios interceptor 수정
axiosInstance.interceptors.request.use(
    async (config) => {
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
