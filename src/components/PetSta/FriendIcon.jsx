import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UserIcon from "./UserIcon.jsx";

const FriendIcon = React.memo(({ friend }) => {
    const userInfo = {
        userId: friend.id,
        userPhoto: friend.photo,
        isVisited: friend.isVisited,
    };
    const theme = useTheme();
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <UserIcon userInfo={userInfo} />
            <Typography
                marginTop="4px"
                fontSize="11px"
                color={theme.secondary}
                noWrap
                sx={{
                    maxWidth: "44px", // 원하는 최대 너비
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "center",
                }}
            >
                {friend.name}
            </Typography>
        </Box>
    );
});

export default FriendIcon;
