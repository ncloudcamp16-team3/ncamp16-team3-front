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
            console.log("인증토큰: ", token ? "토큰 있음" : "토큰 없음");

            if (token) {
                try {
                    const response = await fetch("/api/admin/auth/validate", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (!response.ok) {
                        throw new Error("토큰 검증 실패");
                    }

                    const data = await response.json();
                    console.log("토큰 검증 성공: " + data);

                    if (data.valid) {
                        const adminEmail = localStorage.getItem("adminEmail") || data.email;
                        setAdminEmail(adminEmail);
                        setIsAuthenticated(true);
                        console.log("인증 상태 설정 완료: " + adminEmail);
                    } else {
                        throw new Error("유효하지 않은 토큰");
                    }
                } catch (error) {
                    console.log("인증 확인 오류: " + error);
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminEmail");
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    //로그인 함수
    const login = async (email, password) => {
        try {
            console.log("로그인 시도: " + email);
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
            console.log("로그인 성공: " + data);

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminEmail", email);

            setAdminEmail(email);
            setIsAuthenticated(true);

            return data;
        } catch (error) {
            console.log("로그인 오류: " + error);
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
                console.log("로그아웃 API 호출 성공");
            } catch (error) {
                console.log("로그아웃 API 오류: " + error);
            }
        }

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        setAdminEmail("");
        setIsAuthenticated(false);
        setSelectedMenu("");
        console.log("로그아웃 처리 완료");
    };

    const contextValue = {
        selectedMenu,
        setSelectedMenu,
        isAuthenticated,
        loading,
        adminEmail,
        login,
        logout,
    };

    console.log("AdminContext 현재 상태: ", { isAuthenticated, loading, adminEmail });

    return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
};

// 커스텀 Hook으로 Context 사용을 간편하게
export const useAdmin = () => useContext(AdminContext);
