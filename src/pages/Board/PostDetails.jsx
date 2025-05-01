import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import ImgSlide from "../../components/Board/ImgSlider.jsx";
import PostTitleBar from "../../components/Board/PostTitleBar.jsx";
import DeletePostModal from "../../components/Board/DeletePostModal.jsx";
import WriterInfo from "../../components/Board/WriterInfo.jsx";
import UpdatePostModal from "../../components/Board/UpdatePostModal.jsx";
import WriteCommentBar from "../../components/Board/WriteCommentBar.jsx";
import { Context } from "../../context/Context.jsx";
import UsedMarketBar from "../../components/Board/UsedMarketBar.jsx";
import PostCenterBtns from "../../components/Board/PostCenterBtns.jsx";
import { useParams } from "react-router-dom";
import {
    addComment,
    getBoardDetail,
    getBookmarkedAndLiked,
    toggleBookmarked,
    toggleLiked,
} from "../../services/boardService.js";
import { produce } from "immer";
import CommentCard from "../../components/Board/CommentCard.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const PostDetails = () => {
    const { postId } = useParams();
    const { boardType, user } = useContext(Context);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [comment, setComment] = useState("");
    const [liked, setLiked] = useState(false);
    const [bookMarked, setBookMarked] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [isReply, setIsReply] = useState(false);
    const commentInputRef = useRef(null);
    const commentRefs = useRef({});
    const theme = useTheme();

    const scrollToComment = (commentId) => {
        const el = commentRefs.current[commentId];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const [postData, setPostData] = useState({
        id: null,
        boardTypeId: null,
        title: "",
        content: "",
        authorNickname: "",
        authorId: null,
        authorAddress: "",
        authorProfileImg: "",
        createdAt: "",
        likeCount: 0,
        commentCount: 0,
        price: 0,
        sell: false,
        address: "",
        firstImageUrl: null,
        imageUrls: [],
        comments: [],
    });

    const handleReply = (commentId, authorNickname) => {
        const mentionMarkup = `@${authorNickname} `;
        if (isReply) {
            const result = comment.replace(/^@\S+\s*/, "");
            setComment(mentionMarkup + result);
            setReplyingTo({ commentId: commentId, authorNickname: authorNickname });
            setIsReply(true);

            setTimeout(() => {
                commentInputRef.current?.focus();
            }, 1);
        } else {
            setComment((prev) => mentionMarkup + prev);
            setReplyingTo({ commentId: commentId, authorNickname: authorNickname });
            setIsReply(true);

            setTimeout(() => {
                commentInputRef.current?.focus();
            }, 1);
        }
        setReplyingTo({ commentId: commentId, authorNickname: authorNickname });

        setTimeout(() => {
            commentInputRef.current?.focus();
        }, 1);
    };

    const requestCommentCreate = () => {
        const message = comment.replace(/^@\S+\s*/, "");

        addComment(message, postId, user.id, replyingTo?.commentId)
            .then((res) => {
                console.log("응답 결과: " + res.message);
                window.location.reload();
            })
            .catch((err) => {
                console.log("에러 발생: " + err.message);
            });
    };

    useEffect(() => {
        const mentionPattern = /@([^\s]+)/g;
        const rawMentions = comment.match(mentionPattern) || [];

        const mentions = rawMentions.map((m) => m.slice(1));

        if (isReply) {
            if (!mentions.includes(replyingTo?.authorNickname)) {
                handleCancelReply();
            }
        }
    }, [comment]);

    useEffect(() => {
        const initPostDetailPage = async () => {
            getBoardDetail(postId)
                .then((res) => {
                    const data = res.data;
                    console.log(data);
                    setPostData(data);
                    console.log("응답 결과 : " + res.message);
                })
                .catch((err) => {
                    console.log("에러 발생 : " + err.message);
                });

            getBookmarkedAndLiked(user.id, postId)
                .then((res) => {
                    const data = res.data;
                    console.log("응답 결과" + res.message);
                    console.log(data);
                    setLiked(data.liked);
                    setBookMarked(data.bookmarked);
                })
                .catch((err) => {
                    console.log("에러 발생" + err.message);
                });
        };

        initPostDetailPage();
    }, []);

    const likeBtnClick = () => {
        toggleLiked(user.id, postId, liked)
            .then((res) => {
                setLiked(!liked);
                if (liked) {
                    setPostData(
                        produce((draft) => {
                            draft.likeCount -= 1;
                        })
                    );
                } else {
                    setPostData(
                        produce((draft) => {
                            draft.likeCount += 1;
                        })
                    );
                }
                console.log("응답 결과: " + res.message);
            })
            .catch((err) => {
                console.log("에러 발생: " + err.message);
            });
    };

    const bookMarkBtnClick = () => {
        toggleBookmarked(user.id, postId, bookMarked)
            .then((res) => {
                setBookMarked(!bookMarked);
                console.log("응답 결과: " + res.message);
            })
            .catch((err) => {
                console.log("에러 발생: " + err.message);
            });
    };

    const handleCancelReply = () => {
        setIsReply(false);
        setReplyingTo(null);
        setComment("");
    };

    return (
        <Box>
            <PostTitleBar
                postData={postData}
                setOpenDeleteModal={setOpenDeleteModal}
                setOpenUpdateModal={setOpenUpdateModal}
            />
            <Box
                sx={{
                    margin: "0 10px 80px 10px",
                }}
            >
                {postData?.imageUrls?.length > 0 && <ImgSlide photos={postData.imageUrls} />}
                <WriterInfo postData={postData} />
                <Typography
                    sx={{
                        fontSize: "22px",
                        mb: "5px",
                    }}
                >
                    제목
                </Typography>
                <InputBase
                    value={postData.title}
                    readOnly
                    sx={{
                        width: "100%",
                        px: "10px",
                        border: "1px solid rgba(0, 0, 0, 0.3)",
                        borderRadius: "10px",
                        mb: "10px",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: "22px",
                        mb: "5px",
                    }}
                >
                    자세한 설명
                </Typography>
                <InputBase
                    value={postData.content}
                    readOnly
                    multiline
                    fullWidth
                    minRows={3}
                    maxRows={Infinity}
                    sx={{
                        px: "15px",
                        py: "10px",
                        border: "1px solid rgba(0, 0, 0, 0.3)",
                        borderRadius: "10px",
                        lineHeight: 1.5,
                        overflow: "hidden",
                        resize: "none",
                    }}
                />

                {boardType.id === 2 && (
                    <Box sx={{ mt: "10px" }}>
                        <Typography
                            sx={{
                                fontSize: "22px",
                                mb: "5px",
                            }}
                        >
                            거래 희망 장소
                        </Typography>
                        <InputBase
                            value={postData.address}
                            sx={{
                                width: "100%",
                                px: "10px",
                                border: "1px solid rgba(0, 0, 0, 0.3)",
                                borderRadius: "10px",
                                mb: "10px",
                            }}
                        />

                        <Box
                            sx={{
                                position: "fixed",
                                bottom: "60px",
                                left: "10px",
                                right: "10px",
                                height: "80px",
                                maxWidth: "480px",
                                margin: "0 auto",
                                backgroundColor: "white",
                                zIndex: 999,
                            }}
                        />
                    </Box>
                )}

                {boardType.id !== 2 && (
                    <Box>
                        <PostCenterBtns
                            liked={liked}
                            likeBtnClick={likeBtnClick}
                            bookMarkBtnClick={bookMarkBtnClick}
                            bookMarked={bookMarked}
                        />

                        <Box sx={{ display: "flex", flexDirection: "column", p: "10px 10px 10px 10px" }}>
                            <Box sx={{ display: "flex", gap: "10px" }}>
                                <Typography sx={{ fontSize: "18px" }}>좋아요{postData.likeCount}개</Typography>
                                <Typography sx={{ fontSize: "18px" }}>댓글 {postData.commentCount}개</Typography>
                            </Box>
                            {postData.comments?.map((commentItem) => {
                                return (
                                    <Box
                                        key={commentItem.id}
                                        ref={(el) => {
                                            if (el) commentRefs.current[commentItem.id] = el;
                                        }}
                                        id={`comment-${commentItem.id}`}
                                    >
                                        <CommentCard
                                            commentItem={commentItem}
                                            handleReply={handleReply}
                                            scrollToComment={scrollToComment}
                                        />
                                        {commentItem.children?.map((child) => {
                                            return (
                                                <Box
                                                    key={child.id}
                                                    ref={(el) => {
                                                        if (el) commentRefs.current[child.id] = el;
                                                    }}
                                                    id={`comment-${child.id}`}
                                                >
                                                    <CommentCard
                                                        commentItem={child}
                                                        handleReply={handleReply}
                                                        scrollToComment={scrollToComment}
                                                    />
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    position: "fixed",
                    bottom: "60px",
                    left: "10px",
                    right: "10px",
                    height: "80px",
                    maxWidth: "480px",
                    margin: "0 auto",
                    backgroundColor: "white",
                    zIndex: 999,
                }}
            />

            {boardType.id === 2 ? (
                <UsedMarketBar postData={postData} bookMarked={bookMarked} bookMarkBtnClick={bookMarkBtnClick} />
            ) : (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: "85px",
                        left: "10px",
                        right: "10px",
                        maxWidth: "480px",
                        zIndex: 1000,
                        margin: "0 auto",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        p: "2px",
                    }}
                >
                    <AnimatePresence>
                        {isReply && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }} // 처음 아래에서 시작 (조절 가능)
                                animate={{ y: 0, opacity: 1 }} // 올라오면서 나타남
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ width: "100%" }}
                            >
                                <Box
                                    bgcolor={theme.brand1}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    padding={1}
                                    zIndex={1}
                                >
                                    <Typography color={theme.secondary}>
                                        {replyingTo?.authorNickname}님에게 남기는 답글
                                    </Typography>
                                    <Button sx={{ padding: 0, width: "0px" }} onClick={handleCancelReply}>
                                        ❌
                                    </Button>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <WriteCommentBar
                        postId={postData.id}
                        comment={comment}
                        setComment={setComment}
                        liked={liked}
                        likeBtnClick={likeBtnClick}
                        commentInputRef={commentInputRef}
                        requestCommentCreate={requestCommentCreate}
                        isReply={isReply}
                    />
                </Box>
            )}

            <DeletePostModal
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                postId={postData.id}
            />
            <UpdatePostModal
                openUpdateModal={openUpdateModal}
                setOpenUpdateModal={setOpenUpdateModal}
                postId={postData.id}
            />
        </Box>
    );
};

export default PostDetails;
