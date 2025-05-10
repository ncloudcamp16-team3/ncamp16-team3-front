import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import penIcon from "/src/assets/images/User/pen_2.svg";

const ProfileUploadStep = ({ imagePreview, onImageUpload }) => {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    // 이미지 로딩 상태 관리
    useEffect(() => {
        // 이미지 URL이 있고 http(s)로 시작하는 경우 (원격 이미지)
        if (imagePreview && (imagePreview.startsWith("http://") || imagePreview.startsWith("https://"))) {
            setIsLoading(true);
            setImageError(false);

            // 이미지 존재 여부 및 로딩 상태 확인
            const img = new Image();
            img.onload = () => {
                setIsLoading(false);
            };
            img.onerror = () => {
                console.error("이미지 로딩 실패:", imagePreview);
                setIsLoading(false);
                setImageError(true);
            };
            img.src = imagePreview;
        }
    }, [imagePreview]);

    const handleSelectImage = () => {
        if (!isLoading) {
            fileInputRef.current.click();
        }
    };

    // 이미지 URL에서 파일 이름 추출
    const getImageFileName = (url) => {
        if (!url) return "프로필 이미지";
        try {
            // URL에서 파일 이름 추출 시도
            const pathname = new URL(url).pathname;
            const filename = pathname.split("/").pop().split("?")[0];
            return filename || "프로필 이미지";
        } catch (e) {
            return "프로필 이미지";
        }
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
                    overflow: "hidden", // 이미지가 원 안에 잘 맞도록
                }}
            >
                {isLoading ? (
                    // 이미지 로딩 중일 때 표시할 로딩 인디케이터
                    <CircularProgress size={40} sx={{ color: "#E9A260" }} />
                ) : imageError ? (
                    // 이미지 로딩 실패 시 표시할 메시지
                    <Typography variant="body2" align="center" color="error">
                        이미지 로딩 실패
                        <br />
                        다시 선택해주세요
                    </Typography>
                ) : imagePreview ? (
                    // 이미지 미리보기
                    <Box
                        component="img"
                        src={imagePreview}
                        alt={getImageFileName(imagePreview)}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                        }}
                    />
                ) : (
                    // 이미지가 없을 때의 기본 텍스트
                    <Typography variant="body2" align="center" color="text.secondary">
                        이미지를
                        <br />
                        선택해주세요
                    </Typography>
                )}

                {/* 편집 아이콘 - 로딩 중에는 비활성화 */}
                <Box
                    onClick={handleSelectImage}
                    sx={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        width: 35,
                        height: 35,
                        borderRadius: "50%",
                        bgcolor: isLoading ? "#a0a0a0" : "#2196F3",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: isLoading ? "default" : "pointer",
                        transition: "background-color 0.3s",
                        "&:hover": {
                            bgcolor: isLoading ? "#a0a0a0" : "#1976d2",
                        },
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

            {/* 현재 이미지 파일명 표시 - 원격 이미지인 경우에만 */}
            {imagePreview &&
                (imagePreview.startsWith("http://") || imagePreview.startsWith("https://")) &&
                !isLoading &&
                !imageError && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            maxWidth: "80%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                        }}
                    >
                        현재 이미지: {getImageFileName(imagePreview)}
                    </Typography>
                )}
        </Box>
    );
};

export default ProfileUploadStep;
