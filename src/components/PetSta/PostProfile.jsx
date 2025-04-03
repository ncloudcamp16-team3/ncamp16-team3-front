import React from "react";
import { Box, Typography } from "@mui/material";
import UserIcon from "./UserIcon.jsx";
import userData from "../../mock/PetSta/friends.json";

const PostProfile = ({ user_name, user_id, isAbsolute = false }) => {
    console.log(user_id);
    const userInfo = userData.find((u) => u.user_id === Number(user_id));

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
                {user_name}
            </Typography>
        </Box>
    );
};

export default PostProfile;
