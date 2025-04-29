import { createContext, useMemo, useState } from "react";

export const PetMeetingContext = createContext(null);

export const PetMeetingProvider = ({ children }) => {
    const [openPetConfigModal, setOpenPetConfigModal] = useState(false);
    const [openActivityModal, setOpenActivityModal] = useState(false);
    const [drop, setDrop] = useState(false);
    const [friendType, setFriendType] = useState("산책친구들");
    const [view, setView] = useState("petMeeting");

    const setClose = () => {
        setDrop(false);
        setOpenPetConfigModal(false);
    };

    const value = useMemo(
        () => ({
            openPetConfigModal,
            openActivityModal,
            drop,
            friendType,
            view,
            setOpenPetConfigModal,
            setOpenActivityModal,
            setDrop,
            setFriendType,
            setView,
            setClose,
        }),
        [openPetConfigModal, openActivityModal, drop, friendType, view]
    );

    return <PetMeetingContext.Provider value={value}>{children}</PetMeetingContext.Provider>;
};
