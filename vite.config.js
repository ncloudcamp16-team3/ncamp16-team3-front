import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react(), // ⚡️ react 플러그인만 남김
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
                                target: "https://tailfriends.kro.kr:8080",
                                changeOrigin: true,
                                secure: false,
                            },
                        }
                      : {},
        },
    };
});
