import React, { useContext, useEffect, useState } from "react";
import { Box, TextareaAutosize } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../../services/petstaService.js";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { Context } from "../../context/Context.jsx";

const EditVideoDetail = () => {
    const { postId } = useParams();
    const [content, setContent] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const theme = useTheme();
    const navigate = useNavigate();
    const { showModal } = useContext(Context);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await getPostById(postId);
                setContent(post.content);
                setVideoUrl(post.fileName); // presigned URL
            } catch (e) {
                alert("게시글 정보를 불러오지 못했습니다.");
                navigate(-1);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSave = async () => {
        try {
            await updatePost(postId, { content }); // PATCH API
            showModal("", "수정 완료!");
            navigate(`/petsta/post/${postId}`);
        } catch (e) {
            showModal("", "수정이 실패했습니다.");
        }
    };

    return (
        <Box>
            <TitleBar name="게시글 수정" onBack={() => navigate(-1)} />

            {/* 영상은 미리보기 용으로 readonly */}
            {videoUrl && (
                <Box
                    width="100%"
                    minHeight="35vh"
                    maxHeight="35vh"
                    display="flex"
                    justifyContent="center"
                    m="0 auto"
                    bgcolor="black"
                >
                    <video
                        src={videoUrl}
                        muted
                        loop
                        autoPlay
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: "25px",
                        }}
                    />
                </Box>
            )}

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
                onClick={handleSave}
                sx={{ cursor: "pointer" }}
            >
                수정 완료
            </Box>
        </Box>
    );
};

export default EditVideoDetail;
