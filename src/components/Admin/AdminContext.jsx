// AdminContext.jsx - 새로운 파일 생성
import React, { createContext, useState, useContext } from "react";

// Context 생성
const AdminContext = createContext();

// Context Provider 컴포넌트
export const AdminProvider = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState("");

    return <AdminContext.Provider value={{ selectedMenu, setSelectedMenu }}>{children}</AdminContext.Provider>;
};

// 커스텀 Hook으로 Context 사용을 간편하게
export const useAdmin = () => useContext(AdminContext);
