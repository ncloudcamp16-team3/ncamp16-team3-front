import React, { useContext } from "react";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import PetMeeting from "./PetMeeting.jsx";
import LocationConfig from "./LocationConfig.jsx";

const PetMeetingViewSwitch = () => {
    const { view } = useContext(PetMeetingContext);

    return (
        <>
            {view === "petMeeting" && <PetMeeting />}
            {view === "locationConfig" && <LocationConfig />}
        </>
    );
};

export default PetMeetingViewSwitch;
