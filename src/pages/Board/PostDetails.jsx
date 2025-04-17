import React, { useContext, useEffect, useState } from "react";
import { Box, InputBase, Typography } from "@mui/material";
import ImgSlide from "../../components/Board/ImgSlider.jsx";
import PostData from "../../mock/Board/postData.json";
import PostTitleBar from "../../components/Board/PostTitleBar.jsx";
import DeletePostModal from "../../components/Board/DeletePostModal.jsx";
import WriterInfo from "../../components/Board/WriterInfo.jsx";
import UpdatePostModal from "../../components/Board/UpdatePostModal.jsx";
import WriteCommentBar from "../../components/Board/WriteCommentBar.jsx";
import CommentCard from "../../components/Board/CommentCard.jsx";
import { produce } from "immer";
import LikeBtn from "../../components/Board/LikeBtn.jsx";
import BookMarkBtn from "../../components/Board/BookMarkBtn.jsx";
import { Context } from "../../context/Context.jsx";
import UsedMarketBar from "../../components/Board/UsedMarketBar.jsx";

const PostDetails = () => {
    const { boardType } = useContext(Context);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [comment, setComment] = useState("");
    const [liked, setLiked] = useState(false);
    const [bookMarked, setBookMarked] = useState(false);

    const [postData, setPostData] = useState({
        id: null,
        boardTypeId: null,
        title: "",
        content: "",
        price: 0,
        sell: true,
        address: "",
        user: {
            id: null,
            nickname: "",
            sns_account_id: "",
            sns_type_id: null,
            photo: { id: null, url: "" },
            address: "",
            dong_name: "",
            latitude: null,
            longitude: null,
            distance: "",
        },
        createdAt: "",
        likeCount: 0,
        photos: [],
        comments: [],
    });

    useEffect(() => {
        setPostData(PostData);
    }, []);

    const likeBtnClick = () => {
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
        setLiked(!liked);
    };

    const bookMarkBtnClick = () => {
        setBookMarked(!bookMarked);
    };

    return (
        <Box>
            <PostTitleBar
                writer={postData.user}
                setOpenDeleteModal={setOpenDeleteModal}
                setOpenUpdateModal={setOpenUpdateModal}
            />
            <Box
                sx={{
                    margin: "0 10px 80px 10px",
                }}
            >
                <ImgSlide photos={postData.photos} />

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

                {boardType.id !== 2 && (
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                my: "30px",
                            }}
                        >
                            <Box
                                sx={{
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                    borderRadius: "16px",
                                    px: "48px",
                                    py: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "56px",
                                    backgroundColor: "#fff",
                                    transition: "box-shadow 0.3s ease-in-out",
                                }}
                            >
                                {/* 좋아요 */}
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover .like-icon": {
                                            transform: "scale(1.15)",
                                        },
                                    }}
                                >
                                    <LikeBtn
                                        liked={liked}
                                        fontSize="45px"
                                        likeBtnClick={likeBtnClick}
                                        className="like-icon"
                                        sx={{ transition: "transform 0.2s ease-in-out" }}
                                    />
                                    <Typography
                                        fontSize="15px"
                                        mt="8px"
                                        color={liked ? "error.main" : "text.secondary"}
                                        fontWeight={liked ? 600 : 400}
                                    >
                                        좋아요
                                    </Typography>
                                </Box>

                                {/* 북마크 */}
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover .bookmark-icon": {
                                            transform: "scale(1.15)",
                                        },
                                    }}
                                >
                                    <BookMarkBtn
                                        bookMarked={bookMarked}
                                        fontSize="45px"
                                        bookMarkBtnClick={bookMarkBtnClick}
                                        className="bookmark-icon"
                                        sx={{ transition: "transform 0.2s ease-in-out" }}
                                    />
                                    <Typography
                                        fontSize="15px"
                                        mt="8px"
                                        color={bookMarked ? "#FFC107" : "text.secondary"}
                                        fontWeight={bookMarked ? 600 : 400}
                                    >
                                        북마크
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", p: "10px 10px 10px 10px" }}>
                            <Box sx={{ display: "flex", gap: "10px" }}>
                                <Typography sx={{ fontSize: "18px" }}>좋아요{postData.likeCount}개</Typography>
                                <Typography sx={{ fontSize: "18px" }}>
                                    댓글 {postData.comments ? postData.comments.length : 0}개
                                </Typography>
                            </Box>
                            {postData.comments?.map((commentItem) => {
                                return <CommentCard commentItem={commentItem} />;
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
                <WriteCommentBar
                    postId={postData.id}
                    comment={comment}
                    setComment={setComment}
                    liked={liked}
                    likeBtnClick={likeBtnClick}
                />
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
