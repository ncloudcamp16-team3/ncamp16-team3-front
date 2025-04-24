import React, { useContext } from "react";
import { Box } from "@mui/material";
import PetRegister from "./PetRegister.jsx";
import FindFriendConfigBtns from "./FindFriendConfigBtns.jsx";
import PetProfiles from "./PetProfiles.jsx";
import SetLocation from "./SetLocation.jsx";
import { Context } from "../../context/Context.jsx";

const FindFriend = () => {
    const { user } = useContext(Context);

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
            {user.address ? <PetProfiles /> : <SetLocation />}
        </Box>
    );
};

export default FindFriend;
