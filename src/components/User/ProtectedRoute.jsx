import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkLogin } from "../../services/authService.js";
import { Context } from "../../context/Context.jsx";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const hasRun = useRef(false); // ✅ useEffect 두 번 실행 방지

    const { isLogin, setLogin } = useContext(Context);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        (async () => {
            const data = await checkLogin();

            console.log("🔐 ProtectedRoute 응답 데이터:", data);
            const isLogged = data?.isNewUser === false;

            setLogin(isLogged);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <div>로그인 상태 확인 중...</div>;
    }

    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default ProtectedRoute;
