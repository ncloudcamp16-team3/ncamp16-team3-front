import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkLogin, getUserInfo, saveOrUpdateFcmToken } from "../../services/authService.js";
import { Context } from "../../context/Context.jsx";

import * as ncloudchat from "ncloudchat";
import { registerSW } from "../../../public/firebase-messaging-sw-register.js";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../../public/firebase.js";
import { Alert, Avatar, Snackbar, Stack } from "@mui/material";
import { sendChatNotification } from "../../services/notificationService.js";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const hasRun = useRef(false);

    const { isLogin, setLogin, setUser, nc, setNc, user, isChatOpen, isChatRoomOpen } = useContext(Context);

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

    const parseMessage = (msg) => {
        let parsed;
        try {
            parsed = JSON.parse(msg.content);
        } catch {
            parsed = { customType: "TEXT", content: msg.content };
        }

        let typeId = 1;
        if (parsed.customType === "MATCH") typeId = 2;
        else if (parsed.customType === "TRADE") typeId = 3;
        else if (parsed.customType === "PETSITTER") typeId = 4;

        return {
            id: msg.message_id,
            senderId: msg.sender?.id,
            text: parsed.content,
            type_id: typeId,
            metadata: parsed,
            photo: msg.sender?.profile,
            parsed,
        };
    };

    useEffect(() => {
        if (!nc || !user?.id) return;

        const backgroundHandler = async (channel, msg) => {
            if (!msg || !msg.sender?.id) return;

            const { parsed } = parseMessage(msg);
            const isMine = msg.sender.id === `ncid${user.id}`;
            if (isMine) return; // 내 메시지는 무시

            const numericSenderId = msg.sender.id.replace(/\D/g, "");

            const payload = {
                userId: user.id,
                channelId: msg.channel_id,
                senderId: numericSenderId,
                message: parsed.content,
                type: parsed.customType,
                createdAt: new Date().toISOString(),
            };

            try {
                await sendChatNotification(payload);
            } catch (err) {
                console.error("알림 전송 실패:", err);
            }
        };

        if (!isChatOpen && !isChatRoomOpen) {
            nc.bind("onMessageReceived", backgroundHandler);
        }

        return () => {
            nc.unbind("onMessageReceived", backgroundHandler);
        };
    }, [nc, user.id, isChatOpen, isChatRoomOpen]);

    // Notification List component
    const NotificationList = () => {
        const [notifications, setNotifications] = useState([]);

        useEffect(() => {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log("Foreground message received:", payload);

                const notificationData = payload?.notification;
                if (notificationData) {
                    const newNotification = {
                        id: Date.now(),
                        title: notificationData.title || "알림",
                        body: notificationData.body || "",
                        image: notificationData.image || "",
                        createdAt: new Date().toISOString(),
                    };

                    // 브라우저 알림
                    if (Notification.permission === "granted") {
                        new Notification(newNotification.title, {
                            body: newNotification.body,
                            icon: newNotification.image,
                        });
                    }

                    setNotifications((prev) => [...prev, newNotification]);

                    // 3초 후 알림 제거
                    setTimeout(() => {
                        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
                    }, 5000);
                }
            });

            return () => unsubscribe();
        }, []);

        return (
            <>
                {notifications.map((notification) => (
                    <Snackbar
                        key={notification.id}
                        open={true}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        sx={{
                            top: "80px", // 알림이 좀 더 아래에서 나오도록 위치 조정
                            zIndex: 20000,
                        }}
                    >
                        <Alert
                            severity="info"
                            variant="filled"
                            icon={false}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#fff5e5",
                                color: "#333",
                                boxShadow: 3,
                                borderRadius: 2,
                                minWidth: 300,
                                maxWidth: 500,
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                {notification.image && (
                                    <Avatar alt="알림 이미지" src={notification.image} sx={{ width: 40, height: 40 }} />
                                )}
                                <div>
                                    <div style={{ fontWeight: "bold" }}>{notification.title}</div>
                                    <div>{notification.body}</div>
                                </div>
                            </Stack>
                        </Alert>
                    </Snackbar>
                ))}
            </>
        );
    };

    if (loading) return <div>로그인 상태 확인 중...</div>;

    if (!isLogin) return <Navigate to="/login" replace />;

    return (
        <>
            <NotificationList />
            <Outlet />
        </>
    );
};

export default ProtectedRoute;
