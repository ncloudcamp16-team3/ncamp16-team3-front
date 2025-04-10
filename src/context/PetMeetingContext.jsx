import { createContext, useEffect, useMemo, useState } from "react";
import Pet from "../mock/PetMeeting/pet.json";

export const PetMeetingContext = createContext(null);

export const PetMeetingProvider = ({ children }) => {
    const [pet, setPet] = useState(null);
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
            pet,
            openPetConfigModal,
            openActivityModal,
            drop,
            friendType,
            view,
            setPet,
            setOpenPetConfigModal,
            setOpenActivityModal,
            setDrop,
            setFriendType,
            setView,
            setClose,
        }),
        [pet, openPetConfigModal, openActivityModal, drop, friendType, view]
    );

    useEffect(() => {
        setPet(Pet);
    }, []);

    return <PetMeetingContext.Provider value={value}>{children}</PetMeetingContext.Provider>;
};
