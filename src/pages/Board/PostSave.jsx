import React, { useContext, useEffect, useState } from "react";
import UpdateFile from "../../components/Board/UpdateFile.jsx";
import { produce } from "immer";
import UpdatePostBtn from "../../components/Board/UpdatePostBtn.jsx";
import { Box, Button, InputAdornment, InputBase, Typography } from "@mui/material";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { Context } from "../../context/Context.jsx";
import PostData from "../../mock/Board/postData.json";
import { useNavigate, useParams } from "react-router-dom";
import AddPostBtn from "../../components/Board/AddPostBtn.jsx";

const PostSave = () => {
    const { boardType, user, showModal } = useContext(Context);
    const { postId } = useParams();
    const isEdit = !!postId;
    const navigate = useNavigate();
    const [freeTrade, setFreeTrade] = useState(false);
    const [price, setPrice] = useState(0);
    const [address, setAddress] = useState("");

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
        if (isEdit) {
            requestPostData();
        }
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
                    URL.revokeObjectURL(target.url);
                }
                draft.photos.splice(index, 1);
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
                    id: null,
                    file: file,
                    url: URL.createObjectURL(file),
                };

                setPostData((prev) =>
                    produce(prev, (draft) => {
                        draft.photos.push(newPhoto);
                    })
                );
                fileCount++;
            } else {
                showModal(null, "최대 5개까지 파일을 추가할 수 있습니다.");
                break;
            }
        }
    };

    const requestPostData = () => {
        alert(postId + "게시물 데이터 요청");
        setPostData(PostData);
    };

    const requestUpdatePost = () => {
        alert(postId + "번 게시물" + "\n제목=" + postData.title + "\n내용=" + postData.content + "\n으로 수정요청");
        navigate(`/board/${postData.id}`);
    };

    const requestAddPost = () => {
        alert("제목=" + postData.title + "내용=" + postData.content + "으로 게시글 추가 요청");
        navigate(`/board/${postData.id}`);
    };

    return (
        <div>
            <Box
                sx={{
                    margin: "0 10px 80px 10px",
                }}
            >
                <TitleBar name={boardType.name} />

                <UpdateFile
                    postPhotos={postData.photos}
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
                                onClick={() => setFreeTrade(false)}
                                variant="contained"
                                sx={{
                                    backgroundColor: !freeTrade ? "#F3BE96" : "#D9D9D9",
                                    color: "black",
                                    boxShadow: "none",
                                    borderRadius: "20px",
                                }}
                            >
                                판매하기
                            </Button>
                            <Button
                                onClick={() => {
                                    setFreeTrade(true);
                                    setPrice(0);
                                }}
                                variant="contained"
                                sx={{
                                    backgroundColor: freeTrade ? "#F3BE96" : "#D9D9D9",
                                    color: "black",
                                    boxShadow: "none",
                                    borderRadius: "20px",
                                }}
                            >
                                나눔하기
                            </Button>
                        </Box>
                        <InputBase
                            readOnly={freeTrade}
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={"가격을 입력해주세요."}
                            startAdornment={<InputAdornment position="start">₩</InputAdornment>}
                            sx={{
                                width: "100%",
                                px: "10px",
                                border: "1px solid rgba(0, 0, 0, 0.3)",
                                borderRadius: "10px",
                                my: "10px",
                                backgroundColor: freeTrade ? "#E9E9E9" : "white",
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
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
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
                {isEdit ? (
                    <UpdatePostBtn requestUpdatePost={requestUpdatePost} />
                ) : (
                    <AddPostBtn requestAddPost={requestAddPost} />
                )}
            </Box>
        </div>
    );
};

export default PostSave;
