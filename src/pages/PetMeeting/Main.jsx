import React from "react";
import { PetMeetingProvider } from "../../context/PetMeetingContext.jsx";
import PetMeetingViewSwitch from "../../components/PetMeeting/PetMeetingViewSwitch.jsx";

const Main = () => {
    return (
        <PetMeetingProvider>
            <PetMeetingViewSwitch />
        </PetMeetingProvider>
    );
};

export default Main;
