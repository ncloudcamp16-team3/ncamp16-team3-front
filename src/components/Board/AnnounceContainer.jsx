import React from "react";
import { Box, Typography } from "@mui/material";
import Speaker from "../../assets/images/Board/speaker.svg";
import { useTheme } from "@mui/material/styles";
import AnnounceSlider from "./AnnounceSlider.jsx";

const AnnounceContainer = () => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: "flex",
                borderRadius: "10px",
                borderColor: "#C8C8C8",
                backgroundColor: theme.brand5,
                width: "100%",
                my: "10px",
                alignItems: "center",
                py: "6px",
                px: "12px",
            }}
        >
            <Box component="img" src={Speaker} sx={{ mr: "5px" }}></Box>
            <Typography
                sx={{
                    verticalAlign: "middle",
                }}
            >
                공지
            </Typography>
            <AnnounceSlider />
        </Box>
    );
};

export default AnnounceContainer;
