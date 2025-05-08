import instance from "./axiosInstance.js";

const API_URL = "/payment"; // 상대 URL

export const fetchPaymentHistory = async (startDate, endDate) => {
    return await instance.get(`${API_URL}/list`, {
        params: {
            startDate,
            endDate,
        },
    });
};
