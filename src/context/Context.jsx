import { createContext, useCallback, useEffect, useRef, useState } from "react";
import InfoModal from "../components/Global/InfoModal.jsx";
import { produce } from "immer";
import { getUserInfo } from "../services/authService.js";
import { getBoardTypeList } from "../services/boardService.js";
import { useLocation } from "react-router-dom";
import GlobalSnackbar from "../components/Global/GlobalSnackbar.jsx";

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

        getBoardTypeList()
            .then((res) => {
                const data = res.data;
                if (data.length > 0) {
                    setBoardTypeList(data);
                    setBoardType(data[0]);
                }
            })
            .catch((err) => {});

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

    const [pet, setPet] = useState({
        id: null,
        ownerId: 0,
        petTypeId: null,
        name: "",
        gender: "",
        birth: "",
        weight: 0,
        info: "",
        neutered: false,
        activityStatus: "NONE",
        photos: [],
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [isLogin, setLogin] = useState(false);

    const [boardTypeList, setBoardTypeList] = useState([]);

    const [boardType, setBoardType] = useState({});

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

    const handleSnackbarClose = () => {
        setSnackbar((prev) =>
            produce(prev, (draft) => {
                draft.open = false;
                draft.message = "";
                draft.severity = "success";
            })
        );
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbar((prev) =>
            produce(prev, (draft) => {
                draft.open = true;
                draft.message = message;
                draft.severity = severity;
            })
        );
    };

    const location = useLocation();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);

    useEffect(() => {
        const isChat = location.pathname === "/chat"; // 완전 일치
        setIsChatOpen(isChat);
    }, [location.pathname]);

    useEffect(() => {
        const isChatRoom = location.pathname.startsWith("/chat/room"); // /chat/room 경로로 시작
        setIsChatRoomOpen(isChatRoom);
    }, [location.pathname]);

    const [chatList, setChatList] = useState([]);
    const [chatLoad, setChatLoad] = useState([]);

    const [notifications, setNotifications] = useState([]);
    // const [toastNotifications, setToastNotifications] = useState([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);

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
                pet,
                setPet,
                isChatOpen,
                setIsChatOpen,
                isChatRoomOpen,
                setIsChatRoomOpen,
                handleSnackbarOpen,
                hasNewNotification,
                setHasNewNotification,
                notifications,
                setNotifications,
                chatList,
                setChatList,
                chatLoad,
                setChatLoad,
                snackbar,
                setSnackbar,
            }}
        >
            {children}
            <InfoModal
                open={InfoModalState.open}
                title={InfoModalState.title}
                message={InfoModalState.message}
                onClose={closeModal}
            />
            <GlobalSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                handleSnackbarClose={handleSnackbarClose}
            />
        </Context.Provider>
    );
}
