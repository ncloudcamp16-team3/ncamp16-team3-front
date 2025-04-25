import React from "react";
import { Box, Button } from "@mui/material";

/**
 * 단계 이동 버튼 컴포넌트
 * @param {Object} props
 * @param {number} props.step 현재 단계
 * @param {number} props.totalSteps 총 단계 수
 * @param {Function} props.onBack 이전 단계로 이동하는 함수
 * @param {Function} props.onNext 다음 단계로 이동하는 함수
 * @param {boolean} [props.isFinalStep=false] 마지막 단계 여부
 * @param {boolean} [props.hideButtons=false] 버튼 숨김 여부
 */
const StepButtons = ({ step, totalSteps, onBack, onNext, isFinalStep = false, hideButtons = false }) => {
    if (hideButtons) return null;

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
                    onClick={onNext}
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
    }

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
                onClick={onBack}
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
                onClick={onNext}
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
                {step === totalSteps - 1 ? "완료" : "다음"}
            </Button>
        </Box>
    );
};

export default StepButtons;
