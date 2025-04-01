import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UserIcon from "./UserIcon.jsx";

const FriendIcon = ({ friend }) => {
    const theme = useTheme();
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <UserIcon userInfo={friend} />
            <Typography marginTop="4px" fontSize="11px" color={theme.secondary}>
                {friend.user_name}
            </Typography>
        </Box>
    );
};

export default FriendIcon;
