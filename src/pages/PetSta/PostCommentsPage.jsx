import React, { useRef, useState } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import comments from "../../mock/PetSta/comments.json";
import PostCommentItem from "../../components/PetSta/PostCommentItem.jsx";
import { useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";

const PostCommentPage = () => {
    const [replyTo, setReplyTo] = useState(null); // ← 선택된 유저 상태
    const [commentContent, setCommentContent] = useState(""); // ← 댓글 내용 상태
    const [isReply, setIsReply] = useState(false);
    const inputRef = useRef(null); // 👈 Input 태그를 위한 ref
    const { post_id } = useParams();
    const file_name = "haribo.jpg";
    const theme = useTheme();

    const handleReply = (userName) => {
        setIsReply(true);
        setReplyTo(userName);
        setCommentContent(`@${userName} `);

        setTimeout(() => {
            inputRef.current?.focus(); // 👈 포커스 이동
        }, 100); // 0ms도 가능하지만, 약간의 딜레이 주면 더 안정적
    };

    const handleCancelReply = () => {
        setIsReply(false);
        setReplyTo(null);
        setCommentContent("");
    };

    // post_id에 해당하는 댓글 중 parent_id가 null인 것만 필터링
    const filteredComments = comments.filter(
        (comment) => comment.post_id === Number(post_id) && comment.parent_id === null
    );

    return (
        <Box position="relative" height="80vh" margin={1} padding={2} border="1px solid #C8C8C8" borderRadius="10px">
            <Box textAlign="center" fontWeight="bold" fontSize="18px" paddingBottom={2}>
                댓글
            </Box>
            {filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                    <PostCommentItem key={comment.id} comment={comment} onReply={handleReply} />
                ))
            ) : (
                <Box textAlign="center" fontSize="16px" color="gray">
                    댓글이 없습니다.
                </Box>
            )}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                position="absolute"
                bottom={0}
                left={0}
                width="100%"
            >
                <AnimatePresence>
                    {isReply && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }} // 처음 아래에서 시작 (조절 가능)
                            animate={{ y: 0, opacity: 1 }} // 올라오면서 나타남
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
                                <Typography color={theme.secondary}>{replyTo}님에게 남기는 답글</Typography>
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
                            src={`/mock/Global/images/${file_name}`}
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
                                inputRef={inputRef} // 👈 여기에 연결
                                placeholder="댓글을 작성해주세요"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                sx={{
                                    caretColor: theme.brand3,
                                    marginLeft: "10px",
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                    flex: 1,
                                    mr: 2,
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
                        >
                            작성
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PostCommentPage;
