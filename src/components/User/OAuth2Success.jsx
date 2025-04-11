import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/check", {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("🔍 로그인 체크 결과:", data);

                    if (data.loggedIn && data.userId === -1) {
                        navigate("/register");
                    } else {
                        navigate("/");
                    }
                } else {
                    navigate("/");
                }
            } catch (err) {
                console.error("🚨 로그인 체크 실패:", err);
                navigate("/");
            }
        };

        checkLogin();
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>로그인 처리 중입니다...</h2>
        </div>
    );
};

export default OAuth2Success;
