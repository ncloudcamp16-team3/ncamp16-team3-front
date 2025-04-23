import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context.jsx";
import { checkLogin, getUserInfo } from "../../services/authService.js";

const OAuth2Success = () => {
    const { setUser, setLogin } = useContext(Context);
    const navigate = useNavigate();
    const hasRun = useRef(false); // ✅ useEffect 두 번 실행 방지

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        (async () => {
            const data = await checkLogin();

            if (!data) {
                console.error("🚨 로그인 체크 실패");
                navigate("/login", { replace: true });
                return;
            }

            console.log("🔍 로그인 체크 결과:", data);

            if (data.isNewUser) {
                navigate("/register", { replace: true });
            } else {
                try {
                    const userData = await getUserInfo();
                    setUser({
                        id: userData.id,
                        nickname: userData.nickname,
                        path: userData.path,
                        address: userData.address,
                        dongName: userData.dongName,
                        latitude: userData.latitude,
                        longitude: userData.longitude,
                        distance: userData.distance,
                    });
                    setLogin(true);
                    navigate("/", { replace: true });
                } catch (e) {
                    console.error("유저 정보 가져오기 실패", e);
                    navigate("/login", { replace: true });
                }
            }
        })();
    }, [navigate, setUser]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>로그인 처리 중입니다...</h2>
            <p>잠시만 기다려 주세요...</p>
        </div>
    );
};

export default OAuth2Success;
