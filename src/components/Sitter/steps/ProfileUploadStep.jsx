import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import penIcon from "/src/assets/images/User/pen_2.svg";

const ProfileUploadStep = ({ imagePreview, onImageUpload }) => {
    const fileInputRef = useRef(null);

    const handleSelectImage = () => {
        fileInputRef.current.click();
    };

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                pt: 20,
                pb: 15,
            }}
        >
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onImageUpload}
            />

            <Box
                sx={{
                    width: 170,
                    height: 170,
                    borderRadius: "50%",
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #E9A260",
                    position: "relative",
                    mb: 1,
                }}
            >
                {imagePreview ? (
                    <Box
                        component="img"
                        src={imagePreview}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                        }}
                    />
                ) : null}

                {/* 편집 아이콘 */}
                <Box
                    onClick={handleSelectImage}
                    sx={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        width: 35,
                        height: 35,
                        borderRadius: "50%",
                        bgcolor: "#2196F3",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                >
                    <img src={penIcon} alt="Edit" width="16" height="16" />
                </Box>
            </Box>

            <Typography
                variant="body1"
                fontWeight="bold"
                textAlign="center"
                sx={{
                    mb: 0,
                }}
            >
                펫시터님의 사진을 업로드해주세요!
            </Typography>
        </Box>
    );
};

export default ProfileUploadStep;
