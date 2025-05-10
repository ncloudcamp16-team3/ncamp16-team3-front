import React, { useContext, useEffect } from "react";
import PetMeeting from "./PetMeeting.jsx";
import { Context } from "../../context/Context.jsx";

const PetMeetingViewSwitch = () => {
    const { setPet } = useContext(Context);

    useEffect(() => {
        const storedPet = sessionStorage.getItem("pet");
        const pet = storedPet ? JSON.parse(storedPet) : null;

        if (pet) {
            setPet(pet);
        }
    }, []);

    return (
        <>
            <PetMeeting />
        </>
    );
};

export default PetMeetingViewSwitch;
