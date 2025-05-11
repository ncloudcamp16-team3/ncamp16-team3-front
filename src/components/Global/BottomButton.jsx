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
            sx={{ cursor: "pointer", mb: "2px" }}
        >
            <img src={icon} width="32px" style={{ marginBottom: "3px" }} />
            <span>{label}</span>
        </Box>
    );
};

export default BottomButton;
