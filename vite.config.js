import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react(),
            viteCompression(),
            VitePWA({
                registerType: "autoUpdate",
                includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
                manifest: {
                    name: "TailFriend",
                    short_name: "Tail",
                    start_url: "/",
                    display: "standalone",
                    background_color: "#ffffff",
                    theme_color: "#ff9900",
                    icons: [
                        {
                            src: "/pwa-192x192.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "/pwa-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                    ],
                },
                workbox: {
                    // 🔥 firebase-messaging-sw.js는 무조건 제외 (중복 서비스워커 방지)
                    exclude: [/firebase-messaging-sw\.js$/],
                },
            }),
        ],
        server: {
            host: "0.0.0.0",
            port: 5173,
            proxy:
                mode === "development"
                    ? {
                          "/api": {
                              target: "http://localhost:8080",
                              changeOrigin: true,
                              secure: false,
                          },
                      }
                    : {},
        },
    };
});
