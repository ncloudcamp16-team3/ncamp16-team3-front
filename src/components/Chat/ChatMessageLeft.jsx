import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const ChatMessageLeft = ({ photo, text }) => {
    return (
        <Box display="flex" alignItems="flex-start" mb={1}>
            <Avatar src={photo} alt="상대방" sx={{ width: 36, height: 36, mr: 1 }} />
            <Box bgcolor="#f1f1f1" borderRadius="10px" px={2} py={1}>
                <Typography>{text}</Typography>
            </Box>
        </Box>
    );
};

export default ChatMessageLeft;
