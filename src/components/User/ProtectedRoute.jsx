import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkFcmTokenExists, checkLogin, getFcmToken, getUserInfo } from "../../services/authService.js";
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

    useEffect(() => {
        // 서비스 워커 등록
        registerSW();

        // 알림 권한 요청
        Notification.requestPermission().then(async (permission) => {
            console.log("Notification permission:", permission); // 알림 권한 상태 확인

            if (permission !== "granted") return;

            try {
                // FCM 토큰 가져오기
                const currentToken = await getToken(messaging, {
                    vapidKey: "BJfLUXGb7eC1k4y9ihVlJp7jzWlgp_gTKjqggd4WKX9U6xQsRelQupBMT9Z3PdvFYpYJKolSaguWXHzCUWVugXc",
                });

                if (currentToken) {
                    console.log("FCM Token:", currentToken);

                    // 로그인한 유저 정보에서 userId 가져오기
                    const userId = user?.id; // user 객체가 존재할 때만 userId 가져오기
                    console.log("User ID:", userId); // userId 로그로 확인

                    if (userId) {
                        const exists = await checkFcmTokenExists({ userId });

                        console.log("FCM Token Exists:", exists); // FCM 토큰 존재 여부 확인

                        if (!exists) {
                            // FCM 토큰 등록
                            await getFcmToken({ userId, fcmToken: currentToken });
                            console.log("FCM 토큰 최초 등록 완료");
                        } else {
                            console.log("이미 등록된 FCM 토큰입니다");
                        }
                    } else {
                        console.log("User ID is not available");
                    }
                } else {
                    console.log("No FCM token available");
                }
            } catch (error) {
                console.error("FCM 처리 에러:", error);
            }
        });

        // 포그라운드 푸시 알림 수신
        onMessage(messaging, (payload) => {
            console.log("Foreground message received:", payload);
            // 알림 UI 처리 코드 추가 가능
        });
    }, []); // user가 변경될 때마다 실행되도록 의존성 배열에 user 추가

    if (loading) return <div>로그인 상태 확인 중...</div>;

    if (!isLogin) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
