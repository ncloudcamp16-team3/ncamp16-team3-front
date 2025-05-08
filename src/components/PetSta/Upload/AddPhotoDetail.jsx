import React, { useContext } from "react";
import { Box, TextareaAutosize } from "@mui/material";
import TitleBar from "../../Global/TitleBar.jsx";
import { useTheme } from "@mui/material/styles";
import { addPhoto } from "../../../services/petstaService.js";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../context/Context.jsx";

const AddPhotoDetail = ({ imagePreview, imageFile, onBack }) => {
    const theme = useTheme();
    const [content, setContent] = React.useState(""); // 내용 저장
    const navigate = useNavigate();

    const { showModal } = useContext(Context);

    const handleShare = async () => {
        try {
            const formData = new FormData();
            formData.append("content", content);
            formData.append("image", imageFile);

            await addPhoto(formData);

            showModal("", "게시물이 업로드되었습니다!", () => navigate("/petsta"));
            navigate("/petsta");
        } catch (error) {
            console.error(error);
            alert("업로드 실패!");
        }
    };

    return (
        <Box>
            <TitleBar name="게시물 업로드" onBack={onBack} />

            <Box width="88%" height="35vh" m="0 auto" display="flex" justifyContent="center" alignItems="center">
                {imagePreview && (
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
                            src={imagePreview}
                            alt="업로드된 이미지"
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
                    placeholder="내용을 적어주세요"
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
                onClick={handleShare}
                sx={{ cursor: "pointer" }}
            >
                공유
            </Box>
        </Box>
    );
};

export default AddPhotoDetail;
