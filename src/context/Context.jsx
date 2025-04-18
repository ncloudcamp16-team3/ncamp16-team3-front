import { createContext, useCallback, useState } from "react";
import InfoModal from "../components/Global/InfoModal.jsx";
import { produce } from "immer";

export const Context = createContext();

export function Provider({ children }) {
    const [isMute, setIsMute] = useState(true);
    const [address, setAddress] = useState("");
    const [InfoModalState, setInfoModalState] = useState({
        open: false,
        title: "",
        message: "",
        onClose: () => {},
    });

    const [user, setUser] = useState({
        name: "USER1823",
        photo: "haribo.jpg",
        id: 3212,
    });
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
