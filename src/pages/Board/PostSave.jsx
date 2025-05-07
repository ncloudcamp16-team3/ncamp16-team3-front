import React, { useContext, useEffect, useRef, useState } from "react";
import UploadFiles from "../../components/Board/UploadFiles.jsx";
import { produce } from "immer";
import UpdatePostBtn from "../../components/Board/UpdatePostBtn.jsx";
import { Box, Button, InputAdornment, InputBase, Typography } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { Context } from "../../context/Context.jsx";
import { useNavigate, useParams } from "react-router-dom";
import AddPostBtn from "../../components/Board/AddPostBtn.jsx";
import Loading from "../../components/Global/Loading.jsx";
import { getBoardDetail, saveBoard } from "../../services/boardService.js";

const PostSave = () => {
    const { boardType, user, showModal, handleSnackbarOpen } = useContext(Context);
    const { postId } = useParams();
    const isEdit = !!postId;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const deleteFileIds = useRef([]);

    const formatNumber = (num) => {
        return num.toLocaleString(); // 3자리마다 콤마 추가
    };

    const handleChange = (e) => {
        const input = e.target.value.replace(/,/g, "");
        const value = Number(input);

        if (input === "") {
            setPostData((prev) =>
                produce(prev, (draft) => {
                    draft.price = 0;
                })
            );
            return;
        }

        if (value >= 0) {
            if (value <= 1000000000) {
                setPostData((prev) =>
                    produce(prev, (draft) => {
                        draft.price = value;
                    })
                );
            } else {
                setPostData((prev) =>
                    produce(prev, (draft) => {
                        draft.price = 1000000000;
                    })
                );
            }
        }
    };

    const [postData, setPostData] = useState({
        id: null,
        boardTypeId: null,
        title: "",
        content: "",
        authorNickname: "",
        authorId: "",
        createdAt: "",
        likeCount: 0,
        commentCount: 0,
        firstImageUrl: "",
        imageUrls: [],
        photos: [],
        price: 0,
        sell: false,
        address: "",
        comments: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            if (isEdit) {
                setLoading(true);
                try {
                    const res = await getBoardDetail(postId);
                    const data = res.data;

                    setPostData(data);
                } catch (err) {
                } finally {
                    setLoading(false); // 성공이든 실패든 무조건 false
                }
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!postData?.user?.id) return;

        if (postData.user.id !== user.id && isEdit) {
            showModal(null, "게시물 작성자가 아닙니다.", () => navigate(-1));
        }
    }, [postData]);

    const handleDeletePhoto = (index) => {
        setPostData(
            produce((draft) => {
                const target = draft.photos[index];
                if (!target.id) {
                    URL.revokeObjectURL(target.path);
                } else {
                    deleteFileIds.current.push(target.id);
                }
                draft.photos.splice(index, 1);
            })
        );
    };

    const handleAddPhoto = (e) => {
        const files = e.target.files;
        const selectedFiles = Array.from(files);

        let fileCount = postData?.photos.length;
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = files[i];
            const fileData = selectedFiles[i];

            if (fileCount < 5) {
                const newPhoto = {
                    id: null,
                    file: fileData,
                    path: URL.createObjectURL(file),
                };

                setPostData((prev) =>
                    produce(prev, (draft) => {
                        draft.photos.push(newPhoto);
                    })
                );
                fileCount++;
            } else {
                handleSnackbarOpen("파일은 최대 5개까지 입력 가능합니다", "warning");
                break;
            }
        }
    };

    const requestSavePost = () => {
        const boardData = {
            id: postData.id,
            boardTypeId: boardType.id,
            title: postData.title,
            content: postData.content,
            authorId: postData.authorId,
            price: postData.price,
            sell: postData.sell,
            address: postData.address,
            deleteFileIds: deleteFileIds.current,
        };

        const formData = new FormData();
        formData.append("postData", new Blob([JSON.stringify(boardData)], { type: "application/json" }));

        postData.photos
            .filter((p) => p.id === null)
            .forEach((p) => {
                formData.append("photos", p.file);
            });

        saveBoard(formData)
            .then((res) => {
                const data = res.data;
                navigate(`/board/${data}`);
            })
            .catch((err) => {
                handleSnackbarOpen(err.message, "warning");
            });
    };

    return (
        <div>
            <Box
                sx={{
                    margin: "0 10px 80px 10px",
                }}
            >
                <TitleBar name={boardType.name} />
                {loading ? (
                    <Loading />
                ) : (
                    <Box>
                        <UploadFiles
                            photos={postData.photos}
                            handleAddPhoto={handleAddPhoto}
                            handleDeletePhoto={handleDeletePhoto}
                        />

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
                            onChange={(e) =>
                                setPostData(
                                    produce((draft) => {
                                        draft.title = e.target.value;
                                    })
                                )
                            }
                            placeholder={"글 제목"}
                            sx={{
                                width: "100%",
                                px: "10px",
                                border: "1px solid rgba(0, 0, 0, 0.3)",
                                borderRadius: "10px",
                                mb: "10px",
                            }}
                        />
                        {boardType.id === 2 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "22px",
                                        mb: "5px",
                                    }}
                                >
                                    거래방식
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: "5px",
                                    }}
                                >
                                    <Button
                                        onClick={() => {
                                            setPostData((prev) =>
                                                produce(prev, (draft) => {
                                                    draft.sell = true;
                                                })
                                            );
                                        }}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: postData.sell ? "#F3BE96" : "#D9D9D9",
                                            color: "black",
                                            boxShadow: "none",
                                            borderRadius: "20px",
                                        }}
                                    >
                                        판매하기
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setPostData((prev) =>
                                                produce(prev, (draft) => {
                                                    draft.price = 0;
                                                    draft.sell = false;
                                                })
                                            );
                                        }}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: postData.sell ? "#D9D9D9" : "#F3BE96",
                                            color: "black",
                                            boxShadow: "none",
                                            borderRadius: "20px",
                                        }}
                                    >
                                        나눔하기
                                    </Button>
                                </Box>
                                <InputBase
                                    readOnly={!postData.sell}
                                    type="text" // "number" 대신 "text"로 변경하여 콤마 처리 가능
                                    value={postData.price === 0 ? "" : formatNumber(postData.price)} // 천 단위로 콤마 추가
                                    onChange={handleChange}
                                    placeholder={postData?.sell ? "가격을 입력해주세요." : "0"}
                                    startAdornment={<InputAdornment position="start">₩</InputAdornment>}
                                    sx={{
                                        width: "100%",
                                        px: "10px",
                                        border: "1px solid rgba(0, 0, 0, 0.3)",
                                        borderRadius: "10px",
                                        my: "10px",
                                        backgroundColor: !postData.sell ? "#E9E9E9" : "white",
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: "#9e9e9e",
                                            cursor: "not-allowed",
                                        },
                                    }}
                                />
                            </Box>
                        )}

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
                            multiline
                            fullWidth
                            minRows={3}
                            maxRows={Infinity}
                            placeholder={"자세한 설명을 적어주세요."}
                            onChange={(e) =>
                                setPostData((prev) =>
                                    produce(prev, (draft) => {
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
                                    onChange={(e) =>
                                        setPostData((prev) =>
                                            produce(prev, (draft) => {
                                                draft.address = e.target.value;
                                            })
                                        )
                                    }
                                    placeholder={"거래 장소를 적어주세요."}
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
                    </Box>
                )}
                {isEdit ? (
                    <UpdatePostBtn requestUpdatePost={requestSavePost} />
                ) : (
                    <AddPostBtn requestAddPost={requestSavePost} />
                )}
            </Box>
        </div>
    );
};

export default PostSave;
