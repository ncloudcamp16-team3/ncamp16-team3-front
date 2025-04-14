import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { PetMeetingContext } from "../../context/PetMeetingContext.jsx";

const LocationConfigBtns = ({ saveLocation }) => {
    const { setView } = useContext(PetMeetingContext);
    return (
        <Box
            sx={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                m: "20px",
            }}
        >
            <Button
                sx={{
                    backgroundColor: "#E9A260",
                    borderRadius: 2,
                    color: "white",
                    width: "120px",
                    padding: "10px",
                    fontWeight: "bold",
                    fontSize: "15px",
                }}
                onClick={() => saveLocation()}
            >
                위치저장
            </Button>
            <Button
                sx={{
                    backgroundColor: "#E9A260",
                    borderRadius: 2,
                    color: "white",
                    width: "120px",
                    fontWeight: "bold",
                    fontSize: "15px",
                }}
                onClick={() => setView("petMeeting")}
            >
                만나러가기
            </Button>
        </Box>
    );
};

export default LocationConfigBtns;
