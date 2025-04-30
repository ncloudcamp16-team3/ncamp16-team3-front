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

    useEffect(() => {
        const setupFCM = async () => {
            try {
                // 서비스 워커 등록
                registerSW();

                // 알림 권한 요청
                const permission = await Notification.requestPermission();
                console.log("Notification permission:", permission);
                if (permission !== "granted") return;

                // 로그인한 유저 정보 확인
                const userId = user?.id;
                if (!userId) {
                    console.log("User ID is not available");
                    return;
                }

                // FCM 토큰 발급
                const currentToken = await getToken(messaging, {
                    vapidKey: "BJfLUXGb7eC1k4y9ihVlJp7jzWlgp_gTKjqggd4WKX9U6xQsRelQupBMT9Z3PdvFYpYJKolSaguWXHzCUWVugXc",
                });

                if (!currentToken) {
                    console.log("No FCM token available");
                    return;
                }

                console.log("Current FCM Token:", currentToken);

                // 서버에서 기존 등록된 토큰 조회
                //         const savedToken = await getUserFcmToken({ userId }); // 🔁 DB에서 저장된 토큰을 받아옴
                //         console.log("Saved FCM Token:", savedToken);
                //
                //         // 토큰이 다르면 등록 또는 갱신
                //         if (savedToken !== currentToken) {
                //             await saveOrUpdateFcmToken({ userId, fcmToken: currentToken }); // 등록 또는 갱신 API
                //             console.log("FCM 토큰이 새로 저장 또는 갱신되었습니다.");
                //         } else {
                //             console.log("FCM 토큰이 이미 최신입니다.");
                //         }
                //     } catch (error) {
                //         console.error("FCM 설정 에러:", error);
                //     }
                // };

                // 서버에 FCM 토큰 저장 또는 갱신
                await saveOrUpdateFcmToken({ userId, fcmToken: currentToken });
                console.log("FCM 토큰이 새로 저장 또는 갱신되었습니다.");
            } catch (error) {
                console.error("FCM 설정 에러:", error);
            }
        };
        setupFCM();
        // 포그라운드 푸시 수신
        onMessage(messaging, (payload) => {
            console.log("Foreground message received:", payload);
            // 알림 UI 띄우기 등 처리
        });
    }, []);

    if (loading) return <div>로그인 상태 확인 중...</div>;

    if (!isLogin) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
