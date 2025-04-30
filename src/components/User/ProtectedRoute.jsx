import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkLogin, getUserInfo, saveOrUpdateFcmToken } from "../../services/authService.js";
import { Context } from "../../context/Context.jsx";

import * as ncloudchat from "ncloudchat";
import { registerSW } from "../../../public/firebase-messaging-sw-register.js";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../../public/firebase.js";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const hasRun = useRef(false);

    const { isLogin, setLogin, setUser, nc, setNc, user } = useContext(Context);

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

    // ✅ FCM 설정은 로그인/유저 정보 세팅 완료 후 지연 실행
    useEffect(() => {
        if (!user?.id) return;

        const timer = setTimeout(() => {
            setupFCM(user.id);
        }, 1500); // 로그인 후 1.5초 뒤에 실행

        return () => clearTimeout(timer);
    }, [user?.id]);

    // 🔧 FCM 설정 함수 분리
    const setupFCM = async (userId) => {
        try {
            registerSW();

            const permission = await Notification.requestPermission();
            if (permission !== "granted") return;

            const currentToken = await getToken(messaging, {
                vapidKey: "BJfLUXGb7eC1k4y9ihVlJp7jzWlgp_gTKjqggd4WKX9U6xQsRelQupBMT9Z3PdvFYpYJKolSaguWXHzCUWVugXc",
            });

            if (!currentToken) return;

            console.log("Current FCM Token:", currentToken);
            await saveOrUpdateFcmToken({ userId, fcmToken: currentToken });
            console.log("FCM 토큰이 새로 저장 또는 갱신되었습니다.");
        } catch (error) {
            console.error("FCM 설정 에러:", error);
        }
    };

    // 🔔 포그라운드 메시지 수신 처리
    useEffect(() => {
        onMessage(messaging, (payload) => {
            console.log("Foreground message received:", payload);
            // 알림 UI 처리 가능
        });
    }, []);

    if (loading) return <div>로그인 상태 확인 중...</div>;

    if (!isLogin) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
