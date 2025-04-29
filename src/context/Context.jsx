import { createContext, useCallback, useEffect, useRef, useState } from "react";
import InfoModal from "../components/Global/InfoModal.jsx";
import { produce } from "immer";
import { getUserInfo } from "../services/authService.js";
import { registerSW } from "../../public/firebase-messaging-sw-register.js";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../public/firebase.js";

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

    const [fcmToken, setFcmToken] = useState("");
    useEffect(() => {
        // 서비스워커 등록
        registerSW();
        // 푸시 알림 권한 요청
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notification permission granted.");

                // 토큰 가져오기
                getToken(messaging, {
                    vapidKey: "BJfLUXGb7eC1k4y9ihVlJp7jzWlgp_gTKjqggd4WKX9U6xQsRelQupBMT9Z3PdvFYpYJKolSaguWXHzCUWVugXc",
                })
                    .then((currentToken) => {
                        if (currentToken) {
                            console.log("FCM Token:", currentToken);
                            setFcmToken(currentToken);
                            // 서버에 토큰 전달
                        } else {
                            console.log("No token available");
                        }
                    })
                    .catch((err) => {
                        console.log("Error getting token:", err);
                    });
            }
        });

        // 푸시 알림 수신 처리
        onMessage(messaging, (payload) => {
            console.log("Foreground message received:", payload);
            // 푸시 알림 처리 코드 추가
        });
    }, []);

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
                pet,
                setPet,
                fcmToken,
                setFcmToken,
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
