import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

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

            if (token) {
                try {
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    const response = await axios.get(`/admin/auth/${token}`);

                    const adminEmail = localStorage.getItem("adminEmail");
                    setAdminEmail(adminEmail || "");
                    setIsAuthenticated(true);
                } catch (error) {
                    console.log(error);
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminEmail");
                    delete axios.defaults.headers.common["Authorization"];
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    //로그인 함수
    const login = async (email, password) => {
        try {
            const response = await axios.post(`/admin/login`, {
                email,
                password,
            });

            const { token, email: responseEmail } = response.data;

            localStorage.setItem("adminToken", token);
            localStorage.setItem("adminEmail", responseEmail);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setAdminEmail(responseEmail);
            setIsAuthenticated(true);

            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    //로그아웃 함수
    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        delete axios.defaults.headers.common["Authorization"];

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
