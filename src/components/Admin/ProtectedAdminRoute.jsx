import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAdmin } from "./AdminContext.jsx";

const ProtectedAdminRoute = () => {
    const { isAuthenticated, loading } = useAdmin();

    // 로딩 중이면 로딩 표시
    if (loading) {
        return <div>인증 상태 확인 중...</div>;
    }

    // 인증되지 않았으면 로그인 페이지로
    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    // 인증되었으면 children 렌더링
    return <Outlet />;
};

export default ProtectedAdminRoute;
