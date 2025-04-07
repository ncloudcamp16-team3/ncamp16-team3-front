import { createContext, useEffect, useMemo, useState } from "react";
import Pet from "../mock/PetMeeting/pet.json";

export const PetMeetingContext = createContext(null);

export const PetMeetingProvider = ({ children }) => {
    const [pet, setPet] = useState(null);
    const [open, setOpen] = useState(false);
    const [openActivityModal, setOpenActivityModal] = useState(false);
    const [drop, setDrop] = useState(false);
    const [friendType, setFriendType] = useState("산책친구들");
    const [view, setView] = useState("petMeeting");

    const setClose = () => {
        setDrop(false);
        setOpen(false);
    };

    const value = useMemo(
        () => ({
            pet,
            open,
            drop,
            friendType,
            view,
            openActivityModal,
            setPet,
            setOpen,
            setDrop,
            setFriendType,
            setView,
            setOpenActivityModal,
            setClose,
        }),
        [pet, open, drop, friendType, view, openActivityModal]
    );

    useEffect(() => {
        setPet(Pet);
    }, []);

    return <PetMeetingContext.Provider value={value}>{children}</PetMeetingContext.Provider>;
};
