import { createContext, useMemo, useState } from "react";

export const PetMeetingContext = createContext(null);

export const PetMeetingProvider = ({ children }) => {
    const [pet, setPet] = useState({
        id: null,
        owner: {
            id: null,
            nickname: "",
            snsAccountId: "",
            snsTypeId: null,
            fileId: 1,
            address: "",
            dongName: "",
            latitude: null,
            longitude: null,
            distance: null,
        },
        petTypeId: null,
        name: "",
        gender: "",
        birth: "",
        weight: 0,
        info: "",
        neutered: false,
        activityStatus: "NONE",
        photos: [],
        thumbnail: 0,
    });
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

    return <PetMeetingContext.Provider value={value}>{children}</PetMeetingContext.Provider>;
};
