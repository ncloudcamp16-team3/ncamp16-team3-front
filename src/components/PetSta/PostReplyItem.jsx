import React from "react";
import { Box, Typography } from "@mui/material";
import FriendsData from "../../mock/PetSta/friends.json";
import UserIcon from "./UserIcon.jsx";

const PostReplyItem = ({ reply, onReply }) => {
    const user = FriendsData.find((friend) => friend.user_id === reply.user_id);

    // @멘션을 찾아서 링크 스타일 적용
    const renderContentWithMentions = (content) => {
        const mentionRegex = /(@\S+)/g; // @뒤에 띄어쓰기 없는 문자열 찾기
        const parts = content.split(mentionRegex);

        return parts.map((part, index) =>
            mentionRegex.test(part) ? (
                <Typography key={index} component="span" color="primary" sx={{ cursor: "pointer", fontWeight: "bold" }}>
                    {part}
                </Typography>
            ) : (
                part
            )
        );
    };

    return (
        <Box display="flex" alignItems="flex-start" paddingTop={3} gap={1}>
            <UserIcon userInfo={user} />
            <Box flex={1}>
                <Box display="flex" alignItems="center">
                    <Typography fontWeight="bold">{user?.user_name || "알 수 없음"}</Typography>
                    <Typography fontSize="12px" color="gray" marginLeft={1}>
                        {reply.created_at}
                    </Typography>
                </Box>
                <Typography>{renderContentWithMentions(reply.content)}</Typography>
                <Typography
                    fontSize="14px"
                    color="#A8A8A9"
                    sx={{ cursor: "pointer", marginTop: 0.5 }}
                    onClick={() => onReply(user.user_name)}
                >
                    답글 달기
                </Typography>
            </Box>
        </Box>
    );
};

export default PostReplyItem;
