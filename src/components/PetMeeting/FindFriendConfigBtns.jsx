import React, { useContext } from "react";
import { Box } from "@mui/material";
import PetConfig from "../../assets/images/PetMeeting/pet-config.svg";
import LocationConfig from "../../assets/images/PetMeeting/location-config.svg";
import PlayConfig from "../../assets/images/PetMeeting/play-config.svg";
import ConfigBtn from "./ConfigBtn.jsx";
import { Context } from "../../context/Context.jsx";

const FindFriendConfigBtns = ({ pet, setOpen }) => {
    const { address } = useContext(Context);

    return (
        <Box
            sx={{
                display: "flex",
                margin: "10px 0 40px 0",
            }}
        >
            <ConfigBtn img={PetConfig} label={!pet.name ? "애완동물" : pet.name} setOpen={setOpen} />
            <ConfigBtn img={LocationConfig} label={!address ? "위치설정" : address} setOpen={setOpen} />
            <ConfigBtn img={PlayConfig} label={!pet.play ? "그만놀기" : pet.play} setOpen={setOpen} />
        </Box>
    );
};

export default FindFriendConfigBtns;
