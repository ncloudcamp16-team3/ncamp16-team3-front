import React from "react";
import { Box, Typography } from "@mui/material";
import UserIcon from "./UserIcon.jsx";
import userData from "../../mock/PetSta/friends.json";

const PostProfile = ({ userName, userId, isAbsolute = false }) => {
    console.log(userId);
    const userInfo = userData.find((u) => u.userId === Number(userId));

    console.log("userInfo", userInfo);
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                position: isAbsolute ? "absolute" : "static",
                top: isAbsolute ? 10 : "auto",
                left: isAbsolute ? 10 : "auto",
                zIndex: isAbsolute ? 1 : "auto", // 비디오 위로 올리기 위한 설정
            }}
        >
            <UserIcon userInfo={userInfo} />
            <Typography
                sx={{
                    color: isAbsolute ? "white" : "inherit", // 색상 다르게 설정
                    marginLeft: 1,
                    fontWeight: "bold",
                }}
            >
                {userName}
            </Typography>
        </Box>
    );
};

export default PostProfile;
