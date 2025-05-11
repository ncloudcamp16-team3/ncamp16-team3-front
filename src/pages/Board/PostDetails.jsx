import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";
import ImgSlide from "../../components/Global/ImgSlider.jsx";
import PostTitleBar from "../../components/Board/PostTitleBar.jsx";
import DeletePostModal from "../../components/Board/DeletePostModal.jsx";
import WriterInfo from "../../components/Board/WriterInfo.jsx";
import UpdatePostModal from "../../components/Board/UpdatePostModal.jsx";
import WriteCommentBar from "../../components/Board/WriteCommentBar.jsx";
import { Context } from "../../context/Context.jsx";
import UsedMarketBar from "../../components/Board/UsedMarketBar.jsx";
import PostCenterBtns from "../../components/Board/PostCenterBtns.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {
    addComment,
    completeSell,
    getBoardDetail,
    getBookmarkedAndLiked,
    getComments,
    toggleBookmarked,
    toggleLiked,
} from "../../services/boardService.js";
import { produce } from "immer";
import CommentCard from "../../components/Board/CommentCard.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { createChatRoom, postTradeCheck, postTradeStart } from "../../services/chatService.js";
import GlobalConfirmModal from "../../components/Global/GlobalConfirmModal.jsx";

const PostDetails = () => {
    const { postId } = useParams();
    const { boardType, user, nc, showModal, handleSnackbarOpen, boardTypeList, setBoardType } = useContext(Context);
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
    const navigate = useNavigate();
    const [postComments, setPostComments] = useState([]);
    const [openCompleteModal, setOpenCompleteModal] = useState(false);

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

    const scrollToComment = (commentId) => {
        const el = commentRefs.current[commentId];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const handleTradeChat = async () => {
        if (!user || !nc || !postData.authorId) return;

        try {
            const targetUserId = postData.authorId;
            const myId = user.id;
            const uniqueId = await createChatRoom(targetUserId);

            // 채널 조회
            const filter = { name: uniqueId };
            const channels = await nc.getChannels(filter, {}, { per_page: 1 });
            const edge = (channels.edges || [])[0];
            let channelId;

            if (edge) {
                channelId = edge.node.id;
            } else {
                // 채널 없으면 생성
                const newChannel = await nc.createChannel({
                    type: "PRIVATE",
                    name: uniqueId,
                });
                channelId = newChannel.id;
                await nc.addUsers(channelId, [`ncid${myId}`, `ncid${targetUserId}`]);
            }

            // 구독 여부 확인 후 구독
            const subFilter = {
                channel_id: channelId,
                user_id: `ncid${myId}`,
            };
            const subs = await nc.getSubscriptions(subFilter, {}, { per_page: 1 });
            if (!subs.length) {
                await nc.subscribe(channelId);
            }

            // 매칭 여부 확인 및 없으면 매칭 등록
            const matched = await postTradeCheck(postData.id);
            if (!matched.data) {
                await postTradeStart(postData.id);

                // 메시지 전송
                const payload = {
                    customType: "TRADE",
                    content: {
                        title: postData.title,
                        price: postData.price,
                        image: postData.imageUrls?.[0]
                            ? postData.imageUrls[0]
                            : "https://kr.object.ncloudstorage.com/tailfriends-buck/uploads/board/join-logo.png",
                        postId: postData.id,
                        text: "상대방과의 거래가 시작되었어요.",
                    },
                };

                await nc.sendMessage(channelId, {
                    type: "text",
                    message: JSON.stringify(payload),
                });
            }

            navigate(`/chat/room/${channelId}`);
        } catch (e) {
            console.error("❌ 중고거래 채팅 생성 실패:", e);
        }
    };

    const handleSellComplete = () => {
        completeSell(postData.id)
            .then((res) => {
                setOpenCompleteModal(false);
                setPostData((prev) =>
                    produce(prev, (draft) => {
                        draft.sell = false;
                    })
                );
            })
            .catch((err) => {});
    };

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
            .then(() => {
                setComment("");
                setPostData((prev) =>
                    produce(prev, (draft) => {
                        draft.commentCount = draft.commentCount + 1;
                    })
                );
                return getComments(postId);
            })
            .then((res) => {
                setPostComments(res.data);
            })
            .catch((err) => {
                handleSnackbarOpen(err.message, "error");
                setComment("");
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
                    setPostData(data);
                    setPostComments(data.comments);

                    setBoardType(boardTypeList.find((item) => item.id === data.boardTypeId));
                })
                .catch((err) => {
                    showModal("", err.message, () => {
                        navigate("/board");
                    });
                });

            getBookmarkedAndLiked(user.id, postId)
                .then((res) => {
                    const data = res.data;
                    setLiked(data.liked);
                    setBookMarked(data.bookmarked);
                })
                .catch(() => {});
        };

        initPostDetailPage();
    }, []);

    const likeBtnClick = () => {
        toggleLiked(user.id, postId, liked)
            .then(() => {
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
            })
            .catch(() => {});
    };

    const bookMarkBtnClick = () => {
        toggleBookmarked(user.id, postId, bookMarked)
            .then(() => {
                setBookMarked(!bookMarked);
            })
            .catch(() => {});
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
                {postData?.imageUrls?.length > 0 && <ImgSlide photos={postData.imageUrls} borderRadius={true} />}
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
                    내용
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
                            readOnly
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
                            {postComments?.map((commentItem) => {
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
                                            handleSnackbarOpen={handleSnackbarOpen}
                                            setPostComments={setPostComments}
                                            postId={postId}
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
                                                        handleSnackbarOpen={handleSnackbarOpen}
                                                        setPostComments={setPostComments}
                                                        postId={postId}
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
                <UsedMarketBar
                    postData={postData}
                    setPostData={setPostData}
                    bookMarked={bookMarked}
                    bookMarkBtnClick={bookMarkBtnClick}
                    onClickChat={handleTradeChat}
                    openCompleteModal={() => setOpenCompleteModal(true)}
                />
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
            <GlobalConfirmModal
                open={openCompleteModal}
                onClose={() => setOpenCompleteModal(false)}
                cancelText="취소"
                confirmText="확인"
                description="거래완료 하시겠습니까?"
                onConfirm={handleSellComplete}
            />
        </Box>
    );
};

export default PostDetails;
