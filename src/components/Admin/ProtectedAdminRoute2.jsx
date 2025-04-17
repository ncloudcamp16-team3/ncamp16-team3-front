import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "./AdminContext.jsx";
import { CircularProgress, Typography, Box } from "@mui/material";

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
                console.log("Protected route authentication check with token:", token ? "Present" : "Not found");

                if (!token) {
                    console.log("No token found, redirecting to login");
                    setValidAuth(false);
                    setChecking(false);
                    return;
                }

                console.log("Verifying token validity with API...");
                const response = await fetch("/api/admin/auth/validate", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Token validation response status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Token validation successful:", data);
                    setValidAuth(data.valid);
                } else {
                    console.log("Token validation failed");
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminEmail");
                    setValidAuth(false);
                }
            } catch (error) {
                console.error("인증 검증 오류:", error);
                setValidAuth(false);
            } finally {
                setChecking(false);
            }
        };

        verifyAuth();
    }, [location.pathname]);

    // 상태 확인 중일 때 로딩 표시
    if (checking || loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>인증 상태 확인 중...</Typography>
            </Box>
        );
    }

    // 인증 실패
    if (!isAuthenticated || !validAuth) {
        console.log("인증 실패: 로그인 페이지로 리다이렉트");
        return <Navigate to="/admin" replace />;
    }

    // 인증 성공
    console.log("인증 성공: 보호된 컴포넌트 렌더링");
    return children;
};

export default ProtectedAdminRoute;
