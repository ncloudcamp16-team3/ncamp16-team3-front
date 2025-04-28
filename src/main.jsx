import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log("Service Worker 등록 성공:", registration.scope);
            })
            .catch((error) => {
                console.error("Service Worker 등록 실패:", error);
            });
    });
}

// 푸시 알림 권한 요청
if ("Notification" in window && navigator.serviceWorker) {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("푸시 알림 권한이 허용되었습니다.");
        } else {
            console.log("푸시 알림 권한이 거부되었습니다.");
        }
    });
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
