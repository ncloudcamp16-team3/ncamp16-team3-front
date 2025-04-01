import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const PostProfile = ({ user_name, user_photo, isAbsolute = false }) => {
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
            <Avatar
                src={`./mock/PetSta/images/${user_photo}`}
                alt={user_name}
                sx={{ width: 40, height: 40 }}
            />
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
