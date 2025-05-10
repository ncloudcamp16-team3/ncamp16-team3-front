import React, { useState } from "react";
import { Box, Typography, Button, Checkbox, FormControlLabel } from "@mui/material";
import GlobalSnackbar from "../Global/GlobalSnackbar";

const PetSitterSurvey = ({
    step,
    history,
    selectedAges,
    setSelectedAges,
    hasPet,
    setHasPet,
    hasSitterExperience,
    setHasSitterExperience,
    handleNext,
    handleBack,
}) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // 체크박스 선택 핸들러
    const handleCheckboxChange = (option, setter, currentState) => {
        const newState = {};
        Object.keys(currentState).forEach((key) => {
            newState[key] = false;
        });
        newState[option] = true;
        setter(newState);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // 체크박스 옵션 UI 렌더링
    const renderCheckboxOptions = (options, currentState, setter, disabled = false) => {
        return Object.keys(options).map((option) => (
            <FormControlLabel
                key={option}
                disabled={disabled}
                control={
                    <Checkbox
                        checked={currentState[option]}
                        onChange={() => handleCheckboxChange(option, setter, currentState)}
                        sx={{
                            color: "#E9A260",
                            "&.Mui-checked": {
                                color: "#E9A260",
                            },
                            "& .MuiSvgIcon-root": {
                                fontSize: 24,
                            },
                        }}
                    />
                }
                label={option}
                sx={{
                    width: "100%",
                    margin: 0,
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    bgcolor: "white",
                    borderRadius: "4px",
                    "& .MuiFormControlLabel-label": {
                        fontSize: "16px",
                    },
                }}
            />
        ));
    };

    // 히스토리 항목 렌더링
    const renderHistoryItem = (item, index) => {
        return (
            <Box key={index} mb={3}>
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            backgroundColor: "#FFF7EF",
                            display: "inline-block",
                            padding: "8px 16px",
                            borderRadius: "12px",
                            fontSize: "14px",
                        }}
                    >
                        {item.question}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography
                        variant="body1"
                        sx={{
                            backgroundColor: "#F2DFCE",
                            display: "inline-block",
                            padding: "8px 16px",
                            borderRadius: "12px",
                            fontSize: "14px",
                        }}
                    >
                        {item.answer}
                    </Typography>
                </Box>
            </Box>
        );
    };

    // 다음 버튼 핸들러 - 유효성 검사 추가
    const handleNextWithValidation = () => {
        let isValid = true;
        let errorMessage = "";

        switch (step) {
            case 1: // 연령대
                if (!Object.values(selectedAges).some((v) => v)) {
                    isValid = false;
                    errorMessage = "연령대를 하나 이상 선택해주세요.";
                }
                break;
            case 2: // 반려동물 여부
                if (!Object.values(hasPet).some((v) => v)) {
                    isValid = false;
                    errorMessage = "선택지를 하나 선택해주세요.";
                }
                break;
            case 3: // 펫시터 경험 여부
                if (!Object.values(hasSitterExperience).some((v) => v)) {
                    isValid = false;
                    errorMessage = "선택지를 하나 선택해주세요.";
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

        // 유효성 검사 통과 시 기존 handleNext 호출
        handleNext();
    };

    // 현재 질문 렌더링
    const renderCurrentQuestion = () => {
        switch (step) {
            case 1:
                return (
                    <Box
                        sx={{
                            mb: 2,
                            backgroundColor: "#FFF7EF",
                            padding: "16px",
                            borderRadius: "12px",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Typography variant="body1" sx={{ fontSize: "14px" }}>
                            원하는 펫시터님의 연령대를 골라주세요
                        </Typography>
                    </Box>
                );
            case 2:
                return (
                    <Box
                        sx={{
                            mb: 2,
                            backgroundColor: "#FFF7EF",
                            padding: "16px",
                            borderRadius: "12px",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Typography variant="body1" sx={{ fontSize: "14px" }}>
                            반려동물을 키우고 있는 분을 찾을까요?
                        </Typography>
                    </Box>
                );
            case 3:
                return (
                    <Box
                        sx={{
                            mb: 2,
                            backgroundColor: "#FFF7EF",
                            padding: "16px",
                            borderRadius: "12px",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Typography variant="body1" sx={{ fontSize: "14px" }}>
                            임시보호 경험이 있으신 분을 찾으시나요?
                        </Typography>
                    </Box>
                );
            case 4:
                return (
                    <Box
                        sx={{
                            mb: 2,
                            backgroundColor: "#FFF7EF",
                            padding: "16px",
                            borderRadius: "12px",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Typography variant="body1" sx={{ fontSize: "14px" }}>
                            요청이 완료되었습니다!
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    const renderOptions = () => {
        switch (step) {
            case 1:
                return (
                    <Box sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                border: "1px solid #f0f0f0",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "white",
                                mb: 2,
                            }}
                        >
                            {renderCheckboxOptions(selectedAges, selectedAges, setSelectedAges)}
                        </Box>

                        {/* 버튼 그룹 */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleNextWithValidation}
                                sx={{
                                    bgcolor: "#E9A260",
                                    color: "white",
                                    "&:hover": {
                                        bgcolor: "#d0905a",
                                    },
                                    padding: "12px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "normal",
                                    fontSize: "16px",
                                }}
                            >
                                다음
                            </Button>
                        </Box>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                border: "1px solid #f0f0f0",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "white",
                                mb: 2,
                            }}
                        >
                            {renderCheckboxOptions(hasPet, hasPet, setHasPet)}
                        </Box>

                        {/* 버튼 그룹 */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleBack}
                                sx={{
                                    bgcolor: "#FDF1E5",
                                    color: "#E9A260",
                                    "&:hover": {
                                        bgcolor: "#F2DFCE",
                                    },
                                    padding: "12px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "normal",
                                    fontSize: "16px",
                                }}
                            >
                                이전
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleNextWithValidation}
                                sx={{
                                    bgcolor: "#E9A260",
                                    color: "white",
                                    "&:hover": {
                                        bgcolor: "#d0905a",
                                    },
                                    padding: "12px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "normal",
                                    fontSize: "16px",
                                }}
                            >
                                다음
                            </Button>
                        </Box>
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                border: "1px solid #f0f0f0",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "white",
                                mb: 2,
                            }}
                        >
                            {renderCheckboxOptions(hasSitterExperience, hasSitterExperience, setHasSitterExperience)}
                        </Box>

                        {/* 버튼 그룹 */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleBack}
                                sx={{
                                    bgcolor: "#FDF1E5",
                                    color: "#E9A260",
                                    "&:hover": {
                                        bgcolor: "#F2DFCE",
                                    },
                                    padding: "12px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "normal",
                                    fontSize: "16px",
                                }}
                            >
                                이전
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleNextWithValidation}
                                sx={{
                                    bgcolor: "#E9A260",
                                    color: "white",
                                    "&:hover": {
                                        bgcolor: "#d0905a",
                                    },
                                    padding: "12px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "normal",
                                    fontSize: "16px",
                                }}
                            >
                                다음
                            </Button>
                        </Box>
                    </Box>
                );
            case 4:
                return (
                    <Box sx={{ mb: 8 }}>
                        <Box
                            sx={{
                                border: "1px solid #f0f0f0",
                                borderRadius: "8px",
                                padding: "16px",
                                backgroundColor: "white",
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, fontSize: "16px", fontWeight: "bold" }}>
                                요청 내용 요약
                            </Typography>

                            {history.map((item, index) => (
                                <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                                        {item.question.split("?")[0]}:
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>{item.answer}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* 버튼 그룹 */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleBack}
                                sx={{
                                    bgcolor: "#FDF1E5",
                                    color: "#E9A260",
                                    "&:hover": {
                                        bgcolor: "#F2DFCE",
                                    },
                                    padding: "12px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "normal",
                                    fontSize: "16px",
                                }}
                            >
                                이전
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleNext}
                                sx={{
                                    bgcolor: "#E9A260",
                                    color: "white",
                                    "&:hover": {
                                        bgcolor: "#d0905a",
                                    },
                                    padding: "12px",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "normal",
                                    fontSize: "16px",
                                }}
                            >
                                완료
                            </Button>
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* 히스토리 표시 */}
            {history.map(renderHistoryItem)}

            {/* 현재 질문 표시 */}
            {renderCurrentQuestion()}

            {/* 선택지 표시 */}
            {renderOptions()}

            {/* GlobalSnackbar*/}
            <GlobalSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                handleSnackbarClose={handleSnackbarClose}
            />
        </>
    );
};

export default PetSitterSurvey;
