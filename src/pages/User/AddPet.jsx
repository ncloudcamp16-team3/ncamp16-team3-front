import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Divider,
    Chip,
    Alert,
    Snackbar,
    Grid,
    Card,
    CardMedia,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import TitleBar from "../../components/Global/TitleBar.jsx";
import { useNavigate } from "react-router-dom";
import petEx from "/src/assets/images/User/profile.png";
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

    // 이미지 상태를 동적 배열로 관리
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0); // 대표 이미지 인덱스
    const [selectedImageIndex, setSelectedImageIndex] = useState(-1); // 선택된 이미지 인덱스
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
    const today = new Date().toISOString().split("T")[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData({
            ...petData,
            [name]: value,
        });
    };

    // 몸무게 입력 처리 함수 추가
    const handleWeightChange = (e) => {
        const value = e.target.value;

        // 숫자와 소수점만 허용
        const regex = /^[0-9]*\.?[0-9]*$/;

        if (value === "" || regex.test(value)) {
            setPetData({
                ...petData,
                weight: value,
            });
        }
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

        // 최대 6개 제한
        if (images.length >= 6) {
            setSnackbar({
                open: true,
                message: "최대 6개의 이미지만 등록할 수 있습니다.",
                severity: "warning",
            });
            return;
        }

        // 새 이미지 추가
        const newImages = [...images, file];
        setImages(newImages);

        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPreviews = [...imagePreviews, reader.result];
            setImagePreviews(newPreviews);

            // 새로 추가된 이미지 선택
            setSelectedImageIndex(newPreviews.length - 1);

            // 첫 이미지라면 자동으로 메인 이미지로 설정 (중요)
            if (newPreviews.length === 1) {
                setMainPhotoIndex(0);
            }

            setSnackbar({
                open: true,
                message: "이미지가 추가되었습니다.",
                severity: "success",
            });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (index) => {
        if (imagePreviews.length === 0 || index >= imagePreviews.length) {
            return;
        }

        // 선택된 이미지 삭제
        const newImages = [...images];
        const newPreviews = [...imagePreviews];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setImagePreviews(newPreviews);

        // 메인 이미지가 삭제된 경우 첫 번째 이미지를 메인으로 설정
        if (mainPhotoIndex === index) {
            setMainPhotoIndex(newPreviews.length > 0 ? 0 : 0);
        } else if (mainPhotoIndex > index) {
            setMainPhotoIndex(mainPhotoIndex - 1);
        }

        if (selectedImageIndex === index) {
            setSelectedImageIndex(newPreviews.length > 0 ? 0 : -1);
        } else if (selectedImageIndex > index) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }

        setSnackbar({
            open: true,
            message: "이미지가 삭제되었습니다.",
            severity: "info",
        });
    };

    const handleSelectImage = (index) => {
        setSelectedImageIndex(index);
    };

    const handleSetMainPhoto = (index) => {
        if (imagePreviews.length > 0) {
            setMainPhotoIndex(index);
            setSnackbar({
                open: true,
                message: "대표 사진으로 설정되었습니다",
                severity: "success",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 상세한 필수 입력값 검증
        let errorMessages = [];

        if (!petData.name || !petData.name.trim()) {
            errorMessages.push("반려동물 이름을 입력해주세요.");
        }

        if (!petData.birthDate) {
            errorMessages.push("반려동물의 생일을 선택해주세요.");
        }

        if (!petData.type) {
            errorMessages.push("반려동물 종류를 선택해주세요.");
        }

        if (!petData.gender) {
            errorMessages.push("반려동물의 성별을 선택해주세요.");
        }

        if (!petData.weight || !petData.weight.trim()) {
            errorMessages.push("반려동물의 몸무게를 입력해주세요.");
        } else if (Number(petData.weight) <= 0) {
            errorMessages.push("몸무게는 0보다 커야 합니다.");
        }

        if (!petData.introduction || !petData.introduction.trim()) {
            errorMessages.push("반려동물 소개를 입력해주세요.");
        }

        if (images.length === 0) {
            errorMessages.push("반려동물 사진을 최소 1장 이상 등록해주세요.");
        }

        // 에러 메시지가 있으면 첫 번째 메시지를 표시
        if (errorMessages.length > 0) {
            setSnackbar({
                open: true,
                message: errorMessages[0],
                severity: "error",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // FormData 객체 생성
            const formData = new FormData();

            // 반려동물 데이터 JSON 변환 및 추가
            const petDataJson = JSON.stringify({
                name: petData.name,
                type: petData.type,
                birthDate: petData.birthDate,
                gender: petData.gender,
                isNeutered: petData.isNeutered,
                weight: parseFloat(petData.weight),
                introduction: petData.introduction,
            });

            formData.append("petData", new Blob([petDataJson], { type: "application/json" }));

            // 이미지 추가 - 중요: 대표 이미지를 먼저 추가
            if (images.length > 0) {
                // 먼저 메인 이미지 (썸네일)을 추가
                formData.append("images", images[mainPhotoIndex]);

                // 그 다음 나머지 이미지들 추가
                images.forEach((image, idx) => {
                    if (idx !== mainPhotoIndex) {
                        formData.append("images", image);
                    }
                });
            }

            // API 호출
            const response = await instance.post("/pet/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

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

    const handleGoBack = () => {
        navigate(-1);
    };

    const petTypes = ["강아지", "고양이", "햄스터", "앵무새", "물고기", "기타"];

    // 현재 보여줄 이미지 (선택된 이미지 또는 첫 번째 이미지)
    const currentDisplayImage =
        selectedImageIndex >= 0 && selectedImageIndex < imagePreviews.length
            ? imagePreviews[selectedImageIndex]
            : imagePreviews.length > 0
              ? imagePreviews[0]
              : null;

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <TitleBar name="반려동물 정보추가" onBack={handleGoBack} />

            {/* 선택된 이미지 표시 영역 */}
            <Box
                sx={{
                    position: "relative",
                    mx: "auto",
                    my: 2,
                    width: "calc(100% - 32px)",
                    height: 240,
                    borderRadius: 4,
                    bgcolor: "transparent",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: currentDisplayImage ? "none" : "1px dashed #ccc",
                }}
            >
                {currentDisplayImage ? (
                    <Box
                        component="img"
                        src={currentDisplayImage}
                        alt="선택된 반려동물 사진"
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
                        alt="기본 프로필"
                        sx={{
                            width: "auto",
                            height: "80%",
                            objectFit: "contain",
                            opacity: 0.7,
                        }}
                    />
                )}

                {/* 대표 이미지 설정 버튼 (선택된 이미지가 있을 때만) */}
                {selectedImageIndex >= 0 && (
                    <IconButton
                        onClick={() => handleSetMainPhoto(selectedImageIndex)}
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            color: selectedImageIndex === mainPhotoIndex ? "#FFD700" : "white",
                            bgcolor: "rgba(0,0,0,0.3)",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                            zIndex: 2,
                        }}
                    >
                        <StarIcon />
                    </IconButton>
                )}

                {/* 이미지 업로드 버튼 */}
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

                {/* 선택된 이미지가 있을 때만 삭제 버튼 표시 */}
                {selectedImageIndex >= 0 && (
                    <IconButton
                        onClick={() => handleRemoveImage(selectedImageIndex)}
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
            </Box>

            {/* 이미지 카드 목록 - 이미지가 1개 이상 있을 때만 표시 */}
            {imagePreviews.length > 0 && (
                <Box sx={{ px: 2, mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        등록된 사진 ({imagePreviews.length}/6)
                    </Typography>
                    <Grid container spacing={1}>
                        {imagePreviews.map((preview, index) => (
                            <Grid item xs={4} key={index}>
                                <Card
                                    sx={{
                                        position: "relative",
                                        cursor: "pointer",
                                        border: selectedImageIndex === index ? "2px solid #E9A260" : "none",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        boxShadow:
                                            selectedImageIndex === index ? "0 0 8px rgba(233, 162, 96, 0.6)" : "none",
                                    }}
                                    onClick={() => handleSelectImage(index)}
                                >
                                    <CardMedia
                                        component="img"
                                        image={preview}
                                        alt={`펫 사진 ${index + 1}`}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            objectFit: "cover",
                                        }}
                                    />
                                    {/* 대표 이미지 표시 */}
                                    {index === mainPhotoIndex && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 5,
                                                right: 5,
                                                bgcolor: "rgba(0,0,0,0.5)",
                                                borderRadius: "50%",
                                                width: 20,
                                                height: 20,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <StarIcon sx={{ color: "#FFD700", fontSize: 16 }} />
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                        {/* 추가 버튼 카드 (6개 미만일 때만 표시) */}
                        {imagePreviews.length < 6 && (
                            <Grid item xs={4}>
                                <Card
                                    component="label"
                                    sx={{
                                        height: 100,
                                        width: 100,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        bgcolor: "#f5f5f5",
                                        border: "1px dashed #ccc",
                                        borderRadius: 2,
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: 40, color: "#aaa" }} />
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}

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
                    inputProps={{
                        max: today,
                    }}
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
                    type="text"
                    value={petData.weight}
                    onChange={handleWeightChange}
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
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{
                    "& .SnackbarContent-root": {
                        bottom: 80,
                    },
                }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{
                        width: "100%",
                        mb: 8,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddPet;
