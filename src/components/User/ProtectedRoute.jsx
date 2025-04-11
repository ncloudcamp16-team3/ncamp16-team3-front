import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/check", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("🔐 ProtectedRoute 로그인 상태:", data);
                    setIsLoggedIn(data.loggedIn === true && data.userId !== -1);
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

    // 로그인 안 되어 있으면 로그인 페이지로 리디렉트
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 로그인 되어있으면 children 그대로 렌더
    return children;
};

export default ProtectedRoute;
