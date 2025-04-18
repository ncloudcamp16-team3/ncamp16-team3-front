import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react(),
            VitePWA({
                registerType: "autoUpdate",
                workbox: {
                    cleanupOutdatedCaches: true,
                    skipWaiting: true,
                    clientsClaim: true,
                },
                manifest: {
                    name: "My App",
                    short_name: "App",
                    start_url: "/",
                    display: "standalone",
                    background_color: "#ffffff",
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
                    ],
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
                    : mode === "production"
                      ? {
                            "/api": {
                                target: "http://tailfriends.kro.kr:8080",
                                changeOrigin: true,
                                secure: false,
                            },
                        }
                      : {},
        },
    };
});
