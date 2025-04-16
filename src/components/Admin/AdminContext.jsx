import React, { createContext, useState, useContext, useEffect } from "react";

// Context 생성
const AdminContext = createContext();

// Context Provider 컴포넌트
export const AdminProvider = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adminEmail, setAdminEmail] = useState("");

    // 로컬 스토리지에서 토큰 확인
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("adminToken");
            console.log("인증토큰: " + token);

            if (token) {
                try {
                    const response = await fetch("api/admin/auth/validate", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (!response.ok) {
                        throw new Error("토큰 검증 실패");
                    }

                    const adminEmail = localStorage.getItem("adminEmail");
                    setAdminEmail(adminEmail || "");
                    setIsAuthenticated(true);
                } catch (error) {
                    console.log(error);
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminEmail");
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    //로그인 함수
    const login = async (email, password) => {
        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "로그인에 실패했습니다");
            }

            const data = await response.json();
            const { token, email: responseEmail } = data;

            localStorage.setItem("adminToken", token);
            localStorage.setItem("adminEmail", email);

            setAdminEmail(responseEmail);
            setIsAuthenticated(true);

            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    //로그아웃 함수
    const logout = async () => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            try {
                await fetch("/api/admin/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        setAdminEmail("");
        setIsAuthenticated(false);
        setSelectedMenu("");
    };

    return (
        <AdminContext.Provider
            value={{ selectedMenu, setSelectedMenu, isAuthenticated, loading, adminEmail, login, logout }}
        >
            {children}
        </AdminContext.Provider>
    );
};

// 커스텀 Hook으로 Context 사용을 간편하게
export const useAdmin = () => useContext(AdminContext);
