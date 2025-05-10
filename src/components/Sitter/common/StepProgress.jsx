import React from "react";
import { Box, LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const AnimatedLinearProgress = styled(LinearProgress)({
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
    "& .MuiLinearProgress-bar": {
        borderRadius: 3,
        backgroundColor: "#E9A260",
        transition: "transform 0.5s ease-in-out",
    },
});

const StepProgress = ({ progress }) => {
    return (
        <Box sx={{ width: "100%", mb: 3 }}>
            <AnimatedLinearProgress variant="determinate" value={progress} />
        </Box>
    );
};

export default StepProgress;
