import React from "react";
import { Box, Button } from "@mui/material";

const StepButtons = ({ step, totalSteps, onBack, onNext, hideButtons = false }) => {
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
