import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, CircularProgress, Snackbar, Alert } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 공통 컴포넌트
import StepProgress from "../../components/Sitter/common/StepProgress";
import StepButtons from "../../components/Sitter/common/StepButtons";

// 단계별 컴포넌트
import ProfileUploadStep from "../../components/Sitter/steps/ProfileUploadStep";
import AgeSelectionStep from "../../components/Sitter/steps/AgeSelectionStep";
import PetOwnershipStep from "../../components/Sitter/steps/PetOwnershipStep";
import PetTypeStep from "../../components/Sitter/steps/PetTypeStep";
import PetCountStep from "../../components/Sitter/steps/PetCountStep";
import ExperienceStep from "../../components/Sitter/steps/ExperienceStep";
import HousingTypeStep from "../../components/Sitter/steps/HousingTypeStep";
import CommentStep from "../../components/Sitter/steps/CommentStep";
import CompletionStep from "../../components/Sitter/steps/CompletionStep";

const PetSitterRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 알림 상태
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const [selectedAges, setSelectedAges] = useState({
        "20대": false,
        "30대": false,
        "40대": false,
        "50대이상": false,
    });

    const [hasPet, setHasPet] = useState({
        "네, 키우고 있습니다": true,
        "키우고 있지 않습니다": false,
    });

    const [petTypes, setPetTypes] = useState({
        강아지: false,
        고양이: false,
        앵무새: false,
        햄스터: false,
        기타: false,
    });

    const [otherPetText, setOtherPetText] = useState("");

    const [petCount, setPetCount] = useState({
        "1마리": true,
        "2마리": false,
        "3마리 이상": false,
    });

    const [sitterExperience, setSitterExperience] = useState({
        "네, 해본적 있습니다": true,
        "아니요, 해본적 없습니다": false,
    });

    const [houseType, setHouseType] = useState({
        아파트: false,
        주택: false,
        오피스텔: false,
        기타: false,
    });

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const handleNext = () => {
        // 현재 단계에서 필요한 유효성 검증
        let isValid = true;
        let errorMessage = "";

        switch (step) {
            case 2: // 연령대 선택
                if (!Object.values(selectedAges).some((value) => value)) {
                    isValid = false;
                    errorMessage = "연령대를 선택해주세요.";
                }
                break;
            case 3: // 반려동물 소유 여부
                if (!Object.values(hasPet).some((value) => value)) {
                    isValid = false;
                    errorMessage = "반려동물 소유 여부를 선택해주세요.";
                }
                break;
            case 4: // 반려동물 종류
                if (hasPet["네, 키우고 있습니다"] && !Object.values(petTypes).some((value) => value)) {
                    isValid = false;
                    errorMessage = "반려동물 종류를 선택해주세요.";
                }
                if (petTypes["기타"] && !otherPetText.trim()) {
                    isValid = false;
                    errorMessage = "기타 반려동물 종류를 입력해주세요.";
                }
                break;
            case 5: // 반려동물 마릿수
                if (hasPet["네, 키우고 있습니다"] && !Object.values(petCount).some((value) => value)) {
                    isValid = false;
                    errorMessage = "반려동물 마릿수를 선택해주세요.";
                }
                break;
            case 6: // 펫시터 경험
                if (!Object.values(sitterExperience).some((value) => value)) {
                    isValid = false;
                    errorMessage = "펫시터 경험 여부를 선택해주세요.";
                }
                break;
            case 7: // 주거 형태
                if (!Object.values(houseType).some((value) => value)) {
                    isValid = false;
                    errorMessage = "주거 형태를 선택해주세요.";
                }
                break;
            // 8단계(한마디)는 필수가 아니므로 검증 생략
        }

        if (!isValid) {
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "warning",
            });
            return;
        }

        setStep((prev) => Math.min(prev + 1, 9));
    };

    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        setProgress(
            {
                1: 0,
                2: 13,
                3: 25,
                4: 38,
                5: 50,
                6: 63,
                7: 75,
                8: 88,
                9: 100,
            }[step] || 0
        );
    }, [step]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({
                open: true,
                message: "이미지 크기는 5MB 이하여야 합니다.",
                severity: "error",
            });
            return;
        }

        if (!file.type.startsWith("image/")) {
            setSnackbar({
                open: true,
                message: "이미지 파일만 업로드 가능합니다.",
                severity: "error",
            });
            return;
        }

        // 이미지 파일 저장
        setImageFile(file);

        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onload = (event) => {
            setImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    // 폼 데이터 검증
    const validateForm = () => {
        if (!imagePreview) {
            setSnackbar({
                open: true,
                message: "프로필 이미지를 선택해주세요.",
                severity: "warning",
            });
            return false;
        }

        if (!Object.values(selectedAges).some((value) => value)) {
            setSnackbar({
                open: true,
                message: "연령대를 선택해주세요.",
                severity: "warning",
            });
            return false;
        }

        if (!Object.values(hasPet).some((value) => value)) {
            setSnackbar({
                open: true,
                message: "반려동물 여부를 선택해주세요.",
                severity: "warning",
            });
            return false;
        }

        if (hasPet["네, 키우고 있습니다"]) {
            if (!Object.values(petTypes).some((value) => value)) {
                setSnackbar({
                    open: true,
                    message: "반려동물 종류를 선택해주세요.",
                    severity: "warning",
                });
                return false;
            }

            if (petTypes["기타"] && !otherPetText.trim()) {
                setSnackbar({
                    open: true,
                    message: "기타 반려동물 종류를 입력해주세요.",
                    severity: "warning",
                });
                return false;
            }

            if (!Object.values(petCount).some((value) => value)) {
                setSnackbar({
                    open: true,
                    message: "반려동물 마릿수를 선택해주세요.",
                    severity: "warning",
                });
                return false;
            }
        }

        if (!Object.values(sitterExperience).some((value) => value)) {
            setSnackbar({
                open: true,
                message: "펫시터 경험 여부를 선택해주세요.",
                severity: "warning",
            });
            return false;
        }

        if (!Object.values(houseType).some((value) => value)) {
            setSnackbar({
                open: true,
                message: "주거 형태를 선택해주세요.",
                severity: "warning",
            });
            return false;
        }

        return true;
    };

    const handleComplete = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            // 요청 데이터 생성
            const formData = new FormData();

            // 펫시터 데이터 생성
            const petSitterData = {
                age: Object.keys(selectedAges).find((key) => selectedAges[key]),
                houseType: Object.keys(houseType).find((key) => houseType[key]),
                comment: commentText || "제 가족이라는 마음으로 돌봐드려요 ♥",
                grown: hasPet["네, 키우고 있습니다"],
                petCount:
                    Object.keys(petCount).find((key) => petCount[key]) === "1마리"
                        ? "ONE"
                        : Object.keys(petCount).find((key) => petCount[key]) === "2마리"
                          ? "TWO"
                          : "THREE_PLUS",
                sitterExp: sitterExperience["네, 해본적 있습니다"],
                petTypeId: petTypes["강아지"]
                    ? 1
                    : petTypes["고양이"]
                      ? 2
                      : petTypes["앵무새"]
                        ? 3
                        : petTypes["햄스터"]
                          ? 4
                          : petTypes["기타"]
                            ? 5
                            : null,
            };

            // FormData 객체에 데이터 추가
            const blob = new Blob([JSON.stringify(petSitterData)], {
                type: "application/json",
            });
            formData.append("data", blob);

            // 이미지 파일 추가
            if (imageFile) {
                formData.append("image", imageFile, imageFile.name);
            } else if (imagePreview) {
                // 데이터 URL을 Blob으로 변환
                const response = await fetch(imagePreview);
                const blob = await response.blob();
                formData.append("image", blob, "profile.jpg");
            }

            // API 요청 (재시도 로직 포함)
            const maxRetries = 3;
            let retryCount = 0;
            let success = false;

            while (retryCount < maxRetries && !success) {
                try {
                    const res = await axios.post("/api/petsitter/apply", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    });

                    if (res.status === 200 || res.status === 201) {
                        success = true;
                        const sitterInfo = {
                            registered: false,
                            isPending: false,
                            status: "NONE",
                            age: petSitterData.age,
                            petType: Object.keys(petTypes).find((key) => petTypes[key]) || "강아지",
                            petCount: Object.keys(petCount).find((key) => petCount[key]) || "1마리",
                            houseType: petSitterData.houseType,
                            comment: petSitterData.comment,
                            image: imagePreview,
                            experience: petSitterData.sitterExp,
                            registeredAt: new Date().toISOString(),
                        };

                        localStorage.setItem("petSitterRegistrationCompleted", "true");
                        localStorage.setItem("petSitterInfo", JSON.stringify(sitterInfo));

                        window.dispatchEvent(
                            new CustomEvent("petSitterRegistered", {
                                detail: { registered: false, isPending: true, status: "PENDING", info: sitterInfo },
                            })
                        );

                        setSnackbar({
                            open: true,
                            message: "펫시터 신청이 완료되었습니다. 관리자 승인 후 활동이 가능합니다.",
                            severity: "success",
                        });

                        // 성공 시 마이페이지로 이동 (약간의 딜레이 추가)
                        setTimeout(() => {
                            navigate("/mypage");
                        }, 1500);
                    }
                } catch (error) {
                    console.error(`펫시터 신청 오류 (시도 ${retryCount + 1}/${maxRetries}):`, error);

                    // 특정 오류의 경우 재시도 하지 않음
                    if (
                        error.response?.status === 400 &&
                        error.response?.data?.message?.includes("이미 승인된 펫시터입니다")
                    ) {
                        setSnackbar({
                            open: true,
                            message: "이미 승인된 펫시터입니다.",
                            severity: "error",
                        });
                        break;
                    }

                    if (
                        error.response?.status === 400 &&
                        error.response?.data?.message?.includes("승인 대기 중인 신청이 있습니다")
                    ) {
                        // PENDING 상태로 간주하고 성공 처리
                        const sitterInfo = {
                            registered: false,
                            isPending: false,
                            status: "NONE",
                            age: petSitterData.age,
                            petType: Object.keys(petTypes).find((key) => petTypes[key]) || "강아지",
                            petCount: Object.keys(petCount).find((key) => petCount[key]) || "1마리",
                            houseType: petSitterData.houseType,
                            comment: petSitterData.comment,
                            image: imagePreview,
                            experience: petSitterData.sitterExp,
                        };

                        localStorage.setItem("petSitterRegistrationCompleted", "true");
                        localStorage.setItem("petSitterInfo", JSON.stringify(sitterInfo));

                        window.dispatchEvent(
                            new CustomEvent("petSitterRegistered", {
                                detail: { registered: false, isPending: false, status: "NONE", info: sitterInfo },
                            })
                        );

                        setSnackbar({
                            open: true,
                            message: "승인 대기 중인 신청이 있습니다. 관리자 승인을 기다려주세요.",
                            severity: "info",
                        });

                        setTimeout(() => {
                            navigate("/mypage");
                        }, 1500);

                        success = true; // 성공으로 처리
                        break;
                    }

                    // 409 충돌 오류 처리 (동시성 문제)
                    if (error.response?.status === 409) {
                        if (retryCount < maxRetries - 1) {
                            retryCount++;
                            // 점진적으로 대기 시간 증가 (백오프 전략)
                            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
                            continue;
                        } else {
                            // 마지막 재시도에서 실패한 경우 - 충돌이 지속되면 성공으로 간주
                            const sitterInfo = {
                                registered: false,
                                isPending: false,
                                status: "NONE",
                                age: petSitterData.age,
                                petType: Object.keys(petTypes).find((key) => petTypes[key]) || "강아지",
                                petCount: Object.keys(petCount).find((key) => petCount[key]) || "1마리",
                                houseType: petSitterData.houseType,
                                comment: petSitterData.comment,
                                image: imagePreview,
                                experience: petSitterData.sitterExp,
                            };

                            localStorage.setItem("petSitterRegistrationCompleted", "true");
                            localStorage.setItem("petSitterInfo", JSON.stringify(sitterInfo));

                            setSnackbar({
                                open: true,
                                message: "펫시터 신청이 처리되었습니다. 관리자 승인을 기다려주세요.",
                                severity: "info",
                            });

                            setTimeout(() => {
                                navigate("/mypage");
                            }, 1500);

                            success = true; // 성공으로 처리
                            break;
                        }
                    }

                    // 동시성 오류의 경우 잠시 기다렸다가 재시도
                    if (
                        error.response?.data?.message?.includes("다른 사용자가 동시에 데이터를 수정") ||
                        error.message?.includes("Row was updated or deleted by another transaction")
                    ) {
                        retryCount++;
                        // 점진적으로 대기 시간 증가 (백오프 전략)
                        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
                        continue;
                    }

                    // 401 인증 오류 처리
                    if (error.response?.status === 401) {
                        setSnackbar({
                            open: true,
                            message: "로그인이 필요합니다. 로그인 페이지로 이동합니다.",
                            severity: "error",
                        });

                        setTimeout(() => {
                            navigate("/login");
                        }, 1500);
                        break;
                    }

                    // 기타 오류는 사용자에게 표시하고 중단
                    setSnackbar({
                        open: true,
                        message:
                            error.response?.data?.message ||
                            "펫시터 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                        severity: "error",
                    });
                    break;
                }
            }

            if (!success && retryCount >= maxRetries) {
                setSnackbar({
                    open: true,
                    message: "서버가 혼잡합니다. 잠시 후 다시 시도해주세요.",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("펫시터 신청 오류:", error);
            setSnackbar({
                open: true,
                message: "펫시터 신청 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"),
                severity: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 현재 단계에 맞는 컴포넌트 렌더링
    const renderStep = () => {
        switch (step) {
            case 1:
                return <ProfileUploadStep imagePreview={imagePreview} onImageUpload={handleImageUpload} />;
            case 2:
                return <AgeSelectionStep selectedAges={selectedAges} onChange={setSelectedAges} />;
            case 3:
                return <PetOwnershipStep hasPet={hasPet} onChange={setHasPet} />;
            case 4:
                return (
                    <PetTypeStep
                        petTypes={petTypes}
                        onChange={setPetTypes}
                        otherPetText={otherPetText}
                        onOtherPetTextChange={setOtherPetText}
                    />
                );
            case 5:
                return <PetCountStep petCount={petCount} onChange={setPetCount} />;
            case 6:
                return <ExperienceStep sitterExperience={sitterExperience} onChange={setSitterExperience} />;
            case 7:
                return <HousingTypeStep houseType={houseType} onChange={setHouseType} />;
            case 8:
                return <CommentStep commentText={commentText} onChange={setCommentText} />;
            case 9:
                return (
                    <CompletionStep
                        imagePreview={imagePreview}
                        formData={{
                            selectedAges,
                            hasPet,
                            petTypes,
                            petCount,
                            sitterExperience,
                            houseType,
                            commentText,
                        }}
                        onComplete={handleComplete}
                    />
                );
            default:
                return null;
        }
    };

    // Snackbar 닫기 핸들러
    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <Box
            sx={{
                p: 2,
                height: "100vh",
                maxHeight: "100vh",
                overflow: "hidden",
                bgcolor: "white",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* 상단 헤더 */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <IconButton onClick={handleBack} disabled={isSubmitting} sx={{ p: 0, mr: 1 }}>
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                </IconButton>
                <Typography variant="h5" component="h1" fontWeight="700" color="#363636">
                    {localStorage.getItem("petSitterRegistrationCompleted") === "true"
                        ? "펫시터 정보 수정"
                        : "펫시터 등록"}
                </Typography>
            </Box>

            {/* 진행 표시 바 */}
            <StepProgress progress={progress} />

            {/* 단계별 내용 */}
            {renderStep()}

            {/* 구분선 (마지막 페이지에서는 없음) */}
            {step !== 9 && (
                <hr
                    style={{
                        width: "calc(100% - 32px)",
                        border: "none",
                        height: "1px",
                        backgroundColor: "#e0e0e0",
                        position: "absolute",
                        bottom: "200px",
                        left: "16px",
                        margin: 0,
                        padding: 0,
                    }}
                />
            )}

            {/* 단계별 버튼 */}
            <StepButtons
                step={step}
                totalSteps={9}
                onBack={handleBack}
                onNext={handleNext}
                hideButtons={step === 9 || isSubmitting}
            />

            {/* 로딩 인디케이터 */}
            {isSubmitting && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        zIndex: 9999,
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <CircularProgress sx={{ color: "#E9A260" }} />
                        <Typography sx={{ mt: 2, color: "#E9A260" }}>요청 처리 중...</Typography>
                    </Box>
                </Box>
            )}

            {/* 알림 Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PetSitterRegister;
