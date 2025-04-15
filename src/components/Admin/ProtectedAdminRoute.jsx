import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "./AdminContext.jsx";

const ProtectedAdminRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAdmin();

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
