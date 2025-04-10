import React from "react";
import "../../css/App.css";
import MainPageHeader from "./MainPageHeader.jsx";
import FriendType from "./FriendType.jsx";
import Scheduler from "./Scheduler.jsx";
import { Box } from "@mui/material";
import FindFriend from "./FindFriend.jsx";
import { ActivityModal, PetConfigModal } from "./PetMeetingModals.jsx";

const PetMeeting = () => {
    return (
        <Box
            sx={{
                margin: "0 10px",
            }}
        >
            <MainPageHeader />
            <FriendType />
            <Scheduler />
            <FindFriend />
            <PetConfigModal />
            <ActivityModal />
        </Box>
    );
};

export default PetMeeting;
