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

        return () => {
            stompClient.deactivate();
        };
    }, []);

    return null;
};

export default NotificationClient;
