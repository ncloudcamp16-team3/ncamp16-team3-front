// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import { useContext, useEffect } from "react";
//
// import { Context } from "../../context/Context.jsx";
//
// const NotificationClient = () => {
//     const { user } = useContext(Context);
//
//     const socketUrl =
//         import.meta.env.MODE === "development"
//             ? "http://localhost:8080/api/ws"
//             : "https://tailfriends.kro.kr:8080/api/ws"; // 운영 주소 반영
//
//     useEffect(() => {
//         const socket = new SockJS(socketUrl);
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             onConnect: () => {
//                 console.log("Connected");
//                 stompClient.subscribe(`/api/notification/${user.id}`, (msg) => {
//                     console.log("📩 알림:", msg.body);
//                 });
//             },
//         });
//
//         stompClient.activate();
//
//         return () => {
//             stompClient.deactivate();
//         };
//     }, []);
//
//     return null;
// };
//
// export default NotificationClient;
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useContext, useEffect } from "react";

import { Context } from "../../context/Context.jsx";

const NotificationClient = () => {
    const { user } = useContext(Context);

    const socketUrl =
        import.meta.env.MODE === "development"
            ? "http://localhost:8080/api/ws"
            : "https://tailfriends.kro.kr:8080/api/ws"; // 운영 주소 반영

    useEffect(() => {
        // WebSocket 연결 (STOMP)
        const socket = new SockJS(socketUrl);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected");
                stompClient.subscribe(`/api/notification/${user.id}`, (msg) => {
                    console.log("📩 알림:", msg.body);
                });
            },
        });

        stompClient.activate();

        // 🧨 여기서 Push 알림 등록 요청
        const subscribePush = async () => {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                console.warn("Push 알림이 브라우저에서 지원되지 않습니다.");
                return;
            }

            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        "BCz1BNLNccwKDd9XwGJUnNNcKoluFigzD_5xRlehWtGinDRoESwgR63bHrhHvEcZydUj4qPWDk7YcDhmvisNmrM" // 서버 public key
                    ),
                });

                const body = {
                    userId: user.id,
                    notifyTypeId: 1, // 아무거나 기본값
                    content: "Push 구독 성공",
                    endpoint: subscription.endpoint,
                    p256dh: subscription.getKey("p256dh")
                        ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("p256dh"))))
                        : null,
                    auth: subscription.getKey("auth")
                        ? btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("auth"))))
                        : null,
                };

                await fetch("/api/test/push", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                console.log("✅ Push 등록 성공");
            } catch (error) {
                console.error("Push 등록 실패", error);
            }
        };

        subscribePush();

        return () => {
            stompClient.deactivate();
        };
    }, []);

    return null;
};

// Helper: VAPID Public Key 디코딩
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default NotificationClient;
