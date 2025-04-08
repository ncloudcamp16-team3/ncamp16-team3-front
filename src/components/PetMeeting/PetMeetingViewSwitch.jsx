import React, { useContext } from "react";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import PetMeeting from "./PetMeeting.jsx";
import LocationConfig from "./LocationConfig.jsx";

const PetMeetingViewSwitch = () => {
    const { view } = useContext(PetMeetingContext);

    switch (view) {
        case "petMeeting":
            return <PetMeeting />;
        case "locationConfig":
            return <LocationConfig />;
        default:
            return <div>Not Found</div>;
    }
};

export default PetMeetingViewSwitch;
