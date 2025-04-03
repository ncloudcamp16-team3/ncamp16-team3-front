import React from "react";
import { Box, Typography } from "@mui/material";
import calendarImg from "../../assets/images/PetMeeting/calendar.svg";
import { useNavigate } from "react-router-dom";

const Scheduler = ({ petName }) => {
    const navigate = useNavigate();

    return (
        <Box
            onClick={() => navigate("/calendar")}
            sx={{
                display: "flex",
                background: "#E9A260",
                borderRadius: "5px",
                padding: "15px",
                alignItems: "center",
                color: "white",
                justifyContent: "space-between",
                cursor: "pointer",
            }}
        >
            <Box>
                <Typography
                    variant="h3"
                    sx={{
                        margin: "0 0 0 2px",
                    }}
                >
                    일정관리
                </Typography>
                <Typography variant="body1">{petName}의 일정을 관리해보아요</Typography>
            </Box>
            <Box
                component="img"
                src={calendarImg}
                alt="calendar Icon"
                sx={{
                    margin: "0 5px 0 0",
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                }}
            ></Box>
        </Box>
    );
};

export default Scheduler;
