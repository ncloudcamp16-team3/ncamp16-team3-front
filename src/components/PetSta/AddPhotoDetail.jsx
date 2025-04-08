import React from "react";
import { Box, TextareaAutosize } from "@mui/material";
import TitleBar from "../Global/TitleBar.jsx";
import { useTheme } from "@mui/material/styles";

const AddPhotoDetail = ({ imagePreview, onBack }) => {
    const theme = useTheme();
    return (
        <Box>
            <TitleBar name="게시물 업로드" onBack={onBack} />

            <Box width="88%" height="35vh" m="0 auto" display="flex" justifyContent="center" alignItems="center">
                {imagePreview && (
                    <Box
                        overflow="hidden"
                        minHeight="20%"
                        minWidth="20%"
                        borderRadius="25px"
                        position="relative"
                        sx={{}}
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
            >
                공유
            </Box>
        </Box>
    );
};

export default AddPhotoDetail;
