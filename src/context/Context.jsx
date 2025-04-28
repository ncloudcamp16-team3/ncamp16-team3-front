import { createContext, useCallback, useEffect, useRef, useState } from "react";
import InfoModal from "../components/Global/InfoModal.jsx";
import { produce } from "immer";
import { getUserInfo } from "../services/authService.js";

export const Context = createContext();

export function Provider({ children }) {
    const [nc, setNc] = useState(null);
    const [isMute, setIsMute] = useState(true);
    const [address, setAddress] = useState("");
    const hasRun = useRef(false); // ✅ useEffect 두 번 실행 방지
    const [InfoModalState, setInfoModalState] = useState({
        open: false,
        title: "",
        message: "",
        onClose: () => {},
    });

    const [isUserLoading, setUserLoading] = useState(true);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const fetchUserInfo = async () => {
            try {
                const userData = await getUserInfo();
                if (userData) {
                    setUser(userData);
                }
            } catch (err) {
                console.error("유저 정보 로딩 실패:", err);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const [user, setUser] = useState({
        id: "",
        nickname: "",
        path: null,
        address: "",
        dongName: "",
        latitude: null,
        longitude: null,
        distance: null,
        chatId: "",
    });

    const [isLogin, setLogin] = useState(false);

    const [boardTypeList, setBoardTypeList] = useState([
        {
            id: 1,
            name: "자유게시판",
        },
    ]);

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

    if (isUserLoading) return null;

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
                nc,
                setNc,
                boardTypeList,
                setBoardTypeList,
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
