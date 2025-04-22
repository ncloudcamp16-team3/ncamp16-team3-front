import { createContext, useContext, useState } from "react";

const FollowContext = createContext(); // 이름은 깔끔히 FollowContext로

export const useFollow = () => useContext(FollowContext); // 헬퍼 훅 만들기

const FollowProvider = ({ children }) => {
    const [followMap, setFollowMap] = useState({});
    // followMap 예시: { 123: true, 456: false }

    const toggleFollow = (userId) => {
        setFollowMap((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const setInitialFollow = (userId, initialFollowed) => {
        setFollowMap((prev) => ({
            ...prev,
            [userId]: initialFollowed,
        }));
    };

    return (
        <FollowContext.Provider value={{ followMap, toggleFollow, setInitialFollow }}>
            {children}
        </FollowContext.Provider>
    );
};

export default FollowProvider; // ★ default export로 FollowProvider 내보내기
