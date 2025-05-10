import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import instance from "../../services/axiosInstance.js";
// 공통 컴포넌트
import StepProgress from "../../components/Sitter/common/StepProgress";
import StepButtons from "../../components/Sitter/common/StepButtons";
import GlobalSnackbar from "../../components/Global/GlobalSnackbar";

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
import { getPetTypeId, getPetCountEnum, getSelectedPetTypes } from "../../components/Sitter/utils/petSitterUtils";

const PetSitterRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageChanged, setIsImageChanged] = useState(false);

    // 알림 상태
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // 폼 데이터 상태 - 직접 데이터 구조 추적
    const [petSitterData, setPetSitterData] = useState({
        age: "",
        houseType: "",
        comment: "",
        grown: false,
        petCount: "",
        sitterExp: false,
        petTypeId: null,
        petTypesFormatted: "",
        petTypes: [],
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
        "1마리": false,
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

    const [commentText, setCommentText] = useState("");

    // 초기화 상태 추적
    const [isInitialized, setIsInitialized] = useState(false);
    const [existingImagePath, setExistingImagePath] = useState(null);

    // 기존 펫시터 정보 확인 및 폼 초기화
    useEffect(() => {
        const checkExistingRegistration = async () => {
            // 초기 로딩 상태 설정
            setIsInitialized(false);

            // 타임아웃 설정
            const timeoutId = setTimeout(() => {
                console.log("펫시터 상태 확인 타임아웃, 기본 초기화 진행");
                setIsInitialized(true);
            }, 10000);

            try {
                // 서버에서 펫시터 상태 확인
                const statusResponse = await instance.get("/petsitter/status");
                console.log("서버 응답:", statusResponse);

                if (statusResponse.status === 200 && statusResponse.data.data) {
                    const sitterData = statusResponse.data.data;

                    // 폼 초기화 함수 호출
                    initializeFormFromServer(sitterData);

                    // 로컬 스토리지에 등록 상태 저장
                    localStorage.setItem("petSitterRegistrationCompleted", "true");

                    clearTimeout(timeoutId);
                    setIsInitialized(true);
                } else {
                    // 서버 응답은 성공했으나 데이터가 없는 경우
                    const isRegistrationAttempt = localStorage.getItem("petSitterRegistrationCompleted");
                    if (isRegistrationAttempt === "true") {
                        // 로컬 스토리지에서 폼 초기화 시도
                        try {
                            const localData = localStorage.getItem("petSitterInfo");
                            if (localData) {
                                const parsedData = JSON.parse(localData);
                                console.log("로컬 스토리지에서 로드한 데이터:", parsedData);
                                initializeFormFromLocal(parsedData);
                            }
                        } catch (e) {
                            console.error("로컬 스토리지 데이터 로드 오류:", e);
                        }
                    }

                    clearTimeout(timeoutId);
                    setIsInitialized(true);
                }
            } catch (err) {
                console.error("펫시터 상태 확인 중 오류:", err);

                // 404 오류는 등록되지 않은 상태이므로 정상
                if (err.response?.status === 404) {
                    // 로컬 스토리지에서 정보를 찾아보기
                    const isRegistrationAttempt = localStorage.getItem("petSitterRegistrationCompleted");
                    if (isRegistrationAttempt === "true") {
                        try {
                            const localData = localStorage.getItem("petSitterInfo");
                            if (localData) {
                                const parsedData = JSON.parse(localData);
                                console.log("로컬 스토리지에서 로드한 데이터:", parsedData);
                                initializeFormFromLocal(parsedData);
                            }
                        } catch (e) {
                            console.error("로컬 스토리지 데이터 로드 오류:", e);
                            localStorage.removeItem("petSitterRegistrationCompleted");
                            localStorage.removeItem("petSitterInfo");
                        }
                    }
                }

                clearTimeout(timeoutId);
                setIsInitialized(true);
            }
        };

        checkExistingRegistration();
    }, []);

    // 로컬 스토리지에서 데이터로 폼 초기화
    const initializeFormFromLocal = (data) => {
        console.log("로컬 스토리지에서 받은 펫시터 데이터:", data);

        // 기존 이미지 경로 저장
        if (data.image) {
            setExistingImagePath(data.image);
            setImagePreview(data.image);
            console.log("로컬 스토리지에서 이미지 경로 저장:", data.image);
        }

        // 직접 petSitterData 상태 업데이트
        setPetSitterData((prevData) => ({
            ...prevData,
            age: data.age || "",
            houseType: data.houseType || "",
            comment: data.comment || "",
            grown: Boolean(data.grown),
            petCount: data.petCount || "",
            sitterExp: Boolean(data.experience),
            petTypeId: data.petType ? getPetTypeId(data.petType) : null,
            petTypesFormatted: data.petTypesFormatted || "",
            petTypes: data.petTypes || [],
        }));

        // 연령대 설정
        if (data.age) {
            const newAges = { ...selectedAges };
            Object.keys(newAges).forEach((key) => {
                newAges[key] = key === data.age;
            });
            setSelectedAges(newAges);
        }

        // 반려동물 소유 여부 설정
        setHasPet({
            "네, 키우고 있습니다": Boolean(data.grown),
            "키우고 있지 않습니다": !data.grown,
        });

        // 펫 타입 설정
        if (data.petTypesFormatted || (data.petTypes && data.petTypes.length > 0)) {
            const petTypesList = data.petTypesFormatted ? data.petTypesFormatted.split(", ") : data.petTypes;
            if (petTypesList && petTypesList.length > 0) {
                const newPetTypes = { ...petTypes };

                Object.keys(newPetTypes).forEach((key) => {
                    newPetTypes[key] = petTypesList.includes(key);
                });

                setPetTypes(newPetTypes);

                // 기타 항목 처리
                if (petTypesList.some((type) => !Object.keys(newPetTypes).includes(type) || type === "기타")) {
                    newPetTypes["기타"] = true;
                    const otherTypes = petTypesList.filter(
                        (type) => !Object.keys(newPetTypes).includes(type) || type === "기타"
                    );
                    setOtherPetText(otherTypes.join(", "));
                }
            }
        }

        // 펫 수 설정
        if (data.petCount) {
            const newPetCount = { ...petCount };
            Object.keys(newPetCount).forEach((key) => {
                newPetCount[key] = key === data.petCount;
            });
            setPetCount(newPetCount);
        }

        // 경험 설정
        setSitterExperience({
            "네, 해본적 있습니다": Boolean(data.experience),
            "아니요, 해본적 없습니다": !data.experience,
        });

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

        console.log("로컬 스토리지에서 폼 데이터 초기화 완료");
    };

    // 서버에서 가져온 데이터로 폼 초기화하는 함수
    const initializeFormFromServer = (data) => {
        console.log("서버에서 받은 펫시터 데이터:", data);

        // 기존 이미지 경로 저장
        if (data.imagePath) {
            setExistingImagePath(data.imagePath);
            setImagePreview(data.imagePath);
            console.log("기존 이미지 경로 저장:", data.imagePath);
        }

        // 직접 petSitterData 상태 업데이트
        setPetSitterData((prevData) => ({
            ...prevData,
            age: data.age || "",
            houseType: data.houseType || "",
            comment: data.comment || "",
            grown: Boolean(data.grown), // 명시적으로 불리언으로 변환
            petCount: data.petCount || "",
            sitterExp: Boolean(data.sitterExp), // 명시적으로 불리언으로 변환
            petTypeId: data.petTypeId || null,
            petTypesFormatted: data.petTypesFormatted || "",
            petTypes: data.petTypesFormatted ? data.petTypesFormatted.split(", ") : [],
        }));

        // 연령대 설정
        if (data.age) {
            const newAges = { ...selectedAges };
            Object.keys(newAges).forEach((key) => {
                newAges[key] = key === data.age;
            });
            setSelectedAges(newAges);
        }

        // 반려동물 소유 여부 설정
        setHasPet({
            "네, 키우고 있습니다": Boolean(data.grown),
            "키우고 있지 않습니다": !data.grown,
        });

        // 펫 타입 설정
        if (data.petTypesFormatted) {
            const petTypesList = data.petTypesFormatted.split(", ");
            const newPetTypes = { ...petTypes };

            Object.keys(newPetTypes).forEach((key) => {
                newPetTypes[key] = petTypesList.includes(key);
            });

            setPetTypes(newPetTypes);

            // 기타 항목 처리
            if (petTypesList.some((type) => !Object.keys(newPetTypes).includes(type) || type === "기타")) {
                newPetTypes["기타"] = true;
                const otherTypes = petTypesList.filter(
                    (type) => !Object.keys(newPetTypes).includes(type) || type === "기타"
                );
                setOtherPetText(otherTypes.join(", "));
            }
        }

        // 펫 수 설정
        if (data.petCount) {
            const countMap = {
                ONE: "1마리",
                TWO: "2마리",
                THREE_PLUS: "3마리 이상",
            };
            const countStr = countMap[data.petCount];

            if (countStr) {
                const newPetCount = { ...petCount };
                Object.keys(newPetCount).forEach((key) => {
                    newPetCount[key] = key === countStr;
                });
                setPetCount(newPetCount);
            }
        }

        // 경험 설정
        setSitterExperience({
            "네, 해본적 있습니다": Boolean(data.sitterExp),
            "아니요, 해본적 없습니다": !data.sitterExp,
        });

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

        console.log("폼 데이터 초기화 완료");
    };
    useEffect(() => {
        // "키우고 있지 않습니다"로 변경된 경우
        if (hasPet["키우고 있지 않습니다"]) {
            // 반려동물 관련 상태 초기화
            setPetTypes({
                강아지: false,
                고양이: false,
                앵무새: false,
                햄스터: false,
                기타: false,
            });

            setPetCount({
                "1마리": false,
                "2마리": false,
                "3마리 이상": false,
            });

            setOtherPetText("");

            // petSitterData 업데이트 - 중요: 반려동물 관련 정보 초기화
            setPetSitterData((prev) => ({
                ...prev,
                grown: false,
                petTypeId: null,
                petTypesFormatted: "",
                petTypes: [],
                petCount: null,
            }));
        } else {
            // "네, 키우고 있습니다"로 변경된 경우
            setPetSitterData((prev) => ({
                ...prev,
                grown: true,
            }));
        }
    }, [hasPet]);

    // 단계 이동에 따른 상태 업데이트
    useEffect(() => {
        // 각 단계에서 선택한 정보를 petSitterData에 반영
        const updatePetSitterData = () => {
            switch (step) {
                case 2: // 연령대 선택 후
                    setPetSitterData((prev) => ({
                        ...prev,
                        age: Object.keys(selectedAges).find((key) => selectedAges[key]) || "",
                    }));
                    break;
                case 3: // 반려동물 여부 선택 후
                    setPetSitterData((prev) => ({
                        ...prev,
                        grown: hasPet["네, 키우고 있습니다"] || false,
                    }));
                    break;
                case 4: // 반려동물 타입 선택 후
                    const selectedPetTypes = getSelectedPetTypes(petTypes);

                    let formattedPetTypes = selectedPetTypes;
                    if (petTypes["기타"] && otherPetText.trim()) {
                        formattedPetTypes = selectedPetTypes
                          .filter(type => type !== "기타")
                          .concat([otherPetText.trim()]);
                    }

                    setPetSitterData((prev) => ({
                        ...prev,
                        petTypesFormatted: formattedPetTypes.join(", "),
                        petTypes: formattedPetTypes,
                        petTypeId: formattedPetTypes.length > 0 ? getPetTypeId(formattedPetTypes[0]) : null,
                    }));
                    break;
                case 5: // 반려동물 수 선택 후
                    setPetSitterData((prev) => ({
                        ...prev,
                        petCount: getPetCountEnum(Object.keys(petCount).find((key) => petCount[key]) || "1마리"),
                    }));
                    break;
                case 6: // 펫시터 경험 선택 후
                    setPetSitterData((prev) => ({
                        ...prev,
                        sitterExp: sitterExperience["네, 해본적 있습니다"] || false,
                    }));
                    break;
                case 7: // 주거 형태 선택 후
                    setPetSitterData((prev) => ({
                        ...prev,
                        houseType: Object.keys(houseType).find((key) => houseType[key]) || "",
                    }));
                    break;
                case 8: // 코멘트 입력 후
                    setPetSitterData((prev) => ({
                        ...prev,
                        comment: commentText || "제 가족이라는 마음으로 돌봐드려요 ♥",
                    }));
                    break;
                default:
                    break;
            }
        };

        // 단계가 변경될 때마다 상태 업데이트
        if (step > 1 && step <= 8) {
            updatePetSitterData();
        }
    }, [step, selectedAges, hasPet, petTypes, petCount, sitterExperience, houseType, commentText, otherPetText]);

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleBack = () => {
        if (step > 1) {
            if (step === 6 && hasPet["키우고 있지 않습니다"]) {
                setStep(3);
            } else {
                setStep(step - 1);
            }
        } else {
            navigate(-1);
        }
    };

    // 이미지 유효성 검사 함수
    const validateImage = () => {
        return imagePreview !== null || existingImagePath !== null;
    };

    const handleNext = () => {
        let isValid = true;
        let errorMessage = "";

        switch (step) {
            case 1: // 프로필 이미지
                if (!validateImage()) {
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
            case 8: // 한마디 작성 및 저장 단계
                if (validateForm()) {
                    handleSubmit();
                    return;
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
            setStep(6);
        } else if (step === 8) {
            validateForm() && handleSubmit();
        } else {
            setStep((prev) => Math.min(prev + 1, 9));
        }
    };

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
        setIsImageChanged(true);

        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onload = (event) => {
            setImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    // 폼 데이터 검증
    const validateForm = () => {
        // 이미지 검증 수정 - 기존 이미지 고려
        if (!validateImage()) {
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

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            // 타임아웃 설정 - 30초 후 자동으로 로딩 상태 해제
            const timeoutId = setTimeout(() => {
                setIsSubmitting(false);
                setSnackbar({
                    open: true,
                    message: "요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.",
                    severity: "error",
                });
            }, 30000);

            // 서버에 이미 등록된 펫시터인지 확인
            let isUpdate = false;
            try {
                const statusResponse = await instance.get("/petsitter/status");

                if (statusResponse.status === 200) {
                    isUpdate = true;
                    // 이미지 경로가 없는 경우 저장
                    if (!existingImagePath && statusResponse.data?.data?.imagePath) {
                        setExistingImagePath(statusResponse.data.data.imagePath);
                    }
                }
            } catch (err) {
                // 404 에러는 정상적인 경우 (신규 등록)
                if (err.response?.status !== 404) {
                    console.error("펫시터 상태 확인 중 오류:", err);
                }
            }

            // 펫시터 데이터 준비
            const submitData = {
                age: petSitterData.age || Object.keys(selectedAges).find((key) => selectedAges[key]) || "20대",
                houseType: petSitterData.houseType || Object.keys(houseType).find((key) => houseType[key]) || "아파트",
                comment: petSitterData.comment || commentText || "제 가족이라는 마음으로 돌봐드려요 ♥",
                grown: hasPet["네, 키우고 있습니다"] ? true : false,

                // 반려동물 관련 필드: "키우고 있지 않습니다"일 경우 null로 설정
                petCount: hasPet["네, 키우고 있습니다"]
                    ? petSitterData.petCount ||
                      getPetCountEnum(Object.keys(petCount).find((key) => petCount[key]) || "1마리")
                    : null,

                sitterExp:
                    petSitterData.sitterExp !== undefined
                        ? petSitterData.sitterExp
                        : sitterExperience["네, 해본적 있습니다"] || false,

                petTypeId: hasPet["네, 키우고 있습니다"]
                    ? petSitterData.petTypeId ||
                      (getSelectedPetTypes(petTypes).length > 0 ? getPetTypeId(getSelectedPetTypes(petTypes)[0]) : null)
                    : null,

                petTypesFormatted: hasPet["네, 키우고 있습니다"]
                    ? petSitterData.petTypesFormatted || getSelectedPetTypes(petTypes).join(", ")
                    : "",
            };
            // 추가 데이터 - petTypeIds
            let selectedPetTypes = [];
            if (hasPet["네, 키우고 있습니다"]) {
                selectedPetTypes = getSelectedPetTypes(petTypes);
                const selectedPetTypeIds = selectedPetTypes
                    .map((type) => getPetTypeId(type))
                    .filter((id) => id !== null);
                submitData.petTypeIds = selectedPetTypeIds;
            } else {
                submitData.petTypeIds = [];
            }
            // 기존 이미지 정보 추가
            if (existingImagePath && !isImageChanged) {
                submitData.existingImagePath = existingImagePath;
            }

            const formData = new FormData();
            formData.append("data", new Blob([JSON.stringify(submitData)], { type: "application/json" }));

            // 폼 데이터 내용 로깅
            try {
                const dataJson = JSON.parse(
                    await new Response(new Blob([formData.get("data")], { type: "application/json" })).text()
                );

                console.log("서버로 전송되는 JSON 데이터:", dataJson);
            } catch (e) {
                console.error("폼 데이터 로깅 오류:", e);
            }

            // 이미지 처리 개선
            let imageDataChanged = isImageChanged;
            let displayImageUrl = existingImagePath;

            // 새 이미지 파일이 있는 경우
            if (imageFile) {
                formData.append("image", imageFile);
                imageDataChanged = true;
                console.log("새 이미지 파일 추가:", imageFile.name);

                // 이미지 파일 로깅
                console.log("서버로 전송되는 이미지:", {
                    name: imageFile.name,
                    type: imageFile.type,
                    size: imageFile.size + "bytes",
                });
            }
            // 이미지 프리뷰가 있고 URL이 아닌 데이터 URL인 경우(새로 선택했지만 File 객체가 없는 경우)
            else if (imagePreview && !imagePreview.startsWith("http") && imagePreview.startsWith("data:")) {
                try {
                    const response = await fetch(imagePreview);
                    const imageBlob = await response.blob();
                    formData.append("image", imageBlob, "profile.jpg");
                    imageDataChanged = true;
                    console.log("Base64 이미지를 Blob으로 변환하여 추가");

                    // 이미지 Blob 로깅
                    console.log("서버로 전송되는 Blob 이미지:", {
                        type: imageBlob.type,
                        size: imageBlob.size + "bytes",
                    });
                } catch (err) {
                    console.error("이미지 변환 오류:", err);
                }
            } else {
                console.log("이미지 변경 없음, 기존 이미지 유지:", existingImagePath);
            }

            console.log("이미지 변경 여부:", imageDataChanged);
            console.log("기존 이미지 경로:", existingImagePath);
            console.log("이미지 미리보기:", imagePreview);

            // 세부 요청 헤더 설정
            const headers = {
                "Content-Type": "multipart/form-data",
                "X-Request-Source": "web-client", // 요청 출처 표시
                "X-Client-Version": "1.0.0", // 클라이언트 버전 표시
            };

            // 요청 로깅
            console.log("API 요청 URL:", "/petsitter/apply");
            console.log("API 요청 헤더:", headers);

            // API 호출 (instance 사용)
            try {
                const res = await instance.post("/petsitter/apply", formData, {
                    headers: headers,
                    timeout: 30000, // 30초 타임아웃
                });

                // 타임아웃 해제
                clearTimeout(timeoutId);

                // 응답 로깅
                console.log("API 응답 상태:", res.status);
                console.log("API 응답 데이터:", res.data);
                console.log("API 응답 헤더:", res.headers);

                if (res.status === 200 || res.status === 201) {
                    // 서버 응답에서 이미지 경로가 없으면, 기존 이미지 경로 또는 미리보기 이미지 사용
                    let finalImagePath = res.data?.data?.imagePath;

                    if (!finalImagePath) {
                        // 이미지가 변경되었으면 미리보기 이미지를 사용, 아니면 기존 이미지 경로 사용
                        finalImagePath = imageDataChanged ? imagePreview : existingImagePath;
                        console.log("서버에서 이미지 경로가 제공되지 않아 클라이언트 측 이미지 사용:", finalImagePath);
                    }

                    // 로컬 스토리지에 저장할 정보
                    const sitterInfoComplete = {
                        registered: false,
                        isPending: true,
                        status: "NONE",
                        age: submitData.age,
                        petType: selectedPetTypes.length > 0 ? selectedPetTypes[0] : "",
                        petTypes: selectedPetTypes,
                        petTypesFormatted: submitData.petTypesFormatted,
                        petCount: hasPet["네, 키우고 있습니다"]
                            ? Object.keys(petCount).find((key) => petCount[key]) || "1마리"
                            : "",
                        houseType: submitData.houseType,
                        comment: submitData.comment,
                        image: finalImagePath,
                        experience: submitData.sitterExp,
                        registeredAt: new Date().toISOString(),
                        grown: submitData.grown,
                    };

                    console.log("로컬 스토리지에 저장할 완전한 정보:", sitterInfoComplete);

                    localStorage.setItem("petSitterRegistrationCompleted", "true");
                    localStorage.setItem("petSitterInfo", JSON.stringify(sitterInfoComplete));

                    // 추가: 세션 스토리지에도 저장 (브라우저 닫을 때까지만 유지)
                    sessionStorage.setItem(
                        "latestPetSitterUpdate",
                        JSON.stringify({
                            timestamp: new Date().toISOString(),
                            data: sitterInfoComplete,
                        })
                    );

                    // 이벤트 발생
                    window.dispatchEvent(
                        new CustomEvent("petSitterRegistered", {
                            detail: {
                                registered: false,
                                isPending: true,
                                status: "NONE",
                                info: sitterInfoComplete,
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

                    setStep(9);
                } else {
                    throw new Error("API 응답이 정상적이지 않습니다.");
                }
            } catch (apiError) {
                // 더 자세한 에러 로깅
                console.error("API 호출 중 오류 발생:", apiError);

                if (apiError.response) {
                    console.error("서버 응답 상태:", apiError.response.status);
                    console.error("서버 응답 데이터:", apiError.response.data);
                    console.error("서버 응답 헤더:", apiError.response.headers);
                } else if (apiError.request) {
                    console.error("요청은 전송되었으나 응답이 없음:", apiError.request);
                } else {
                    console.error("요청 설정 중 오류:", apiError.message);
                }

                let errorMessage = "펫시터 신청 중 오류가 발생했습니다.";

                if (apiError.response) {
                    if (apiError.response.status === 400) {
                        errorMessage = apiError.response.data?.message || "입력 정보를 확인해주세요.";
                    } else if (apiError.response.status === 401) {
                        errorMessage = "로그인이 필요합니다.";
                    } else if (apiError.response.status >= 500) {
                        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
                    }
                }

                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: "error",
                });

                throw apiError;
            }
        } catch (error) {
            console.error("펫시터 신청 오류:", error);
            // 특별한 오류 처리 로직이 필요하면 여기에 추가
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComplete = () => {
        navigate("/mypage");
    };

    if (!isInitialized) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress sx={{ color: "#E9A260" }} />
            </Box>
        );
    }

    const renderStep = () => {
        const stepContainerStyle = {
            height: "100%",
            overflowY: "hidden",
        };

        let stepComponent;

        switch (step) {
            case 1:
                stepComponent = (
                    <ProfileUploadStep
                        imagePreview={imagePreview || existingImagePath}
                        onImageUpload={handleImageUpload}
                    />
                );
                break;
            case 2:
                stepComponent = <AgeSelectionStep selectedAges={selectedAges} onChange={setSelectedAges} />;
                break;
            case 3:
                stepComponent = <PetOwnershipStep hasPet={hasPet} onChange={setHasPet} />;
                break;
            case 4:
                stepComponent = (
                    <PetTypeStep
                        petTypes={petTypes}
                        onChange={setPetTypes}
                        otherPetText={otherPetText}
                        onOtherPetTextChange={setOtherPetText}
                    />
                );
                break;
            case 5:
                stepComponent = <PetCountStep petCount={petCount} onChange={setPetCount} />;
                break;
            case 6:
                stepComponent = <ExperienceStep sitterExperience={sitterExperience} onChange={setSitterExperience} />;
                break;
            case 7:
                stepComponent = <HousingTypeStep houseType={houseType} onChange={setHouseType} />;
                break;
            case 8:
                stepComponent = <CommentStep commentText={commentText} onChange={setCommentText} />;
                break;
            case 9:
                stepComponent = (
                    <CompletionStep
                        imagePreview={imagePreview || existingImagePath}
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
                break;
            default:
                stepComponent = null;
        }

        return <Box sx={stepContainerStyle}>{stepComponent}</Box>;
    };

    return (
        <Box
            sx={{
                p: 2,
                height: "100vh",
                maxHeight: "100vh",
                bgcolor: "white",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* 상단 헤더 */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    position: "relative",
                    zIndex: 10,
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

            {/* 스크롤 방지 */}
            <style>
                {`
                body {
                    overflow: hidden;
                }
                `}
            </style>

            {/* 단계별 내용을 포함하는 전체 컨테이너 */}
            <Box
                sx={{
                    position: "relative",
                    height: "calc(100vh - 180px)",
                    overflow: "hidden",
                }}
            >
                {renderStep()}
            </Box>

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
                        zIndex: 5,
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
            <GlobalSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                handleSnackbarClose={handleSnackbarClose}
            />
        </Box>
    );
};

export default PetSitterRegister;
