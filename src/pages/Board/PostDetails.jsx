import React, { useEffect, useState } from "react";
import { Box, InputBase, Typography } from "@mui/material";
import ImgSlide from "../../components/Board/ImgSlider.jsx";
import PostData from "../../mock/Board/postData.json";
import PostTitleBar from "../../components/Board/PostTitleBar.jsx";
import PostDeleteModal from "../../components/Board/PostDeleteModal.jsx";
import WriterInfo from "../../components/Board/WriterInfo.jsx";
import PostUpdateModal from "../../components/Board/PostUpdateModal.jsx";
import WriteComment from "../../components/Board/WriteComment.jsx";
import Comment from "../../components/Board/Comment.jsx";
import UpdateBtn from "../../components/Board/UpdateBtn.jsx";
import { produce } from "immer";
import UpdateFile from "../../components/Board/UpdateFile.jsx";

const PostDetails = () => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [updateAble, setUpdateAble] = useState(false);
    const [comment, setComment] = useState("");
    const [liked, setLiked] = useState(false);

    const [postData, setPostData] = useState({
        id: null,
        boardTypeId: null,
        title: "",
        content: "",
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

    const handleDeletePhoto = (photoId) => {
        setPostData(
            produce((draft) => {
                draft.photos = postData.photos.filter((p) => p.id !== photoId);
            })
        );
    };

    const handleAddPhoto = (e) => {
        const files = e.target.files;
        let fileCount = postData.photos.length;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (fileCount < 5) {
                const newPhoto = {
                    id: Date.now(),
                    url: URL.createObjectURL(file),
                };

                setPostData((prev) =>
                    produce(prev, (draft) => {
                        draft.photos.push(newPhoto);
                    })
                );
                fileCount++;
            } else {
                alert("최대 5개까지 파일을 추가할 수 있습니다.");
                break;
            }
        }
    };

    return (
        <Box>
            <PostTitleBar
                writer={postData.user}
                setOpenDeleteModal={setOpenDeleteModal}
                setOpenUpdateModal={setOpenUpdateModal}
                updateAble={updateAble}
            />
            <Box
                sx={{
                    margin: "0 10px 80px 10px",
                }}
            >
                {!updateAble ? (
                    <ImgSlide photos={postData.photos} />
                ) : (
                    <UpdateFile
                        postPhotos={postData.photos}
                        handleAddPhoto={handleAddPhoto}
                        handleDeletePhoto={handleDeletePhoto}
                    />
                )}
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
                    readOnly={!updateAble}
                    onChange={(e) =>
                        setPostData(
                            produce((draft) => {
                                draft.title = e.target.value;
                            })
                        )
                    }
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
                    readOnly={!updateAble}
                    multiline
                    fullWidth
                    minRows={3}
                    maxRows={Infinity}
                    onChange={(e) =>
                        setPostData(
                            produce((draft) => {
                                draft.content = e.target.value;
                            })
                        )
                    }
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
                {!updateAble && (
                    <Box sx={{ display: "flex", flexDirection: "column", p: "10px 10px 10px 10px" }}>
                        <Box sx={{ display: "flex", gap: "15px" }}>
                            <Typography sx={{ fontSize: "18px" }}>좋아요 {postData.likeCount}개</Typography>
                            <Typography sx={{ fontSize: "18px" }}>
                                댓글 {postData.comments ? postData.comments.length : 0}개
                            </Typography>
                        </Box>
                        {postData.comments?.map((commentItem) => {
                            return <Comment commentItem={commentItem} />;
                        })}
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

            {!updateAble ? (
                <WriteComment
                    liked={liked}
                    setLiked={setLiked}
                    comment={comment}
                    setComment={setComment}
                    setPostData={setPostData}
                    postId={postData.id}
                />
            ) : (
                <UpdateBtn
                    postTitle={postData.title}
                    postContent={postData.content}
                    postId={postData.id}
                    postPhotos={postData.photos}
                />
            )}

            <PostDeleteModal
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                postId={postData.id}
            />
            <PostUpdateModal
                openUpdateModal={openUpdateModal}
                setOpenUpdateModal={setOpenUpdateModal}
                setUpdateAble={setUpdateAble}
            />
        </Box>
    );
};

export default PostDetails;
