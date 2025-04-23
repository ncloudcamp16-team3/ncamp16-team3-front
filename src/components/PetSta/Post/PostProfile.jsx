import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import UserIcon from "../UserIcon.jsx";
import { toggleFollow as toggleFollowAPI } from "../../../services/memberService.js";
import { useFollow } from "../../../context/FollowContext.jsx";
import { Context } from "../../../context/Context.jsx";
// ★ 추가

const PostProfile = ({ userName, userId, userPhoto, isView, isAbsolute = false }) => {
    const { user } = useContext(Context);
    const { followMap, toggleFollow } = useFollow(); // ★ 추가
    const isFollow = followMap[userId] || false; // ★ followMap에서 follow 여부 가져옴
    const userInfo = {
        userName,
        userId,
        userPhoto,
        isView,
    };

    const handleFollowClick = async () => {
        try {
            await toggleFollow(userId); // context 상태 변경
            await toggleFollowAPI(userId); // 서버 요청
        } catch (error) {
            console.error("팔로우 실패", error);
        }
    };

    return (
        <Box
            sx={{
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                padding: "8px",
                position: isAbsolute ? "absolute" : "static",
                top: isAbsolute ? 5 : "auto",
                left: isAbsolute ? 0 : "auto",
                zIndex: isAbsolute ? 1 : "auto",
                width: "100%",
            }}
        >
            <Box display="flex" alignItems="center">
                <UserIcon userInfo={userInfo} />
                <Typography
                    sx={{
                        color: isAbsolute ? "white" : "inherit",
                        marginLeft: 1,
                        fontWeight: "bold",
                    }}
                >
                    {userName}
                </Typography>
            </Box>
            {user.id !== userId && (
                <Box
                    border="1px solid"
                    borderColor={isAbsolute ? "white" : "inherit"}
                    borderRadius={1}
                    paddingX={1}
                    paddingY={0.2}
                    textAlign="center"
                    onClick={handleFollowClick}
                    sx={{
                        color: isAbsolute ? "white" : "inherit",
                        cursor: "pointer",
                    }}
                >
                    {isFollow ? "팔로잉" : "팔로우"}
                </Box>
            )}
        </Box>
    );
};

export default PostProfile;
