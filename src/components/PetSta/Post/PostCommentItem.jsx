import React, { useEffect, useState, useContext, useRef } from "react";
import { Box, Typography } from "@mui/material";
import UserIcon from "../UserIcon.jsx";
import { deletePetstaComment, getReplyComments } from "../../../services/petstaService.js";
import PostReplyItem from "./PostReplyItem.jsx";
import MyCommentDropdown from "./MyCommentDropdown.jsx";
import { Context } from "../../../context/Context.jsx";

const PostCommentItem = ({ comment, onReply, setShowReplies, showReplies, onRemove }) => {
    const [replies, setReplies] = useState([]);
    const [replyCount, setReplyCount] = useState(comment.replyCount);
    const [loading, setLoading] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [localComment, setLocalComment] = useState(comment); // 🔥 comment 상태로 관리

    const dropdownRef = useRef(null);
    const { user } = useContext(Context);
    const isMyComment = user?.id === comment.userId;
    // console.log("받은시간:" + localComment.createdAt);
    const formattedCreatedAt = new Date(localComment.createdAt).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const userInfo = {
        userName: localComment.userName,
        userId: localComment.userId,
        isVisited: localComment.isVisited,
        userPhoto: localComment.userPhoto,
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropOpen]);

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
    const handleRemoveReply = (commentId) => {
        setReplies((prev) => prev.filter((c) => c.id !== commentId));
        setReplyCount((prev) => prev - 1);
    };

    useEffect(() => {
        const listener = (e) => {
            const { parentId, newReply } = e.detail;
            if (parentId === comment.id) {
                setReplies((prev) => [...prev, newReply]);
                setReplyCount((prev) => prev + 1);
            }
        };

        document.addEventListener("reply-added", listener);
        return () => {
            document.removeEventListener("reply-added", listener);
        };
    }, []);

    const requestCommentDelete = async () => {
        try {
            await deletePetstaComment(comment.id);
            if (replyCount === 0) {
                onRemove(comment.id);
            } else {
                setLocalComment({ ...localComment, deleted: true }); // 🔥 여기서 상태 변경
                setRefreshTrigger((prev) => prev + 1);
            }
        } catch (e) {
            alert("삭제 실패");
        }
    };

    useEffect(() => {
        if (showReplies) {
            loadReplies();
        }
    }, [refreshTrigger]);

    return (
        <Box display="flex" flexDirection="column" borderBottom="1px solid #ccc" padding={1}>
            <Box display="flex" alignItems="flex-start" gap={1} position="relative">
                {!localComment.deleted && <UserIcon userInfo={userInfo} />}
                <Box flex={1}>
                    {localComment.deleted ? (
                        <Typography sx={{ color: "#A8A8A9", fontStyle: "italic" }}>삭제된 댓글입니다</Typography>
                    ) : (
                        <>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <Typography fontWeight="bold">{userInfo.userName || "알 수 없음"}</Typography>
                                    <Typography fontSize="12px" color="gray" marginLeft={1}>
                                        {formattedCreatedAt}
                                    </Typography>
                                </Box>
                                {isMyComment && (
                                    <Box sx={{ position: "relative" }} ref={dropdownRef}>
                                        <Typography
                                            onClick={() => setDropOpen(!dropOpen)}
                                            fontSize="20px"
                                            sx={{ ml: 1, cursor: "pointer", userSelect: "none" }}
                                        >
                                            ⋯
                                        </Typography>
                                        <MyCommentDropdown
                                            open={dropOpen}
                                            setOpen={setDropOpen}
                                            onDelete={() => {
                                                requestCommentDelete();
                                                setDropOpen(false);
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Typography>{localComment.content}</Typography>

                            <Typography
                                fontSize="14px"
                                color="#A8A8A9"
                                sx={{ cursor: "pointer", marginTop: 0.5 }}
                                onClick={() => onReply(localComment)}
                            >
                                답글 달기
                            </Typography>
                        </>
                    )}

                    {showReplies &&
                        replies.map((reply) => (
                            <PostReplyItem
                                key={reply.id}
                                reply={reply}
                                onReply={onReply}
                                onRemove={handleRemoveReply}
                            />
                        ))}

                    {replyCount > 0 && (
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
                                      : `이전 답글 ${replyCount}개 보기`}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PostCommentItem;
