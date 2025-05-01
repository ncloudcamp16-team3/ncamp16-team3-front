import { createContext, useCallback, useEffect, useRef, useState } from "react";
import InfoModal from "../components/Global/InfoModal.jsx";
import { produce } from "immer";
import { getUserInfo } from "../services/authService.js";
import { getBoardTypeList } from "../services/boardService.js";

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
                console.log(data);
                console.log("응답 성공: " + res.message);
                if (data.length > 0) {
                    setBoardTypeList(data);
                    setBoardType(data[0]);
                }
            })
            .catch((err) => {
                console.log("에러 발생" + err.message);
            });

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
