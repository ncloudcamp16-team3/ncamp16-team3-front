import axios from "axios";

const adminAxios = axios.create({
    baseURL: "http://localhost:8080",
});

adminAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

adminAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("401 에러 발생 - 자동 로그아웃");

            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminEmail");

            window.location.href = "/admin";
        }
        return Promise.reject(error);
    }
);

export default adminAxios;
