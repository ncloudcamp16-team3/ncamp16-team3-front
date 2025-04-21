import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FriendsData from "../../../mock/PetSta/friends.json";
import UserIcon from "../UserIcon.jsx";

const PostReplyItem = ({ reply, onReply }) => {
    const user = FriendsData.find((friend) => friend.userId === reply.userId);
    const navigate = useNavigate();

    const renderContentWithMentions = (content) => {
        const mentionRegex = /(@\S+)/g;
        const parts = content.split(mentionRegex);

        return parts.map((part, index) => {
            if (mentionRegex.test(part)) {
                const mentionedName = part.replace("@", "");
                const mentionedUser = FriendsData.find((f) => f.userName === mentionedName);

                return (
                    <Typography
                        key={index}
                        component="span"
                        color="primary"
                        sx={{ cursor: "pointer", fontWeight: "bold" }}
                        onClick={() => {
                            if (mentionedUser) {
                                navigate(`/petsta/user/${mentionedUser.userId}`);
                            }
                        }}
                    >
                        {part}
                    </Typography>
                );
            }
            return part;
        });
    };

    return (
        <Box display="flex" alignItems="flex-start" paddingTop={3} gap={1}>
            <UserIcon userInfo={user} />
            <Box flex={1}>
                <Box display="flex" alignItems="center">
                    <Typography fontWeight="bold">{user?.userName || "알 수 없음"}</Typography>
                    <Typography fontSize="12px" color="gray" marginLeft={1}>
                        {reply.createdAt}
                    </Typography>
                </Box>
                <Typography>{renderContentWithMentions(reply.content)}</Typography>
                <Typography
                    fontSize="14px"
                    color="#A8A8A9"
                    sx={{ cursor: "pointer", marginTop: 0.5 }}
                    onClick={() => onReply(user.userName)}
                >
                    답글 달기
                </Typography>
            </Box>
        </Box>
    );
};

export default PostReplyItem;
