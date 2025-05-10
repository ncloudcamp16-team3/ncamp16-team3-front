import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkLogin, getUserInfo, saveOrUpdateFcmToken } from "../../services/authService.js";
import { Context } from "../../context/Context.jsx";

import * as ncloudchat from "ncloudchat";
import { registerSW } from "../../../public/firebase-messaging-sw-register.js";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../../public/firebase.js";
import { Alert, Avatar, CircularProgress, Snackbar, Stack, Box } from "@mui/material";
import {
    checkNotification,
    getNotificationsByUserId,
    sendChatNotification,
} from "../../services/notificationService.js";
import { getMyChatRooms } from "../../services/chatService.js";

const ProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const hasRun = useRef(false);
    const [toastNotifications, setToastNotifications] = useState([]);

    const {
        isLogin,
        setLogin,
        setUser,
        nc,
        setNc,
        user,
        isChatOpen,
        isChatRoomOpen,
        setHasNewNotification,
        notifications,
        setNotifications,
        setChatList,
        chatLoad,
        setChatLoad,
    } = useContext(Context);

    const initNcChat = async (userData, nc, setNc) => {
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
    };

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

                    initNcChat(userData, nc, setNc);
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
        if (!user?.id) return;

        const timer = setTimeout(() => {
            setupFCM(user.id);
        }, 1500);

        return () => clearTimeout(timer);
    }, [user?.id]);

    const setupFCM = async (userId, maxRetries = 3) => {
        let attempts = 0;
        const mobile = /Mobi|Android/i.test(navigator.userAgent);
        const dev = import.meta.env.MODE === "development";

        const trySetup = async () => {
            try {
                registerSW();
                const permission = await Notification.requestPermission();
                if (permission !== "granted") return;
                const currentToken = await getToken(messaging, {
                    vapidKey: "BJfLUXGb7eC1k4y9ihVlJp7jzWlgp_gTKjqggd4WKX9U6xQsRelQupBMT9Z3PdvFYpYJKolSaguWXHzCUWVugXc",
                });
                if (!currentToken) throw new Error("FCM 토큰을 가져오지 못했습니다.");
                await saveOrUpdateFcmToken({ userId, fcmToken: currentToken, mobile, dev });
            } catch (error) {
                attempts++;
                if (attempts < maxRetries) setTimeout(trySetup, 1000);
                else console.error("FCM 설정 실패: 최대 재시도 초과");
            }
        };

        await trySetup();
    };

    const fetchRooms = async () => {
        if (!nc || !user?.id || !isLogin) return;
        try {
            const roomList = await getMyChatRooms();
            const result = [];
            for (let room of roomList) {
                const filter = { name: room.uniqueId };
                const channels = await nc.getChannels(filter, {}, { per_page: 1 });
                const edge = (channels.edges || [])[0];
                if (!edge) continue;
                const ch = edge.node;
                await nc.subscribe(ch.id);
                result.push({
                    id: ch.id,
                    name: room.nickname,
                    photo: room.profileUrl,
                    lastMessage: ch.last_message?.content || "",
                    lastMessageSentAt: ch.last_message?.sended_at || ch.updated_at,
                    unreadCount: (await nc.unreadCount(ch.id)).unread || 0,
                });
            }
            result.sort((a, b) => new Date(b.lastMessageSentAt) - new Date(a.lastMessageSentAt));
            setChatList(result);
        } catch (e) {
            console.error("채팅방 정보 조회 실패:", e);
        }
    };

    useEffect(() => {
        if (chatLoad) {
            fetchRooms();
            setChatLoad(false);
        }
    }, [nc, user?.id, isLogin, chatLoad]);

    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            if (payload.data?.type === "FETCH_ROOMS") setChatLoad(true);
        });
        return () => unsubscribe();
    }, [setChatLoad]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === "FETCH_ROOMS") {
                setChatLoad(true);
                fetchRooms();
            }
        };
        navigator.serviceWorker?.addEventListener("message", handleMessage);
        return () => navigator.serviceWorker?.removeEventListener("message", handleMessage);
    }, [nc, user?.id]);

    useEffect(() => {
        const fetchAll = async () => {
            if (!user?.id) return;
            try {
                fetchRooms();
                const [checkResult, notiList] = await Promise.all([
                    checkNotification(user.id),
                    getNotificationsByUserId(user.id),
                ]);
                setHasNewNotification(checkResult.exists);
                setNotifications(notiList);
            } catch (e) {
                console.error("알림 정보 로딩 실패:", e);
            }
        };
        fetchAll();

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") fetchAll();
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [nc, user?.id]);

    useEffect(() => {
        if (!nc || !user?.id) return;
        const backgroundHandler = async (channel, msg) => {
            if (!msg?.sender?.id) return;
            const parsed = JSON.parse(msg.content || "{}");
            if (msg.sender.id === `ncid${user.id}`) return;
            await sendChatNotification({
                userId: user.id,
                channelId: msg.channel_id,
                senderId: msg.sender.id.replace(/\D/g, ""),
                message: parsed.content,
                type: parsed.customType,
                createdAt: new Date().toISOString(),
            });
        };
        if (!isChatOpen && !isChatRoomOpen) nc.bind("onMessageReceived", backgroundHandler);
        return () => nc.unbind("onMessageReceived", backgroundHandler);
    }, [nc, user.id, isChatOpen, isChatRoomOpen]);

    const NotificationList = () => {
        useEffect(() => {
            const unsubscribe = onMessage(messaging, async (payload) => {
                if (payload.notification) return;
                if (payload.data?.type === "FETCH_ROOMS") return setChatLoad(true);
                const noti = {
                    id: Date.now(),
                    title: payload.data?.title || "알림",
                    body: payload.data?.body || "",
                    image: payload.data?.icon || "/default-icon.png",
                    createdAt: new Date().toISOString(),
                };
                setToastNotifications((prev) => [...prev, noti]);
                setHasNewNotification(true);
                setTimeout(() => setToastNotifications((prev) => prev.filter((n) => n.id !== noti.id)), 5000);
                if (user?.id) setNotifications(await getNotificationsByUserId(user.id));
            });
            return () => unsubscribe();
        }, [user]);

        return (
            <>
                {toastNotifications.map((notification) => (
                    <Snackbar key={notification.id} open anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                        <Alert severity="info" variant="filled" sx={{ backgroundColor: "#fff5e5", color: "#333" }}>
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

    if (loading)
        return (
            <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center">
                <CircularProgress size={30} />
            </Box>
        );

    if (!isLogin) return <Navigate to="/login" replace />;

    return (
        <>
            <NotificationList />
            <Outlet />
        </>
    );
};

export default ProtectedRoute;
