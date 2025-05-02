import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, CircularProgress, Snackbar, Alert } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import instance from "../../services/axiosInstance.js";

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
import { getPetTypeId, getPetCountEnum } from "../../components/Sitter/utils/petSitterUtils";

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

    // 로컬 스토리지에서 기존 등록 정보 확인
    useEffect(() => {
        const checkExistingRegistration = async () => {
            const isRegistrationAttempt = localStorage.getItem("petSitterRegistrationCompleted");

            if (isRegistrationAttempt === "true") {
                try {
                    // 서버에 실제 등록 여부 확인 (instance 사용)
                    const statusResponse = await instance.get("/petsitter/status");

                    if (statusResponse.status === 200) {
                        console.log("펫시터 정보가 이미 서버에 있습니다. 수정 모드로 전환합니다.");
                        // 서버에서 받은 데이터로 폼 초기화
                        const sitterData = statusResponse.data.data;
                        if (sitterData) {
                            initializeFormFromServer(sitterData);
                        }
                    }
                } catch (err) {
                    if (err.response?.status === 404) {
                        console.log("서버에 펫시터 정보가 없습니다. 신규 등록 모드로 진행합니다.");
                        // 로컬 스토리지에서 정보 초기화
                        localStorage.removeItem("petSitterRegistrationCompleted");
                        localStorage.removeItem("petSitterInfo");
                    } else {
                        console.error("펫시터 상태 확인 중 오류:", err);
                    }
                }
            }
        };

        checkExistingRegistration();
    }, []);

    // 서버 데이터로 폼 초기화
    const initializeFormFromServer = (data) => {
        // 연령대 설정
        if (data.age) {
            const newAges = { ...selectedAges };
            Object.keys(newAges).forEach((key) => {
                newAges[key] = key === data.age;
            });
            setSelectedAges(newAges);
        }

        // 반려동물 여부 설정
        if (data.grown !== undefined) {
            setHasPet({
                "네, 키우고 있습니다": data.grown,
                "키우고 있지 않습니다": !data.grown,
            });
        }

        // 펫 타입 설정
        if (data.petType) {
            const petTypeName = data.petType.name || "";
            const newPetTypes = { ...petTypes };
            Object.keys(newPetTypes).forEach((key) => {
                newPetTypes[key] = key === petTypeName;
            });
            setPetTypes(newPetTypes);
        }

        // 펫 수 설정
        if (data.petCount) {
            const countMap = {
                ONE: "1마리",
                TWO: "2마리",
                THREE_PLUS: "3마리 이상",
            };
            const countStr = countMap[data.petCount] || "1마리";
            const newPetCount = { ...petCount };
            Object.keys(newPetCount).forEach((key) => {
                newPetCount[key] = key === countStr;
            });
            setPetCount(newPetCount);
        }

        // 경험 설정
        if (data.sitterExp !== undefined) {
            setSitterExperience({
                "네, 해본적 있습니다": data.sitterExp,
                "아니요, 해본적 없습니다": !data.sitterExp,
            });
        }

        // 주거형태 설정
        if (data.houseType) {
            const newHouseType = { ...houseType };
            Object.keys(newHouseType).forEach((key) => {
                newHouseType[key] = key === data.houseType;
            });
            setHouseType(newHouseType);
        }

        // 코멘트 설정
        if (data.comment) {
            setCommentText(data.comment);
        }

        // 이미지 설정
        if (data.imagePath) {
            setImagePreview(data.imagePath);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            if (step === 6) {
                setStep(3);
            } else {
                setStep(step - 1);
            }
        } else {
            navigate(-1);
        }
    };

    const handleNext = () => {
        // 현재 단계에서 필요한 유효성 검증
        let isValid = true;
        let errorMessage = "";

        switch (step) {
            case 1: // 프로필 이미지
                if (!imagePreview) {
                    isValid = false;
                    errorMessage = "프로필 이미지를 선택해주세요.";
                }
                break;
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
        }

        if (!isValid) {
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "warning",
            });
            return;
        }

        if (step === 3 && hasPet["키우고 있지 않습니다"]) {
            setStep(6);=
        } else {
            setStep((prev) => Math.min(prev + 1, 9));
        }
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

            // 서버에 이미 등록된 펫시터인지 확인
            let isUpdate = false;
            try {
                const statusResponse = await instance.get("/petsitter/status");

                if (statusResponse.status === 200) {
                    console.log("기존 펫시터 정보 업데이트 모드");
                    isUpdate = true;
                }
            } catch (err) {
                // 404 에러는 정상적인 경우 (신규 등록)
                if (err.response?.status !== 404) {
                    console.error("펫시터 상태 확인 중 오류:", err);
                }
            }

            // 펫시터 데이터 생성
            const petSitterData = {
                age: Object.keys(selectedAges).find((key) => selectedAges[key]) || "20대",
                houseType: Object.keys(houseType).find((key) => houseType[key]) || "아파트",
                comment: commentText || "제 가족이라는 마음으로 돌봐드려요 ♥",
                grown: hasPet["네, 키우고 있습니다"],
                petCount: getPetCountEnum(Object.keys(petCount).find((key) => petCount[key]) || "1마리"),
                sitterExp: sitterExperience["네, 해본적 있습니다"],
                petTypeId: getPetTypeId(Object.keys(petTypes).find((key) => petTypes[key]) || null),
            };

            console.log("펫시터 데이터:", petSitterData);

            // FormData 객체 생성
            const formData = new FormData();

            // JSON 데이터를 문자열로 직접 전달
            formData.append("data", JSON.stringify(petSitterData));

            // 이미지 파일 추가
            if (imageFile) {
                formData.append("image", imageFile);
            } else if (imagePreview && !imagePreview.startsWith("http")) {
                // 데이터 URL을 Blob으로 변환 (서버 URL이 아닐 경우에만)
                try {
                    const response = await fetch(imagePreview);
                    const imageBlob = await response.blob();
                    formData.append("image", imageBlob, "profile.jpg");
                } catch (err) {
                    console.error("이미지 변환 오류:", err);
                }
            }

            // FormData 내용 확인
            console.log("FormData 내용:");
            for (let [key, value] of formData.entries()) {
                console.log(`- ${key}:`, value instanceof Blob ? `Blob (${value.size} bytes)` : value);
            }

            // API 호출 (instance 사용)
            console.log("API 요청 시작");
            const res = await instance.post("/petsitter/apply", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 30000, // 30초 타임아웃
            });

            console.log("API 응답:", res);

            if (res.status === 200 || res.status === 201) {
                console.log("API 요청 성공");

                // 로컬 스토리지에 저장할 정보
                const sitterInfo = {
                    registered: false,
                    isPending: true,
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

                // 이벤트 발생
                window.dispatchEvent(
                    new CustomEvent("petSitterRegistered", {
                        detail: {
                            registered: false,
                            isPending: true,
                            status: "NONE",
                            info: sitterInfo,
                        },
                    })
                );

                setSnackbar({
                    open: true,
                    message: isUpdate
                        ? "펫시터 정보가 성공적으로 업데이트되었습니다."
                        : "펫시터 신청이 완료되었습니다. 관리자 승인 후 활동이 가능합니다.",
                    severity: "success",
                });

                // 성공 시 마이페이지로 이동
                setTimeout(() => {
                    navigate("/mypage");
                }, 1500);
            }
        } catch (error) {
            console.error("펫시터 신청 오류:", error);
            console.error("오류 상세:", error.response?.data);

            let errorMessage = "펫시터 신청 중 오류가 발생했습니다.";

            if (error.response) {
                if (error.response.status === 400) {
                    // 클라이언트 오류 (잘못된 요청)
                    errorMessage = error.response.data?.message || "입력 정보를 확인해주세요.";
                } else if (error.response.status === 401) {
                    // 인증 오류
                    errorMessage = "로그인이 필요합니다.";
                    setTimeout(() => navigate("/login"), 1500);
                } else if (error.response.status === 409) {
                    // 충돌 오류
                    errorMessage = "이미 진행 중인 신청이 있습니다.";
                } else if (error.response.status >= 500) {
                    // 서버 오류
                    errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
                }
            }

            setSnackbar({
                open: true,
                message: errorMessage,
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
                sx={{
                    bottom: "150px",
                    zIndex: 100000,
                }}
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
