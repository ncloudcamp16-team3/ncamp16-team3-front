import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, InputBase, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PostCommentItem from "../../components/PetSta/Post/PostCommentItem.jsx";
import { useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { addComment, getParentComments } from "../../services/petstaService.js";
import { Context } from "../../context/Context.jsx";

const PostCommentPage = () => {
    const [replyTo, setReplyTo] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [mentionUserList, setMentionUserList] = useState([]);
    const [comments, setComments] = useState([]);
    const [isReply, setIsReply] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [openRepliesMap, setOpenRepliesMap] = useState({});
    const [rightPosition, setRightPosition] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const { postId } = useParams();
    const { user, showModal } = useContext(Context);
    const theme = useTheme();
    const navigate = useNavigate();
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const data = await getParentComments(postId);
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const updatePosition = () => {
            const windowWidth = window.innerWidth;
            const layoutWidth = 500;
            if (windowWidth <= layoutWidth) {
                setRightPosition("0px");
            } else {
                const sideGap = (windowWidth - layoutWidth) / 2 - 8;
                setRightPosition(`${sideGap}px`);
            }
        };
        updatePosition();
        window.addEventListener("resize", updatePosition);
        return () => window.removeEventListener("resize", updatePosition);
    }, []);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleReply = (comment) => {
        setIsReply(true);
        setReplyTo(comment);
        setCommentContent(`@${comment.userName} `);
        setMentionUserList([{ nickname: comment.userName, userId: comment.userId }]);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleRemoveComment = (commentId) => {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    const handleCancelReply = () => {
        setIsReply(false);
        setReplyTo(null);
        setCommentContent("");
        setMentionUserList([]);
    };

    const extractMention = (text) => {
        const mentionRegex = /@(\S+)/;
        const match = text.match(mentionRegex);
        if (!match) return null;
        const nickname = match[1];
        const found = mentionUserList.find((u) => u.nickname === nickname);
        return found ? { nickname: found.nickname, userId: found.userId } : null;
    };

    const handleAddComment = async () => {
        const trimmed = (commentContent ?? "").trim();

        if (!trimmed) {
            showModal("", "댓글을 작성해 주세요!");
            return;
        }

        const mention = extractMention(trimmed);
        const hasMention = mention !== null;
        const fullMentionText = hasMention ? `@${mention.nickname}` : "";

        const isOnlyMention = hasMention && trimmed === fullMentionText;
        const isPartialMention = trimmed.startsWith("@") && hasMention === false;

        if (isPartialMention) {
            showModal("", "존재하지 않는 멘션입니다.");
            return;
        }

        if (isOnlyMention) {
            showModal("", "댓글 내용을 작성해 주세요.");
            return;
        }

        try {
            const mention = extractMention(commentContent);
            const requestBody = {
                content: commentContent,
                parentId: replyTo ? (replyTo.parentId ?? replyTo.id) : null,
                mention,
            };

            const response = await addComment(postId, requestBody);
            const newComment = response.data;

            if (!replyTo) {
                // 부모 댓글
                setComments((prev) => [newComment, ...prev]);
            } else {
                const parentId = replyTo.parentId ?? replyTo.id;

                // 답글이 닫혀 있다면 열기
                if (!openRepliesMap[parentId]) {
                    setOpenRepliesMap((prev) => ({ ...prev, [parentId]: true }));

                    // setState 비동기이므로 잠깐 기다렸다가 loadReplies 후 추가
                    setTimeout(() => {
                        // PostCommentItem 내부에서 replies 불러온 후 상태 관리
                        document.dispatchEvent(
                            new CustomEvent("reply-added", {
                                detail: { parentId, newReply: newComment },
                            })
                        );
                    }, 300);
                } else {
                    // 이미 열려 있으면 바로 이벤트로 추가
                    document.dispatchEvent(
                        new CustomEvent("reply-added", {
                            detail: { parentId, newReply: newComment },
                        })
                    );
                }
            }

            setCommentContent("");
            setIsReply(false);
            setReplyTo(null);
            setMentionUserList([]);
        } catch (error) {
            console.error(error);
            alert("댓글 작성에 실패했습니다!");
        }
    };

    return (
        <>
            <Box
                position="relative"
                margin={1}
                padding={2}
                borderRadius="10px"
                paddingTop="30px"
                marginBottom="68px"
                zIndex={1}
            >
                <Box
                    display="flex"
                    position="fixed"
                    top="50px"
                    right={rightPosition}
                    width="100%"
                    maxWidth="500px"
                    justifyContent="space-between"
                    bgcolor="white"
                    zIndex={2}
                    paddingX={1}
                    paddingY={1}
                >
                    <div></div>
                    <Box textAlign="center" fontWeight="bold" fontSize="18px">
                        댓글
                    </Box>
                    <Box onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
                        ❌
                    </Box>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <CircularProgress size={30} />
                    </Box>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <PostCommentItem
                            key={`${comment.id}-${refreshTrigger}`}
                            comment={comment}
                            onReply={handleReply}
                            showReplies={openRepliesMap[comment.id]}
                            onRemove={handleRemoveComment}
                            setShowReplies={(isOpen) =>
                                setOpenRepliesMap((prev) => ({ ...prev, [comment.id]: isOpen }))
                            }
                        />
                    ))
                ) : (
                    <Box textAlign="center" fontSize="16px" color="gray">
                        댓글이 없습니다.
                    </Box>
                )}
            </Box>

            <Box
                borderRadius="10px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                position="fixed"
                bottom={0}
                right={rightPosition}
                width="100%"
                maxWidth="500px"
                zIndex={3}
                bgcolor="white"
            >
                <AnimatePresence>
                    {isReply && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <Box
                                bgcolor={theme.brand1}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                padding={1}
                                zIndex={1}
                            >
                                <Typography color={theme.secondary}>{replyTo?.userName}님에게 남기는 답글</Typography>
                                <Button sx={{ padding: 0, width: "0px" }} onClick={handleCancelReply}>
                                    ❌
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Box display="flex" bgcolor={theme.brand2} width="100%" borderRadius="0 0 10px 10px" p={0.5} zIndex={2}>
                    <Box
                        sx={{
                            borderRadius: "50%",
                            border: "1px solid #D1D5DB",
                            overflow: "hidden",
                            width: "42px",
                            height: "42px",
                            margin: "5px",
                        }}
                    >
                        <Box
                            component="img"
                            src={user.path}
                            alt="profile"
                            sx={{
                                maxWidth: "100%",
                            }}
                        />
                    </Box>

                    <Box position="relative" display="flex" alignItems="center" width="100%">
                        <Box
                            display="flex"
                            fontWeight="bold"
                            bgcolor="white"
                            width="90%"
                            height="40px"
                            borderRadius="15px"
                            alignItems="center"
                        >
                            <InputBase
                                inputRef={inputRef}
                                placeholder="댓글을 작성해주세요"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddComment();
                                    }
                                }}
                                sx={{
                                    caretColor: theme.brand3,
                                    marginLeft: "10px",
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                    flex: 1,
                                    mr: 2,
                                    pr: "10px",
                                }}
                            />
                        </Box>

                        <Button
                            sx={{
                                position: "absolute",
                                right: "0",
                                borderRadius: "50px",
                                bgcolor: theme.brand3,
                                fontWeight: "bold",
                                color: "white",
                                fontSize: "15px",
                                height: "40px",
                                whiteSpace: "nowrap",
                            }}
                            onClick={handleAddComment}
                        >
                            작성
                        </Button>
                    </Box>
                </Box>
                <Box height="80px" bgcolor="white" zIndex={99}></Box>
            </Box>
        </>
    );
};

export default PostCommentPage;
