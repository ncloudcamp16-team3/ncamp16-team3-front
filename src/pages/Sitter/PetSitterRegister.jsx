import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import penIcon from "/src/assets/images/User/pen_2.svg";
import axios from "axios";

const PetSitterRegister = () => {
    const [step, setStep] = useState(1); // 현재 단계
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [otherPetText, setOtherPetText] = useState("");
    const [commentText, setCommentText] = useState("");

    // 각 단계별 선택 상태 관리
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

    // 진행률 매핑 - 각 단계마다 12.5% 증가
    const progressMapping = {
        1: 0, // 프로필 사진 업로드
        2: 12.5, // 연령대
        3: 25, // 반려동물 여부
        4: 37.5, // 반려동물 종류
        5: 50, // 반려동물 마릿수
        6: 62.5, // 펫시터 경험
        7: 75, // 주거형태
        8: 87.5, // 한마디 작성
        9: 100, // 완료 페이지
    };

    useEffect(() => {
        // 스크롤 방지
        document.body.style.overflow = "hidden";

        // 기존 펫시터 정보 불러오기
        const registrationCompleted = localStorage.getItem("petSitterRegistrationCompleted");
        if (registrationCompleted === "true") {
            try {
                const sitterInfo = JSON.parse(localStorage.getItem("petSitterInfo") || "{}");

                // 프로필 이미지 설정
                if (sitterInfo.image) {
                    setImagePreview(sitterInfo.image);
                }

                // 연령대 설정
                if (sitterInfo.age) {
                    const newAges = { ...selectedAges };
                    Object.keys(newAges).forEach((key) => {
                        newAges[key] = key === sitterInfo.age;
                    });
                    setSelectedAges(newAges);
                }

                // 반려동물 여부 설정
                // 기존 정보에 반려동물 여부 정보가 있을 경우
                if (sitterInfo.hasPetInfo) {
                    setHasPet({
                        "네, 키우고 있습니다": sitterInfo.hasPetInfo === "네, 키우고 있습니다",
                        "키우고 있지 않습니다": sitterInfo.hasPetInfo === "키우고 있지 않습니다",
                    });
                }

                // 반려동물 종류 설정
                if (sitterInfo.petType) {
                    const newPetTypes = { ...petTypes };
                    Object.keys(newPetTypes).forEach((key) => {
                        newPetTypes[key] = key === sitterInfo.petType;
                    });
                    setPetTypes(newPetTypes);

                    // 기타 반려동물 텍스트 설정
                    if (sitterInfo.petType === "기타" && sitterInfo.otherPetText) {
                        setOtherPetText(sitterInfo.otherPetText);
                    }
                }

                // 마릿수 설정
                if (sitterInfo.petCount) {
                    const newPetCount = { ...petCount };
                    Object.keys(newPetCount).forEach((key) => {
                        newPetCount[key] = key === sitterInfo.petCount;
                    });
                    setPetCount(newPetCount);
                }

                // 펫시터 경험 설정
                if (sitterInfo.experience !== undefined) {
                    setSitterExperience({
                        "네, 해본적 있습니다":
                            sitterInfo.experience === true || sitterInfo.experience === "네, 해본적 있습니다",
                        "아니요, 해본적 없습니다":
                            sitterInfo.experience === false || sitterInfo.experience === "아니요, 해본적 없습니다",
                    });
                }

                // 주거형태 설정
                if (sitterInfo.houseType) {
                    const newHouseType = { ...houseType };
                    Object.keys(newHouseType).forEach((key) => {
                        newHouseType[key] = key === sitterInfo.houseType;
                    });
                    setHouseType(newHouseType);
                }

                // 한마디 설정
                if (sitterInfo.comment) {
                    setCommentText(sitterInfo.comment);
                }
            } catch (error) {
                console.error("펫시터 정보 로드 오류:", error);
            }
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // 단계에 따른 진행률 업데이트
    useEffect(() => {
        setProgress(progressMapping[step] || 0);
    }, [step]);

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("이미지 크기는 5MB 이하여야 합니다.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSelectImage = () => {
        fileInputRef.current.click();
    };

    // 선택 상태 핸들러 함수 (재사용 가능)
    const handleOptionChange = (option, stateSetter, stateObj) => {
        const newState = Object.keys(stateObj).reduce((acc, key) => {
            acc[key] = key === option;
            return acc;
        }, {});
        stateSetter(newState);
    };
    const handleComplete = async () => {
        try {
            // 펫시터 정보 준비
            const formData = new FormData();
            const petSitterData = {
                age: Object.keys(selectedAges).find((key) => selectedAges[key]) || "20대",
                houseType: Object.keys(houseType).find((key) => houseType[key]) || "아파트",
                comment: commentText || "제 가족이라는 마음으로 돌봐드려요 ♥",
                grown: hasPet["네, 키우고 있습니다"] ? true : false,
                petCount:
                    Object.keys(petCount).find((key) => petCount[key]) === "1마리"
                        ? "ONE"
                        : Object.keys(petCount).find((key) => petCount[key]) === "2마리"
                          ? "TWO"
                          : "THREE_PLUS",
                sitterExp: sitterExperience["네, 해본적 있습니다"] ? true : false,
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

            // JSON 데이터를 FormData에 추가
            formData.append("data", new Blob([JSON.stringify(petSitterData)], { type: "application/json" }));

            // 이미지가 있다면 추가
            if (imagePreview) {
                // 이미지가 base64 형식이라면 Blob으로 변환
                if (imagePreview.startsWith("data:image")) {
                    const response = await fetch(imagePreview);
                    const blob = await response.blob();
                    formData.append("image", blob, "profile.jpg");
                }
            }

            // API 요청 보내기
            const response = await axios.post("/api/petsitter/apply", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"

                },
                withCredentials: true,
            });

            // 펫시터 등록 성공 시
            if (response.status === 200 || response.status === 201) {
                // 로컬 스토리지에 정보 저장 (UI에서 사용)
                const sitterInfo = {
                    registered: false, // API 응답에서 상태를 확인
                    isPending: true, // PENDING 상태로 설정
                    status: "PENDING", // 관리자 승인 대기 상태
                    age: Object.keys(selectedAges).find((key) => selectedAges[key]) || "20대",
                    petType: Object.keys(petTypes).find((key) => petTypes[key]) || "강아지",
                    petCount: Object.keys(petCount).find((key) => petCount[key]) || "1마리",
                    houseType: Object.keys(houseType).find((key) => houseType[key]) || "아파트",
                    comment: commentText || "제 가족이라는 마음으로 돌봐드려요 ♥",
                    image: imagePreview,
                    experience: sitterExperience["네, 해본적 있습니다"], // 경험 여부도 함께 저장
                    registeredAt: new Date().toISOString(), // 등록 시간 기록
                };

                localStorage.setItem("petSitterRegistrationCompleted", "true");
                localStorage.setItem("petSitterInfo", JSON.stringify(sitterInfo));

                // 이벤트 발생
                const sitterRegistrationEvent = new CustomEvent("petSitterRegistered", {
                    detail: { registered: false, isPending: true, status: "PENDING", info: sitterInfo },
                });
                window.dispatchEvent(sitterRegistrationEvent);

                // 성공 메시지 표시
                alert("펫시터 신청이 완료되었습니다. 관리자 승인 후 활동이 가능합니다.");

                // 마이페이지로 이동
                navigate("/mypage");
            } else {
                alert("펫시터 신청 처리 중 문제가 발생했습니다.");
            }
        } catch (error) {
            console.error("펫시터 신청 오류:", error);
            alert(error.response?.data?.message || "펫시터 신청 중 오류가 발생했습니다.");
        }
    };
    // 연령대 선택 핸들러 (체크박스)
    const handleAgeChange = (age) => {
        setSelectedAges({
            ...selectedAges,
            [age]: !selectedAges[age],
        });
    };

    // 반려동물 종류 선택 핸들러 (체크박스)
    const handlePetTypeChange = (type) => {
        setPetTypes({
            ...petTypes,
            [type]: !petTypes[type],
        });
    };

    // 주거형태 선택 핸들러 (체크박스)
    const handleHouseTypeChange = (type) => {
        setHouseType({
            ...houseType,
            [type]: !houseType[type],
        });
    };

    const validateCurrentStep = () => {
        switch (step) {
            case 1: // 프로필 사진
                if (!imagePreview) {
                    alert("펫시터 사진을 등록해주세요.");
                    return false;
                }
                return true;
            case 2: // 연령대
                if (!Object.values(selectedAges).some((v) => v)) {
                    alert("연령대를 하나 이상 선택해주세요.");
                    return false;
                }
                return true;
            case 3: // 반려동물 여부
                if (!Object.values(hasPet).some((v) => v)) {
                    alert("반려동물 키우시는지 선택해주세요.");
                    return false;
                }
                return true;
            case 4: // 반려동물 종류
                if (!Object.values(petTypes).some((v) => v)) {
                    alert("반려동물 종류를 하나 이상 선택해주세요.");
                    return false;
                }
                if (petTypes["기타"] && !otherPetText.trim()) {
                    alert("기타 반려동물을 입력해주세요.");
                    return false;
                }
                return true;
            case 5: // 마릿수
                if (!Object.values(petCount).some((v) => v)) {
                    alert("반려동물 마릿수를 선택해주세요.");
                    return false;
                }
                return true;
            case 6: // 펫시터 경험
                if (!Object.values(sitterExperience).some((v) => v)) {
                    alert("펫시터 경험 여부를 선택해주세요.");
                    return false;
                }
                return true;
            case 7: // 주거형태
                if (!Object.values(houseType).some((v) => v)) {
                    alert("주거형태를 선택해주세요.");
                    return false;
                }
                return true;
            case 8: // 한마디
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (step === 3 && hasPet["키우고 있지 않습니다"]) {
                // 반려동물을 키우지 않는 경우, 4(종류)와 5(마릿수) 단계를 건너뛰고 6(경험)으로 이동
                setStep(6);
            } else if (step < 9) {
                setStep(step + 1);
            }
        }
    };

    // 체크박스 또는 라디오 옵션 렌더링 함수 (중복코드 줄이기 위한 재사용 함수)
    const renderOptions = (options, stateObj, onChange, multiSelect = false) => {
        return (
            <Box
                sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    overflow: "hidden",
                    width: "100%",
                }}
            >
                {Object.keys(options).map((option, index) => (
                    <FormControlLabel
                        key={option}
                        control={
                            <Checkbox
                                checked={stateObj[option]}
                                onChange={() => onChange(option)}
                                sx={{
                                    color: "#E9A260",
                                    "&.Mui-checked": {
                                        color: "#E9A260",
                                    },
                                    padding: "12px",
                                }}
                            />
                        }
                        label={option}
                        sx={{
                            borderBottom: index < Object.keys(options).length - 1 ? "1px solid #e0e0e0" : "none",
                            margin: 0, // 모든 마진 제거
                            padding: 0, // 패딩 제거
                            width: "100%",
                            backgroundColor: stateObj[option] ? "#FDF1E5" : "transparent",

                            // 공백 해결을 위한 스타일 조정
                            "& .MuiFormControlLabel-label": {
                                padding: "12px 12px 12px 0",
                                width: "100%",
                            },
                            "& .MuiCheckbox-root": {
                                backgroundColor: stateObj[option] ? "#FDF1E5" : "transparent",
                            },

                            // 전체 영역 스타일
                            display: "flex",
                            alignItems: "center",
                        }}
                    />
                ))}
            </Box>
        );
    };

    // 단계별 렌더링
    const renderStepContent = () => {
        switch (step) {
            case 1: // 프로필 사진 업로드
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
                            onChange={handleImageUpload}
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
                                    alt="프로필 미리보기"
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

            case 2: // 연령대
                return (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            연령대가 어떻게 되시나요?
                        </Typography>

                        <FormGroup sx={{ width: "100%" }}>
                            {renderOptions(selectedAges, selectedAges, handleAgeChange, true)}
                        </FormGroup>
                    </Box>
                );

            case 3: // 반려동물 여부
                return (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            현재 반려동물을 키우시고 계신가요?
                        </Typography>

                        <FormGroup sx={{ width: "100%" }}>
                            {renderOptions(
                                hasPet,
                                hasPet,
                                (option) => handleOptionChange(option, setHasPet, hasPet),
                                false // 라디오 버튼처럼 동작
                            )}
                        </FormGroup>
                    </Box>
                );

            case 4: // 반려동물 종류
                return (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            어떤 반려동물을 키우고 계신가요?
                        </Typography>

                        <FormGroup sx={{ width: "100%" }}>
                            {renderOptions(petTypes, petTypes, handlePetTypeChange, true)}
                        </FormGroup>

                        {petTypes["기타"] && (
                            <TextField
                                fullWidth
                                placeholder="반려동물을 입력해주세요"
                                value={otherPetText}
                                onChange={(e) => setOtherPetText(e.target.value)}
                                sx={{
                                    mt: 2,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                    },
                                }}
                            />
                        )}
                    </Box>
                );

            case 5: // 마릿수
                return (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            몇마리를 키우고 계신가요?
                        </Typography>

                        <FormGroup sx={{ width: "100%" }}>
                            {renderOptions(
                                petCount,
                                petCount,
                                (option) => handleOptionChange(option, setPetCount, petCount),
                                false // 라디오 버튼처럼 동작
                            )}
                        </FormGroup>
                    </Box>
                );

            case 6: // 펫시터 경험
                return (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            펫시터를 해보신 경험이 있나요?
                        </Typography>

                        <FormGroup sx={{ width: "100%" }}>
                            {renderOptions(
                                sitterExperience,
                                sitterExperience,
                                (option) => handleOptionChange(option, setSitterExperience, sitterExperience),
                                false // 라디오 버튼처럼 동작
                            )}
                        </FormGroup>
                    </Box>
                );

            case 7: // 주거형태
                return (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            주거형태가 어떻게 되시나요?
                        </Typography>

                        <FormGroup sx={{ width: "100%" }}>
                            {renderOptions(houseType, houseType, handleHouseTypeChange, true)}
                        </FormGroup>
                    </Box>
                );

            case 8: // 한마디 작성
                return (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            pt: 2,
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            펫시터를 맡기실 보호자들에게
                            <br />
                            한마디 해주세요!
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            placeholder="보호자들에게 한마디"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                },
                            }}
                        />
                    </Box>
                );

            case 9: // 등록 완료 페이지
                return (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            pt: 6,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            등록이 완료되었어요!
                        </Typography>

                        {/* 프로필 이미지 */}
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                overflow: "hidden",
                                mb: 3,
                            }}
                        >
                            <Box
                                component="img"
                                src={imagePreview || "/mock/Global/images/haribo.jpg"}
                                alt="프로필"
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>

                        {/* 등록 정보 테이블 */}
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                mb: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <Typography fontWeight="bold">연령대</Typography>
                                <Typography>
                                    {Object.keys(selectedAges).find((key) => selectedAges[key]) || "20대"}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <Typography fontWeight="bold">반려동물</Typography>
                                <Typography>
                                    {hasPet["네, 키우고있습니다"] &&
                                        `${Object.keys(petTypes).find((key) => petTypes[key]) || "강아지"} ${
                                            Object.keys(petCount).find((key) => petCount[key]) || "1마리"
                                        }`}
                                    {hasPet["키우고있지 않습니다"] && "없음"}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <Typography fontWeight="bold">펫시터 경험</Typography>
                                <Typography>{sitterExperience["내 해본적 있습니다"] ? "있음" : "없음"}</Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <Typography fontWeight="bold">주거 형태</Typography>
                                <Typography>
                                    {Object.keys(houseType).find((key) => houseType[key]) || "아파트"}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <Typography fontWeight="bold">한마디</Typography>
                                <Typography noWrap sx={{ maxWidth: "70%", textOverflow: "ellipsis" }}>
                                    {commentText || "제 아이라는 마음으로 돌봐드려요 ☺️"}
                                </Typography>
                            </Box>
                        </Box>

                        {/* 홈으로 가기 버튼 */}
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleComplete}
                            sx={{
                                bgcolor: "#E9A260",
                                color: "white",
                                "&:hover": {
                                    bgcolor: "#d0905a",
                                },
                                borderRadius: "4px",
                                py: 1.5,
                                mb: 2,
                            }}
                        >
                            마이페이지로 돌아가기
                        </Button>
                    </Box>
                );

            default:
                return null;
        }
    };

    // 단계별 버튼 렌더링
    const renderButtons = () => {
        // 마지막 완료 페이지에서는 버튼을 표시하지 않음
        if (step === 9) return null;

        if (step === 1) {
            return (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "140px",
                        right: "20px",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                            bgcolor: "#E9A260",
                            color: "white",
                            "&:hover": {
                                bgcolor: "#d0905a",
                            },
                            borderRadius: "4px",
                            px: 3,
                            py: 1,
                        }}
                    >
                        다음
                    </Button>
                </Box>
            );
        } else {
            return (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "140px",
                        right: "20px",
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleBack}
                        sx={{
                            bgcolor: "#FDF1E5",
                            color: "#E9A260",
                            "&:hover": {
                                bgcolor: "#F2DFCE",
                            },
                            borderRadius: "4px",
                            px: 3,
                            py: 1,
                        }}
                    >
                        이전
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                            bgcolor: "#E9A260",
                            color: "white",
                            "&:hover": {
                                bgcolor: "#d0905a",
                            },
                            borderRadius: "4px",
                            px: 3,
                            py: 1,
                        }}
                    >
                        {step === 8 ? "완료" : "다음"}
                    </Button>
                </Box>
            );
        }
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <ArrowBackIosNewIcon sx={{ mr: 1, cursor: "pointer", fontSize: "20px" }} onClick={handleBack} />
                <Typography variant="h5" component="h1" fontWeight="700" color="#363636">
                    {localStorage.getItem("petSitterRegistrationCompleted") === "true"
                        ? "펫시터 정보 수정"
                        : "펫시터 등록"}
                </Typography>
            </Box>

            {/* 진행 표시 바 */}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "#e0e0e0",
                        height: "4px",
                        borderRadius: "2px",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            width: `${progress}%`,
                            bgcolor: "#E9A260",
                            height: "100%",
                            borderRadius: "2px",
                        }}
                    />
                </Box>
                <Typography
                    sx={{
                        ml: 1,
                        color: "#E9A260",
                        fontWeight: "bold",
                    }}
                >
                    {Math.round(progress)}%
                </Typography>
            </Box>

            {/* 단계별 내용 */}
            {renderStepContent()}

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
            {renderButtons()}
        </Box>
    );
};

export default PetSitterRegister;
