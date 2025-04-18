import React, { useContext } from "react";
import { Box } from "@mui/material";
import PetRegister from "./PetRegister.jsx";
import FindFriendConfigBtns from "./FindFriendConfigBtns.jsx";
import PetProfiles from "./PetProfiles.jsx";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import SetLocation from "./SetLocation.jsx";

const FindFriend = () => {
    const { pet } = useContext(PetMeetingContext);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
            }}
        >
            <FindFriendConfigBtns />
            <PetRegister />
            {pet?.owner?.address ? <PetProfiles /> : <SetLocation />}
        </Box>
    );
};

export default FindFriend;
