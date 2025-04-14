import React from "react";
import { Box, Typography } from "@mui/material";

const ChatMessageRight = ({ text }) => {
    return (
        <Box display="flex" justifyContent="flex-end" mb={1}>
            <Box bgcolor="#b2e5ff" borderRadius="10px" px={2} py={1}>
                <Typography>{text}</Typography>
            </Box>
        </Box>
    );
};

export default ChatMessageRight;
