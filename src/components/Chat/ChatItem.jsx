import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChatItem = ({ photo, name, lastMessage, roomId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/chat/room/${roomId}`);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            p={1}
            mb={1}
            onClick={handleClick}
            sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
        >
            <img
                src={`/mock/Global/images/${photo}`}
                alt={name}
                style={{ width: 50, height: 50, borderRadius: "50%", marginRight: 12 }}
            />
            <Box display="flex" flexDirection="column">
                <Typography fontWeight="bold">{name}</Typography>
                <Typography color="textSecondary">{lastMessage}</Typography>
            </Box>
        </Box>
    );
};

export default ChatItem;
