import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { StrictMode } from "react";
import { registerSW } from "virtual:pwa-register"; // 💡 PWA SW 등록

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);

// ✅ PWA 서비스워커 등록
registerSW({
    onNeedRefresh() {
        console.log("🔁 새 업데이트 있음");
    },
    onOfflineReady() {
        console.log("📴 오프라인 사용 가능");
    },
});
