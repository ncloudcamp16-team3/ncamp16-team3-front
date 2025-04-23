import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context.jsx";
import axiosInstance from "../../services/axiosInstance.js";
import { getUserInfo } from "../../services/authService.js";

const API_URL = "/auth"; // API 경로는 백엔드에 맞추어 조정

const OAuth2Success = () => {
    const { setUser, setLogin } = useContext(Context);
    const navigate = useNavigate();
    const hasRun = useRef(false); // ✅ useEffect 두 번 실행 방지

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const checkLoginStatus = async () => {
            try {
                const res = await axiosInstance.get(`${API_URL}/check`, {
                    withCredentials: true, // ✅ 쿠키 기반 인증 사용하는 경우 필요
                });

                const data = res.data;
                console.log("🔍 로그인 체크 결과:", data);

                if (data.isNewUser) {
                    navigate("/register", { replace: true });
                } else {
                    try {
                        const data = await getUserInfo();
                        setUser({
                            id: data.id,
                            nickname: data.nickname,
                            path: data.path,
                            address: data.address,
                            dongName: data.dongName,
                            latitude: data.latitude,
                            longitude: data.longitude,
                            distance: data.distance,
                        });
                        navigate("/", { replace: true });
                    } catch (e) {
                        console.error("유저 정보 가져오기 실패", e);
                    }
                    setLogin(true);
                    navigate("/", { replace: true });
                }
            } catch (err) {
                console.error("🚨 로그인 체크 실패:", err);
                navigate("/login", { replace: true });
            }
        };

        checkLoginStatus();
    }, [navigate, setUser]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>로그인 처리 중입니다...</h2>
            <p>잠시만 기다려 주세요...</p>
        </div>
    );
};

export default OAuth2Success;
