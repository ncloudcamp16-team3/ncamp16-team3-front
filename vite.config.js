import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        viteCompression(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
            manifest: {
                name: "tailfriends",
                short_name: "tailfriends",
                description: "펫스타그램 + 중고거래 + 예약 플랫폼",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/tailfriends\.kro\.kr\/api\//,
                        handler: "NetworkOnly",
                    },
                ],
            },
            devOptions: {
                enabled: mode === "development",
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
}));
