import React from "react";
import { Box } from "@mui/material";
import { useFollow } from "../../../context/FollowContext.jsx";
import { toggleFollow as toggleFollowAPI } from "../../../services/memberService.js";

const FollowButton = ({ userId, isWhite = false }) => {
    const { followMap, toggleFollow } = useFollow();
    const isFollow = followMap[userId] || false;

    const handleFollowClick = async () => {
        try {
            await toggleFollow(userId); // 로컬 상태 먼저 반영
            await toggleFollowAPI(userId); // 서버에도 요청
        } catch (error) {
            console.error("팔로우 실패", error);
        }
    };

    return (
        <Box
            border="1px solid"
            borderColor={isWhite ? "white" : "inherit"}
            borderRadius={1}
            paddingX={1}
            paddingY={0.2}
            textAlign="center"
            onClick={handleFollowClick}
            sx={{
                color: isWhite ? "white" : "inherit",
                cursor: "pointer",
                userSelect: "none", // 드래그 방지
            }}
        >
            {isFollow ? "팔로잉" : "팔로우"}
        </Box>
    );
};

export default FollowButton;
