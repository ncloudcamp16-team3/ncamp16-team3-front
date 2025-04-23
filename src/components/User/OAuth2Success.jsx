import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance.js";
const API_URL = "/auth"; // 상대 URL

const checkLoginStatus = async (navigate) => {
    try {
        const res = await axiosInstance.get(`${API_URL}/check`, {});

        const data = res.data;
        console.log("🔍 로그인 체크 결과:", data);
        console.log("잉잉", data);

        if (data.isNewUser) {
            navigate("/register", { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    } catch (err) {
        console.error("🚨 로그인 체크 실패:", err);
        navigate("/login", { replace: true });
    }
};

const OAuth2Success = () => {
    const navigate = useNavigate();
    const hasRun = useRef(false); // ✅ useEffect 2번 실행 방지

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        checkLoginStatus(navigate); // 메소드 호출
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>로그인 처리 중입니다...</h2>
            <p>잠시만 기다려 주세요...</p>
        </div>
    );
};

export default OAuth2Success;
