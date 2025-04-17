import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "./AdminContext.jsx";

const ProtectedAdminRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAdmin();
    const location = useLocation();
    const [checking, setChecking] = useState(true);
    const [validAuth, setValidAuth] = useState(false);

    useEffect(() => {
        // 컴포넌트 마운트 시 서버에 인증 상태 확인 요청
        const verifyAuth = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                if (!token) {
                    setValidAuth(false);
                    setChecking(false);
                    return;
                }

                const response = await fetch("/api/admin/auth/validate", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setValidAuth(data.valid);
                } else {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminEmail");
                    setValidAuth(false);
                }
            } catch (error) {
                console.error("인증 검증 실패:", error);
                setValidAuth(false);
            } finally {
                setChecking(false);
            }
        };

        verifyAuth();
    }, [location.pathname]);

    // 상태 확인 중
    if (checking || loading) {
        return <div>인증 상태 확인 중...</div>;
    }

    // 인증 실패
    if (!isAuthenticated || !validAuth) {
        console.log("인증 실패: 로그인 페이지로 리다이렉트");
        return <Navigate to="/admin" replace />;
    }

    // 인증 성공
    return children;
};

export default ProtectedAdminRoute;
