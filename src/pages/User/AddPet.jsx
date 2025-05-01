import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton, Stack, Divider, Chip, Alert, Snackbar } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { useNavigate } from "react-router-dom";
import petEx from "/src/assets/images/User/pet_ex.svg";
import instance from "../../services/axiosInstance.js";

const AddPet = () => {
    const navigate = useNavigate();

    const [petData, setPetData] = useState({
        name: "",
        type: "",
        birthDate: "",
        gender: "",
        isNeutered: false,
        weight: "",
        introduction: "",
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([null, null, null, null, null, null]);
    const [imagePreviews, setImagePreviews] = useState([null, null, null, null, null, null]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData({
            ...petData,
            [name]: value,
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({
                open: true,
                message: "이미지 크기는 5MB 이하여야 합니다.",
                severity: "error",
            });
            return;
        }

        // 파일 타입 검증
        if (!file.type.startsWith("image/")) {
            setSnackbar({
                open: true,
                message: "이미지 파일만 업로드 가능합니다.",
                severity: "error",
            });
            return;
        }

        const newImages = [...images];
        newImages[currentImageIndex] = file;
        setImages(newImages);

        const reader = new FileReader();
        reader.onloadend = () => {
            const newPreviews = [...imagePreviews];
            newPreviews[currentImageIndex] = reader.result;
            setImagePreviews(newPreviews);
        };
        reader.readAsDataURL(file);

        // 첫 이미지라면 자동으로 메인 이미지로 설정
        if (!imagePreviews.some((preview) => preview !== null)) {
            setMainPhotoIndex(currentImageIndex);
        }
    };

    const handleRemoveImage = () => {
        // 현재 선택된 이미지 삭제
        if (imagePreviews[currentImageIndex]) {
            const newImages = [...images];
            const newPreviews = [...imagePreviews];

            newImages[currentImageIndex] = null;
            newPreviews[currentImageIndex] = null;

            setImages(newImages);
            setImagePreviews(newPreviews);

            // 메인 이미지가 삭제된 경우 새 메인 이미지 설정
            if (mainPhotoIndex === currentImageIndex) {
                // 다음으로 유효한 이미지 찾기
                const nextValidIndex = newPreviews.findIndex((preview) => preview !== null);
                if (nextValidIndex !== -1) {
                    setMainPhotoIndex(nextValidIndex);
                }
            }

            // 다음 이미지로 이동
            const nextIndex = findNextValidImageIndex(newPreviews, currentImageIndex);
            setCurrentImageIndex(nextIndex);

            setSnackbar({
                open: true,
                message: "이미지가 삭제되었습니다.",
                severity: "info",
            });
        }
    };

    // 다음으로 유효한 이미지 인덱스 찾기 (원형 탐색)
    const findNextValidImageIndex = (previews, currentIndex) => {
        // 먼저 현재 인덱스 이후부터 탐색
        for (let i = 0; i < previews.length; i++) {
            const index = (currentIndex + i) % previews.length;
            if (previews[index] !== null) {
                return index;
            }
        }
        return 0; // 모든 이미지가 null이면 첫 번째 슬롯으로
    };

    const handleImageNavigation = (index) => {
        setCurrentImageIndex(index);
    };

    const handleSetMainPhoto = () => {
        if (imagePreviews[currentImageIndex]) {
            setMainPhotoIndex(currentImageIndex);
            setSnackbar({
                open: true,
                message: "대표 사진으로 설정되었습니다",
                severity: "success",
            });
        } else {
            setSnackbar({
                open: true,
                message: "이 슬롯에는 이미지가 없습니다",
                severity: "warning",
            });
        }
    };

    const handlePrevImage = () => {
        // 이전 이미지로 이동 (순환)
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imagePreviews.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        // 다음 이미지로 이동 (순환)
        setCurrentImageIndex((prevIndex) => (prevIndex === imagePreviews.length - 1 ? 0 : prevIndex + 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 필수 입력값 검증
        if (
            !petData.name ||
            !petData.birthDate ||
            !petData.type ||
            !petData.gender ||
            petData.weight === "" ||
            !petData.introduction
        ) {
            setSnackbar({
                open: true,
                message: "모든 필수 항목을 입력해주세요.",
                severity: "error",
            });
            setIsSubmitting(false);
            return;
        }

        // 적어도 하나의 이미지가 필요
        const hasImages = images.some((img) => img !== null);
        if (!hasImages) {
            setSnackbar({
                open: true,
                message: "최소 한 장의 사진이 필요합니다.",
                severity: "error",
            });
            setIsSubmitting(false);
            return;
        }

        // FormData 객체 생성
        const formData = new FormData();

        // 반려동물 데이터 JSON 변환 및 추가 - 메인 사진 인덱스 포함
        const petDataJson = JSON.stringify({
            name: petData.name,
            type: petData.type,
            birthDate: petData.birthDate,
            gender: petData.gender,
            isNeutered: petData.isNeutered,
            weight: parseFloat(petData.weight),
            introduction: petData.introduction,
            mainPhotoIndex: getAdjustedMainPhotoIndex(),
        });

        formData.append("petData", new Blob([petDataJson], { type: "application/json" }));

        // 유효한 이미지만 추출
        const validImages = [];
        const validIndices = [];

        images.forEach((image, index) => {
            if (image !== null) {
                validImages.push(image);
                validIndices.push(index);
            }
        });

        // 이미지들 FormData에 추가 - 메인 이미지가 첫 번째로 오도록
        const mainImageIndex = validIndices.indexOf(mainPhotoIndex);

        if (mainImageIndex !== -1) {
            // 먼저 메인 이미지 추가
            formData.append("images", validImages[mainImageIndex]);

            // 나머지 이미지 추가
            validImages.forEach((image, idx) => {
                if (idx !== mainImageIndex) {
                    formData.append("images", image);
                }
            });
        } else {
            // 메인 이미지가 없는 경우 모든 이미지 추가
            validImages.forEach((image) => {
                formData.append("images", image);
            });
        }

        try {
            // API 호출
            const response = await instance.post("/pet/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("반려동물 등록 응답:", response.data);

            // 성공 시 처리
            setSnackbar({
                open: true,
                message: "반려동물 등록이 완료되었습니다.",
                severity: "success",
            });

            // 잠시 후 페이지 이동
            setTimeout(() => {
                navigate("/mypage");
            }, 1500);
        } catch (error) {
            console.error("반려동물 등록 오류:", error);

            if (error.response && error.response.status === 401) {
                setSnackbar({
                    open: true,
                    message: "인증이 만료되었습니다. 다시 로그인해주세요.",
                    severity: "error",
                });
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            setSnackbar({
                open: true,
                message: error.response?.data?.message || "반려동물 등록 중 오류가 발생했습니다.",
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 유효한 이미지들 중 메인 이미지의 인덱스를 구함
    const getAdjustedMainPhotoIndex = () => {
        const validIndices = [];

        images.forEach((image, index) => {
            if (image !== null) {
                validIndices.push(index);
            }
        });

        const mainIndexPosition = validIndices.indexOf(mainPhotoIndex);
        return mainIndexPosition !== -1 ? mainIndexPosition : 0;
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const petTypes = ["강아지", "고양이", "햄스터", "앵무새", "물고기", "기타"];

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <TitleBar name="반려동물 정보추가" onBack={handleGoBack} />

            <Box
                sx={{
                    position: "relative",
                    mx: "auto",
                    my: 2,
                    width: "calc(100% - 32px)",
                    height: 240,
                    borderRadius: 4,
                    bgcolor: imagePreviews[currentImageIndex] ? "transparent" : "#FFC0CB",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {imagePreviews[currentImageIndex] ? (
                    <Box
                        component="img"
                        src={imagePreviews[currentImageIndex]}
                        alt="반려동물 사진"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 4,
                        }}
                    />
                ) : (
                    <Box
                        component="img"
                        src={petEx}
                        alt="반려동물 사진"
                        sx={{
                            width: "auto",
                            height: "80%",
                            objectFit: "contain",
                        }}
                    />
                )}

                {/* 좌측 화살표 */}
                <IconButton
                    onClick={handlePrevImage}
                    sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "white",
                        bgcolor: "rgba(0,0,0,0.3)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                        zIndex: 2,
                    }}
                >
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>

                {/* 우측 화살표 */}
                <IconButton
                    onClick={handleNextImage}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "white",
                        bgcolor: "rgba(0,0,0,0.3)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                        zIndex: 2,
                    }}
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>

                {/* 파일 추가 버튼 */}
                <IconButton
                    component="label"
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        bgcolor: "#363636",
                        color: "white",
                        "&:hover": { bgcolor: "#000000" },
                        zIndex: 2,
                    }}
                >
                    <AddIcon />
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </IconButton>

                {/* 현재 이미지가 있을 때만 삭제 버튼 표시 */}
                {imagePreviews[currentImageIndex] && (
                    <IconButton
                        onClick={handleRemoveImage}
                        sx={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                            bgcolor: "rgba(220,53,69,0.7)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(220,53,69,0.9)" },
                            zIndex: 2,
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}

                {/* 대표 이미지 설정 버튼 */}
                <IconButton
                    onClick={handleSetMainPhoto}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        color: currentImageIndex === mainPhotoIndex ? "#FFD700" : "white",
                        bgcolor: "rgba(0,0,0,0.3)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                        zIndex: 2,
                    }}
                >
                    <StarIcon />
                </IconButton>

                {/* 이미지 슬라이더 인디케이터 */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        alignItems: "center",
                        zIndex: 2,
                    }}
                >
                    {imagePreviews.map((preview, index) => (
                        <Box
                            key={index}
                            onClick={() => handleImageNavigation(index)}
                            sx={{
                                width: index === currentImageIndex ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                bgcolor:
                                    index === currentImageIndex
                                        ? "white"
                                        : index === mainPhotoIndex && preview
                                          ? "rgba(255, 215, 0, 0.8)"
                                          : preview
                                            ? "rgba(255, 255, 255, 0.5)"
                                            : "rgba(255, 255, 255, 0.2)",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ px: 2 }}>
                <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
                    기본정보
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    이름 <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    name="name"
                    value={petData.name}
                    onChange={handleChange}
                    placeholder="반려동물 이름을 입력하세요"
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                    생일 <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    name="birthDate"
                    value={petData.birthDate}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 3, borderColor: "#f0f0f0", borderWidth: 2 }} />

                <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
                    상세정보
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    반려동물을 등록해주세요 <span style={{ color: "red" }}>*</span>
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", mb: 3, gap: 1 }}>
                    {petTypes.map((type) => (
                        <Chip
                            key={type}
                            label={type}
                            onClick={() => setPetData({ ...petData, type })}
                            color={petData.type === type ? "primary" : "default"}
                            variant={petData.type === type ? "filled" : "outlined"}
                            sx={{
                                borderColor: "#d3d3d3",
                                bgcolor: petData.type === type ? "#E9A260" : "transparent",
                                color: petData.type === type ? "white" : "black",
                                "&:hover": {
                                    bgcolor: petData.type === type ? "#d0905a" : "rgba(0,0,0,0.04)",
                                },
                                minWidth: "70px",
                                flexShrink: 0,
                            }}
                        />
                    ))}
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    아이의 성별을 선택해주세요 <span style={{ color: "red" }}>*</span>
                </Typography>
                <Box sx={{ display: "flex", width: "100%", mb: 2, gap: 1 }}>
                    <Button
                        variant={petData.gender === "남아" ? "contained" : "outlined"}
                        onClick={() => setPetData({ ...petData, gender: "남아" })}
                        sx={{
                            flex: 1,
                            borderColor: "#d3d3d3",
                            color: petData.gender === "남아" ? "white" : "black",
                            bgcolor: petData.gender === "남아" ? "#E9A260" : "transparent",
                            "&:hover": {
                                bgcolor: petData.gender === "남아" ? "#d0905a" : "rgba(0,0,0,0.04)",
                                borderColor: "#ccc",
                            },
                            textTransform: "none",
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        남아
                    </Button>
                    <Button
                        variant={petData.gender === "여아" ? "contained" : "outlined"}
                        onClick={() => setPetData({ ...petData, gender: "여아" })}
                        sx={{
                            flex: 1,
                            borderColor: "#d3d3d3",
                            color: petData.gender === "여아" ? "white" : "black",
                            bgcolor: petData.gender === "여아" ? "#E9A260" : "transparent",
                            "&:hover": {
                                bgcolor: petData.gender === "여아" ? "#d0905a" : "rgba(0,0,0,0.04)",
                                borderColor: "#ccc",
                            },
                            textTransform: "none",
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        여아
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    중성화 여부 <span style={{ color: "red" }}>*</span>
                </Typography>
                <Box sx={{ display: "flex", width: "100%", mb: 2, gap: 1 }}>
                    <Button
                        variant={petData.isNeutered ? "contained" : "outlined"}
                        onClick={() => setPetData({ ...petData, isNeutered: true })}
                        sx={{
                            flex: 1,
                            borderColor: "#d3d3d3",
                            color: petData.isNeutered ? "white" : "black",
                            bgcolor: petData.isNeutered ? "#E9A260" : "transparent",
                            "&:hover": {
                                bgcolor: petData.isNeutered ? "#d0905a" : "rgba(0,0,0,0.04)",
                                borderColor: "#ccc",
                            },
                            textTransform: "none",
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        O
                    </Button>
                    <Button
                        variant={!petData.isNeutered ? "contained" : "outlined"}
                        onClick={() => setPetData({ ...petData, isNeutered: false })}
                        sx={{
                            flex: 1,
                            borderColor: "#d3d3d3",
                            color: !petData.isNeutered ? "white" : "black",
                            bgcolor: !petData.isNeutered ? "#E9A260" : "transparent",
                            "&:hover": {
                                bgcolor: !petData.isNeutered ? "#d0905a" : "rgba(0,0,0,0.04)",
                                borderColor: "#ccc",
                            },
                            textTransform: "none",
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        X
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                    몸무게 <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    name="weight"
                    type="number"
                    value={petData.weight}
                    onChange={handleChange}
                    placeholder="몸무게(kg)"
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" sx={{ mb: 1 }}>
                    소개 <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="introduction"
                    value={petData.introduction}
                    onChange={handleChange}
                    placeholder="10~50 글자 사이로 아이를 소개해주세요"
                    sx={{ mb: 3 }}
                />

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                        py: 1.5,
                        bgcolor: "#E9A260",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": { bgcolor: "#d0905a" },
                        mb: 2,
                        borderRadius: "8px",
                    }}
                >
                    {isSubmitting ? "저장 중..." : "저장"}
                </Button>
            </Box>

            {/* 스낵바 알림 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddPet;
