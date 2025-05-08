import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { StrictMode } from "react";

// ✅ 서비스워커 등록
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((reg) => {
                console.log("✅ Service worker registered:", reg);
            })
            .catch((err) => {
                console.error("❌ Service worker registration failed:", err);
            });
    });
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
