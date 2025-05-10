import React, { useState, useRef } from "react";
import { Box, Typography, Button, Avatar, CircularProgress } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import instance from "/src/services/axiosInstance.js";
import DarkModal from "/src/components/Global/DarkModal.jsx";
import GlobalSnackbar from "/src/components/Global/GlobalSnackbar.jsx";

const ProfileImageModal = ({ open, onClose, currentImage, onImageUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // 스낵바 상태
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError("이미지 크기는 5MB 이하여야 합니다.");
            setSnackbar({
                open: true,
                message: "이미지 크기는 5MB 이하여야 합니다.",
                severity: "error",
            });
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("이미지 파일만 업로드 가능합니다.");
            setSnackbar({
                open: true,
                message: "이미지 파일만 업로드 가능합니다.",
                severity: "error",
            });
            return;
        }

        setError(null);
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            const response = await instance.post("/user/profile-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.profileImageUrl) {
                // API 응답에서 이미지 URL을 받아 상위 컴포넌트로 전달
                onImageUpdate(response.data.profileImageUrl);
                setSnackbar({
                    open: true,
                    message: "프로필 이미지가 성공적으로 업데이트되었습니다.",
                    severity: "success",
                });
                handleClose();
            } else {
                // API 응답이 예상과 다를 경우 미리보기 URL 사용
                onImageUpdate(previewUrl);
                setSnackbar({
                    open: true,
                    message: "프로필 이미지가 업데이트되었습니다.",
                    severity: "success",
                });
                handleClose();
            }
        } catch (err) {
            console.error("프로필 이미지 업로드 실패:", err);

            if (err.response && err.response.status === 401) {
                setError("인증이 만료되었습니다. 다시 로그인해주세요.");
                setSnackbar({
                    open: true,
                    message: "인증이 만료되었습니다. 다시 로그인해주세요.",
                    severity: "error",
                });
                return;
            }

            setError("이미지 업로드 중 오류가 발생했습니다.");
            setSnackbar({
                open: true,
                message: err.response?.data?.message || "이미지 업로드 중 오류가 발생했습니다.",
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
        onClose();
    };

    return (
        <>
            <DarkModal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        zIndex: 1500,
                    }}
                >
                    <Typography id="profile-image-modal-title" variant="h6" component="h2" fontWeight="bold" mb={3}>
                        프로필 사진 변경
                    </Typography>

                    <Box
                        sx={{
                            width: 150,
                            height: 150,
                            position: "relative",
                            mb: 3,
                        }}
                    >
                        <Avatar
                            src={previewUrl || currentImage}
                            sx={{
                                width: "100%",
                                height: "100%",
                                border: "1px solid #eee",
                                objectFit: "cover",
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleButtonClick}
                            sx={{
                                position: "absolute",
                                right: -10,
                                bottom: -10,
                                minWidth: 0,
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#E9A260",
                                "&:hover": {
                                    backgroundColor: "#d0905a",
                                },
                            }}
                        >
                            <AddAPhotoIcon />
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                    </Box>

                    {error && (
                        <Typography color="error" variant="body2" mb={2}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                flex: 1,
                                borderColor: "#E9A260",
                                color: "#E9A260",
                                "&:hover": {
                                    borderColor: "#d0905a",
                                    backgroundColor: "rgba(233, 162, 96, 0.04)",
                                },
                            }}
                        >
                            취소
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            disabled={!selectedFile || isLoading}
                            sx={{
                                flex: 1,
                                backgroundColor: "#E9A260",
                                "&:hover": {
                                    backgroundColor: "#d0905a",
                                },
                                "&.Mui-disabled": {
                                    backgroundColor: "#f0f0f0",
                                },
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : "저장"}
                        </Button>
                    </Box>
                </Box>
            </DarkModal>

            {/* 스낵바 */}
            <GlobalSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                handleSnackbarClose={handleSnackbarClose}
            />
        </>
    );
};

export default ProfileImageModal;
