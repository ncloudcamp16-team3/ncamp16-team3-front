import React, { useContext } from "react";
import UserIcon from "./UserIcon.jsx";
import { Box, Typography, Button } from "@mui/material";
import { Context } from "../../context/Context.jsx";
import UserFollows from "../../mock/PetSta/user-follows.json";

const FollowBox = ({ userInfo }) => {
    const { user } = useContext(Context);

    const isMe = user.id === userInfo.id;

    console.log(JSON.stringify(userInfo));
    const isFollowing = UserFollows.some(
        (relation) => relation.followerId === user.id && relation.followedId === userInfo.id
    );

    const handleFollowToggle = () => {
        if (isFollowing) {
            console.log(`팔로우 취소: ${userInfo.name}`);
            // 여기에 팔로우 취소 로직 추가
        } else {
            console.log(`팔로우 하기: ${userInfo.name}`);
            // 여기에 팔로우 요청 로직 추가
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center">
                <UserIcon userInfo={userInfo} />
                <Typography ml={1}>{userInfo.name}</Typography>
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
