import React from "react";
import { Box } from "@mui/material";
import PetRegister from "./PetRegister.jsx";
import FindFriendConfigBtns from "./FindFriendConfigBtns.jsx";
import SetLocation from "./SetLocation.jsx";

const FindFriend = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                margin: "5px 0",
            }}
        >
            <PetRegister />
            <FindFriendConfigBtns />
            <SetLocation />
        </Box>
    );
};

export default FindFriend;
