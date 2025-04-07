import React, { useContext } from "react";
import { Box } from "@mui/material";
import PetBtn from "../../assets/images/PetMeeting/pet-btn.svg";
import LocationBtn from "../../assets/images/PetMeeting/location-btn.svg";
import PlayBtn from "../../assets/images/PetMeeting/play-btn.svg";
import WalkBtn from "../../assets/images/PetMeeting/walk-btn.svg";
import RestBtn from "../../assets/images/PetMeeting/rest-btn.svg";
import ConfigBtn from "./ConfigBtn.jsx";
import { Context } from "../../context/Context.jsx";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const FindFriendConfigBtns = () => {
    const { address } = useContext(Context);
    const { pet } = useContext(PetMeetingContext);
    let activityImg;
    let activityLabel;

    switch (pet?.activity_status) {
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
                margin: "10px 40px 40px 40px",
            }}
        >
            <ConfigBtn img={PetBtn} label={!pet?.name ? "애완동물" : pet?.name} type={"pet"} />
            <ConfigBtn img={LocationBtn} label={!address ? "위치설정" : address} type={"location"} />
            <ConfigBtn img={activityImg} label={activityLabel} type={"play"} />
        </Box>
    );
};

export default FindFriendConfigBtns;
