import React from "react";
import { Box } from "@mui/material";

const BottomButton = ({ icon, label, onClick }) => {
    return (
        <Box
            component="div"
            display="flex"
            flexDirection="column"
            alignItems="center"
            className="bottom-button"
            onClick={onClick}
        >
            <img src={icon} width="40px" />
            <span>{label}</span>
        </Box>
    );
};

export default BottomButton;
