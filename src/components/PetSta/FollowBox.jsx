import React, { useContext, useState } from "react";
import UserIcon from "./UserIcon.jsx";
import { Box, Typography, Button } from "@mui/material";
import { Context } from "../../context/Context.jsx";
import { toggleFollow } from "../../services/memberService.js";

const FollowBox = ({ info }) => {
    const { user } = useContext(Context);

    const isMe = user.id === info.id;
    const [isFollowing, setIsFollowing] = useState(info.isFollow); // 초기 팔로우 여부

    const userInfo = {
        userId: info.id,
        isVisited: info.isVisited,
        userPhoto: info.userPhoto,
    };

    const handleFollowToggle = async () => {
        try {
            await toggleFollow(info.id); // 서버 요청
            setIsFollowing((prev) => !prev); // 로컬 상태 토글

            console.log(`${isFollowing ? "팔로우 취소" : "팔로우 하기"}: ${info.userName}`);
        } catch (error) {
            console.error("팔로우 요청 실패", error);
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center">
                <UserIcon userInfo={userInfo} />
                <Typography ml={1}>{info.userName}</Typography>
            </Box>
            {!isMe && (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleFollowToggle}
                    color={isFollowing ? "secondary" : "primary"}
                >
                    {isFollowing ? "팔로우취소" : "팔로우하기"}
                </Button>
            )}
        </Box>
    );
};

export default FollowBox;
