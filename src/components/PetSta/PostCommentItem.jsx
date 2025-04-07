import React, { useState } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import FriendsData from "../../mock/PetSta/friends.json";
import CommentsData from "../../mock/PetSta/comments.json";
import PostReplyItem from "./PostReplyItem"; // 답글 컴포넌트 추가

const PostCommentItem = ({ comment, onReply }) => {
    const [showReplies, setShowReplies] = useState(false);
    const user = FriendsData.find((friend) => friend.user_id === comment.user_id);

    // 현재 댓글의 답글 필터링
    const replies = CommentsData.filter((reply) => reply.parent_id === comment.id);

    return (
        <Box display="flex" flexDirection="column" borderBottom="1px solid #ccc" padding={1}>
            <Box display="flex" alignItems="flex-start">
                <Avatar
                    src={`/mock/PetSta/images/${user?.user_photo}`}
                    alt={user?.user_name}
                    sx={{ width: 40, height: 40, marginRight: 1 }}
                />
                <Box flex={1}>
                    <Box display="flex" alignItems="center">
                        <Typography fontWeight="bold">{user?.user_name || "알 수 없음"}</Typography>
                        <Typography fontSize="12px" color="gray" marginLeft={1}>
                            {comment.created_at}
                        </Typography>
                    </Box>
                    <Typography>{comment.content}</Typography>
                    <Typography
                        fontSize="14px"
                        color="#A8A8A9"
                        sx={{ cursor: "pointer", marginTop: 0.5 }}
                        onClick={() => onReply(user.user_name)}
                    >
                        답글 달기
                    </Typography>

                    {/* 답글 목록 */}
                    {showReplies &&
                        replies.map((reply) => <PostReplyItem key={reply.id} reply={reply} onReply={onReply} />)}
                    {replies.length > 0 && (
                        <Box display="flex" alignItems="center" marginTop={1.2}>
                            <Box
                                sx={{
                                    borderBottom: "1px solid #A8A8A9",
                                    width: "30px",
                                    marginRight: 1,
                                }}
                            />

                            <Typography
                                fontSize="14px"
                                color="#A8A8A9"
                                sx={{ cursor: "pointer" }}
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? "답글 숨기기" : `이전 답글 ${replies.length}개 보기`}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PostCommentItem;
