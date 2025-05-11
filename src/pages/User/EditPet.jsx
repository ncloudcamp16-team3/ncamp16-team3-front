import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import petEx from "/src/assets/images/User/profile.png";
import instance from "../../services/axiosInstance.js";

const EditPet = () => {
    const navigate = useNavigate();
    const { petId } = useParams();

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
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
    const today = new Date().toISOString().split("T")[0];

    // 반려동물 종류 옵션
    const petTypes = ["강아지", "고양이", "햄스터", "앵무새", "물고기", "기타"];

    // 데이터 로드
    useEffect(() => {
        const loadPetData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // API 호출로 반려동물 정보 가져오기
                const response = await instance.get(`/pet/${petId}`);

                if (response.data && response.data.data) {
                    const petInfo = response.data.data;

                    // 상태 업데이트
                    setPetData({
                        name: petInfo.name || "",
                        type: petInfo.type || "",
                        birthDate: petInfo.birthDate || "",
                        gender: petInfo.gender || "",
                        isNeutered: petInfo.isNeutered || false,
                        weight: petInfo.weight ? petInfo.weight.toString() : "",
                        introduction: petInfo.introduction || "",
                    });

                    // 이미지 상태 초기화
                    const newImages = [];
                    const newPreviews = [];

                    // 썸네일 이미지 인덱스 찾기
                    let thumbnailIndex = 0;

                    // 이미지 정보 설정
                    if (petInfo.photos && petInfo.photos.length > 0) {
                        petInfo.photos.forEach((photo, index) => {
                            const mockFile = {
                                isExisting: true,
                                path: photo.path,
                                id: photo.id,
                            };

                            newImages.push(mockFile);
                            newPreviews.push(photo.path);

                            // 썸네일(대표 이미지) 찾기
                            if (photo.thumbnail) {
                                thumbnailIndex = index;
                            }
                        });
                    }

                    setImages(newImages);
                    setImagePreviews(newPreviews);
                    setMainPhotoIndex(thumbnailIndex);
                    setSelectedImageIndex(0);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("반려동물 정보 로드 실패:", error);

                // 401 오류인 경우 로그인 페이지로 리다이렉트
                if (error.response && error.response.status === 401) {
                    setError("인증이 필요합니다. 로그인 페이지로 이동합니다.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    setError("반려동물 정보를 불러오는데 실패했습니다.");
                }
                setIsLoading(false);
            }
        };

        if (petId) {
            loadPetData();
        }
    }, [petId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData({
            ...petData,
            [name]: value,
        });
    };

    const handleWeightChange = (e) => {
        const value = e.target.value;

        const regex = /^[0-9]*\.?[0-9]*$/;

        if (value === "" || regex.test(value)) {
            if (value === "" || parseFloat(value) <= 1000) {
                setPetData({
                    ...petData,
                    weight: value,
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "몸무게는 최대 1000kg까지 입력 가능합니다.",
                    severity: "warning",
                });
            }
        }
    };

    // 소개글 입력
    const handleIntroductionChange = (e) => {
        const value = e.target.value;

        if (value.length <= 255) {
            setPetData({
                ...petData,
                introduction: value,
            });
        } else {
            setSnackbar({
                open: true,
                message: "소개글은 최대 255자까지 입력 가능합니다.",
                severity: "warning",
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

            setSelectedImageIndex(newPreviews.length - 1);

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

        // 기존 이미지라면 삭제 목록에 추가
        if (images[index] && images[index].isExisting && images[index].id) {
            setDeletedImageIds((prev) => [...prev, images[index].id]);
        }

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setImagePreviews(newPreviews);

        // 메인 이미지가 삭제된 경우 첫 번째 이미지를 메인으로 설정
        if (mainPhotoIndex === index) {
            setMainPhotoIndex(newPreviews.length > 0 ? 0 : 0);
        } else if (mainPhotoIndex > index) {
            // 메인 이미지 인덱스 조정
            setMainPhotoIndex(mainPhotoIndex - 1);
        }

        // 현재 선택 인덱스 조정
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
            mainPhotoIndex: mainPhotoIndex,
        });

        formData.append("petData", new Blob([petDataJson], { type: "application/json" }));

        // 이미지 처리 수정
        const existingPhotos = [];
        const newImages = [];

        // 현재 있는 모든 이미지 처리
        images.forEach((img, index) => {
            if (img instanceof File) {
                // 새로 추가된 이미지
                newImages.push({ file: img, index: index });
            } else if (img && img.isExisting && img.id) {
                // 기존 이미지
                existingPhotos.push({
                    id: img.id,
                    thumbnail: index === mainPhotoIndex,
                    order: index,
                });
            }
        });

        // 새 이미지 추가
        newImages.forEach((item) => {
            formData.append("images", item.file);
        });

        // 기존 이미지 정보 추가
        if (existingPhotos.length > 0 || deletedImageIds.length > 0) {
            const photoInfo = {
                existing: existingPhotos,
                deleted: deletedImageIds,
            };
            formData.append("existingPhotos", new Blob([JSON.stringify(photoInfo)], { type: "application/json" }));
        }

        try {
            const response = await instance.put(`/pet/${petId}/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // 성공 시 처리
            setSnackbar({
                open: true,
                message: "반려동물 정보가 성공적으로 수정되었습니다.",
                severity: "success",
            });

            // 잠시 후 페이지 이동
            setTimeout(() => {
                navigate("/mypage");
            }, 1500);
        } catch (error) {
            console.error("반려동물 정보 수정 오류:", error);

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
                message: error.response?.data?.message || "반려동물 정보 수정 중 오류가 발생했습니다.",
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    // 현재 보여줄 이미지 (선택된 이미지 또는 첫 번째 이미지)
    const currentDisplayImage =
        selectedImageIndex >= 0 && selectedImageIndex < imagePreviews.length
            ? imagePreviews[selectedImageIndex]
            : imagePreviews.length > 0
              ? imagePreviews[0]
              : null;

    if (isLoading) {
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography>데이터를 불러오는 중...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate("/mypage")}
                    sx={{
                        bgcolor: "#E9A260",
                        "&:hover": { bgcolor: "#d0905a" },
                    }}
                >
                    마이페이지로 돌아가기
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "white", minHeight: "100vh", pb: 8 }}>
            <TitleBar name="반려동물 정보수정" onBack={handleGoBack} />

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

                {/* 이미지 업로드 버튼 - 항상 표시 */}
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
                                        width: 100,
                                        height: 100,
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
                    onChange={handleIntroductionChange}
                    placeholder="반려동물을 소개해주세요 (최대 255자)"
                    helperText={`${petData.introduction.length}/255`}
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

export default EditPet;
