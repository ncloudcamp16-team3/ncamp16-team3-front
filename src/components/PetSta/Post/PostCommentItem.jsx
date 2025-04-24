import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PostReplyItem from "./PostReplyItem.jsx";
import UserIcon from "../UserIcon.jsx";
import { getReplyComments } from "../../../services/petstaService.js";

const PostCommentItem = ({ comment, onReply, setShowReplies, showReplies, refreshTrigger }) => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log(comment);
    const user = {
        userName: comment.userName,
        userId: comment.userId,
        isView: comment.isView,
        userPhoto: comment.userPhoto,
    };

    const loadReplies = async () => {
        try {
            setLoading(true);
            const fetchedReplies = await getReplyComments(comment.id);
            setReplies(fetchedReplies);
        } catch (error) {
            console.error("답글 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleReplies = async () => {
        if (!showReplies && replies.length === 0) {
            await loadReplies();
        }
        setShowReplies(!showReplies);
    };

    // ⭐ refreshTrigger 변경 시 + 펼쳐진 상태면 답글 새로고침
    useEffect(() => {
        if (showReplies) {
            loadReplies();
        }
    }, [refreshTrigger]);

    return (
        <Box display="flex" flexDirection="column" borderBottom="1px solid #ccc" padding={1}>
            <Box display="flex" alignItems="flex-start" gap={1}>
                <UserIcon userInfo={user} />
                <Box flex={1}>
                    <Box display="flex" alignItems="center">
                        <Typography fontWeight="bold">{user?.userName || "알 수 없음"}</Typography>
                        <Typography fontSize="12px" color="gray" marginLeft={1}>
                            {comment.createdAt}
                        </Typography>
                    </Box>
                    <Typography>{comment.content}</Typography>
                    <Typography
                        fontSize="14px"
                        color="#A8A8A9"
                        sx={{ cursor: "pointer", marginTop: 0.5 }}
                        onClick={() => onReply(comment)}
                    >
                        답글 달기
                    </Typography>

                    {showReplies &&
                        replies.map((reply) => <PostReplyItem key={reply.id} reply={reply} onReply={onReply} />)}
                    {comment.replyCount > 0 && (
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
                                onClick={handleToggleReplies}
                            >
                                {loading
                                    ? "불러오는 중..."
                                    : showReplies
                                      ? "답글 숨기기"
                                      : `이전 답글 ${comment.replyCount}개 보기`}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PostCommentItem;
