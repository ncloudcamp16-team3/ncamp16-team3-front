import React from "react";
import { Box, Typography, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChatItem = ({ photo, name, lastMessage, roomId, unreadCount }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/chat/room/${roomId}`);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={1}
            mb={1}
            onClick={handleClick}
            sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
        >
            <Box display="flex" alignItems="center">
                <img src={photo} alt={name} style={{ width: 50, height: 50, borderRadius: "50%", marginRight: 12 }} />
                <Box display="flex" flexDirection="column">
                    <Typography fontWeight="bold">{name}</Typography>
                    <Typography color="textSecondary">{lastMessage}</Typography>
                </Box>
            </Box>

            {/* 🔴 오른쪽에 안 읽은 메시지 수 뱃지 */}
            {unreadCount > 0 && (
                <Badge badgeContent={unreadCount} color="error" sx={{ "& .MuiBadge-badge": { right: 0, top: 0 } }} />
            )}
        </Box>
    );
};

export default ChatItem;
