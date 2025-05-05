import React from "react";
import { Box, Typography } from "@mui/material";

const StepProgress = ({ progress }) => {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                mb: 3,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    bgcolor: "#e0e0e0",
                    height: "4px",
                    borderRadius: "2px",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        width: `${progress}%`,
                        bgcolor: "#E9A260",
                        height: "100%",
                        borderRadius: "2px",
                    }}
                />
            </Box>
            <Typography
                sx={{
                    ml: 1,
                    color: "#E9A260",
                    fontWeight: "bold",
                }}
            >
                {Math.round(progress)}%
            </Typography>
        </Box>
    );
};

export default StepProgress;
