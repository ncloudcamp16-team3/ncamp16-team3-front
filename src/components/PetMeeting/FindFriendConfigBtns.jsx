import React, { useContext } from "react";
import { Box } from "@mui/material";
import PetBtn from "../../assets/images/PetMeeting/pet-btn.svg";
import LocationBtn from "../../assets/images/PetMeeting/location-btn.svg";
import PlayBtn from "../../assets/images/PetMeeting/play-btn.svg";
import WalkBtn from "../../assets/images/PetMeeting/walk-btn.svg";
import RestBtn from "../../assets/images/PetMeeting/rest-btn.svg";
import ConfigBtn from "./ConfigBtn.jsx";
import { Context } from "../../context/Context.jsx";

const FindFriendConfigBtns = () => {
    const { user, pet } = useContext(Context);

    let activityImg;
    let activityLabel;

    switch (pet?.activityStatus) {
        case "PLAY":
            activityImg = PlayBtn;
            activityLabel = "놀이중";
            break;
        case "WALK":
            activityImg = WalkBtn;
            activityLabel = "산책중";
            break;
        default:
            activityImg = RestBtn;
            activityLabel = "휴식중";
            break;
    }
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0 1.5em",
            }}
        >
            <ConfigBtn img={PetBtn} label={!pet?.name ? "애완동물" : pet?.name} type={"pet"} />
            <ConfigBtn img={LocationBtn} label={!user?.dongName ? "위치설정" : user?.dongName} type={"location"} />
            <ConfigBtn img={activityImg} label={activityLabel} type={"activity"} />
        </Box>
    );
};

export default FindFriendConfigBtns;
