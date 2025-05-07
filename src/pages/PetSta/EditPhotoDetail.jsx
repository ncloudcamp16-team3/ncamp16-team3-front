import React, { useEffect, useState } from "react";
import { Box, TextareaAutosize } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../../services/petstaService.js";
import TitleBar from "../../components/Global/TitleBar.jsx";

const EditPhotoDetail = () => {
    const { postId } = useParams();
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await getPostById(postId);
                setContent(post.content);
                setImageUrl(post.fileName); // presigned URL
            } catch (error) {
                alert("게시글을 불러오지 못했습니다.");
                navigate(-1);
            }
        };

        fetchPost();
    }, [postId]);

    const handleUpdate = async () => {
        try {
            await updatePost(postId, { content });
            alert("수정 완료!");
            navigate(`/petsta/post/${postId}`);
        } catch (error) {
            alert("수정 실패!");
        }
    };

    return (
        <Box>
            <TitleBar name="게시물 수정" onBack={() => navigate(-1)} />

            <Box width="88%" height="35vh" m="0 auto" display="flex" justifyContent="center" alignItems="center">
                {imageUrl && (
                    <Box
                        overflow="hidden"
                        height="100%"
                        minWidth="20%"
                        borderRadius="25px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <img
                            src={imageUrl}
                            alt="기존 이미지"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                )}
            </Box>

            <Box display="flex" flexDirection="column" width="88%" m="20px auto">
                <Box fontWeight="bold" mb="8px">
                    내용
                </Box>

                <TextareaAutosize
                    minRows={8}
                    placeholder="내용을 입력해주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        resize: "none",
                        fontFamily: "inherit",
                    }}
                />
            </Box>

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="88%"
                m="0 auto"
                bgcolor={theme.brand3}
                borderRadius="12px"
                height="48px"
                color="white"
                fontSize="18px"
                fontWeight="bold"
                onClick={handleUpdate}
                sx={{ cursor: "pointer" }}
            >
                수정 완료
            </Box>
        </Box>
    );
};

export default EditPhotoDetail;
