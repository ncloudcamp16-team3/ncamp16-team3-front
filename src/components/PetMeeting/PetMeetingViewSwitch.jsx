import React, { useContext, useEffect } from "react";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import PetMeeting from "./PetMeeting.jsx";
import LocationConfig from "./LocationConfig.jsx";
import { Context } from "../../context/Context.jsx";

const PetMeetingViewSwitch = () => {
    const { view } = useContext(PetMeetingContext);
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
            {view === "petMeeting" && <PetMeeting />}
            {view === "locationConfig" && <LocationConfig />}
        </>
    );
};

export default PetMeetingViewSwitch;
