import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkLogin, getUserInfo } from "../../services/authService.js";
import { Context } from "../../context/Context.jsx";

import * as ncloudchat from "ncloudchat";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const hasRun = useRef(false);

    const { isLogin, setLogin, setUser, nc, setNc } = useContext(Context);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        (async () => {
            try {
                const data = await checkLogin();
                const isLogged = data?.isNewUser === false;
                setLogin(isLogged);

                if (isLogged) {
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
                        chatId: "ncid" + userData.id,
                    });

                    if (!nc) {
                        const chat = new ncloudchat.Chat();
                        await chat.initialize("8e8e626c-08d8-40e4-826f-185b1d1b8c4a");
                        await chat.connect({
                            id: "ncid" + userData.id,
                            name: userData.nickname,
                            profile: userData.path,
                            language: "ko",
                        });
                        setNc(chat);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error("로그인 정보 확인 실패", err);
                setLogin(false);
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>로그인 상태 확인 중...</div>;

    if (!isLogin) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
