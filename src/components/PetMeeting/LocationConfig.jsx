import React, { useContext } from "react";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";
import { Button } from "@mui/material";

const LocationConfig = () => {
    const { setView } = useContext(PetMeetingContext);

    return (
        <div>
            나는야 위치설정<br></br>
            <Button
                sx={{
                    backgroundColor: "#E9A260",
                    borderRadius: 2,
                    color: "white",
                }}
                onClick={() => setView("petMeeting")}
            >
                만나러가기
            </Button>
        </div>
    );
};

export default LocationConfig;
