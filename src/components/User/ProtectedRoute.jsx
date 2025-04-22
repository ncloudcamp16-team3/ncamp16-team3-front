import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // GET 요청을 보낼 때 자동으로 쿠키가 포함됩니다.
        fetch("/api/auth/profile", {
            method: "GET",
            credentials: "include", // 쿠키를 포함시키기 위해 필요한 옵션
        })
            .then((response) => response.json())
            .then((data) => {
                setUserData(data);
                console.log("✅ 사용자 프로필 정보:", data); // 콘솔 출력
            })
            .catch((error) => console.error("❌ 프로필 데이터 가져오기 오류:", error));
    }, []);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch(`/api/auth/check`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("🔐 ProtectedRoute 응답 데이터:", data);

                    // isNewUser === false이면 로그인된 상태로 간주
                    const isLogged = data?.isNewUser === false;
                    setIsLoggedIn(isLogged);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (err) {
                console.error("🚨 로그인 체크 실패:", err);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, []);

    if (loading) {
        return <div>로그인 상태 확인 중...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
