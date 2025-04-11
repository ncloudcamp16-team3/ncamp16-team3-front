import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 로그인된 유저 정보
    const [loading, setLoading] = useState(true); // 초기 로딩 여부

    const fetchUser = async () => {
        try {
            const res = await axios.get("/api/auth/me", { withCredentials: true });
            setUser(res.data); // 유저 정보 저장
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser(); // 앱 시작 시 유저 정보 가져오기
    }, []);

    const login = (userInfo) => {
        setUser(userInfo);
    };

    const logout = async () => {
        await axios.post("/api/auth/logout", null, { withCredentials: true });
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
