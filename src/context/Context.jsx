import { createContext, useCallback, useEffect, useRef, useState } from "react";
import InfoModal from "../components/Global/InfoModal.jsx";
import { produce } from "immer";
import { getUserInfo } from "../services/authService.js";

export const Context = createContext();

export function Provider({ children }) {
    const [isMute, setIsMute] = useState(true);
    const [address, setAddress] = useState("");
    const hasRun = useRef(false); // ✅ useEffect 두 번 실행 방지
    const [InfoModalState, setInfoModalState] = useState({
        open: false,
        title: "",
        message: "",
        onClose: () => {},
    });

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const fetchUserInfo = async () => {
            try {
                const userData = await getUserInfo(); // JWT 기반 유저 정보 가져오기
                if (userData) {
                    setUser(userData); // 유저 정보만 저장
                }
            } catch (err) {
                console.error("유저 정보 로딩 실패:", err);
            }
        };

        fetchUserInfo();
    }, []);

    const [user, setUser] = useState({
        id: 9999,
        nickname: "",
        path: null,
        address: "",
        dongName: "",
        latitude: null,
        longitude: null,
        distance: null,
    });

    const [isLogin, setLogin] = useState(false);

    const [boardType, setBoardType] = useState({
        id: 1,
        name: "자유게시판",
    });

    const toggleMute = () => {
        setIsMute((prev) => !prev);
    };

    const showModal = useCallback((title, message, onClose = () => {}) => {
        setInfoModalState({ open: true, title, message, onClose });
    }, []);

    const closeModal = useCallback(() => {
        setInfoModalState((prev) => {
            prev.onClose?.();

            return produce(prev, (draft) => {
                draft.open = false;
                draft.title = "";
                draft.message = "";
                draft.onClose = () => {};
            });
        });
    }, []);

    return (
        <Context.Provider
            value={{
                isMute,
                address,
                setAddress,
                toggleMute,
                user,
                setUser,
                boardType,
                setBoardType,
                showModal,
                isLogin,
                setLogin,
            }}
        >
            {children}
            <InfoModal
                open={InfoModalState.open}
                title={InfoModalState.title}
                message={InfoModalState.message}
                onClose={closeModal}
            />
        </Context.Provider>
    );
}
