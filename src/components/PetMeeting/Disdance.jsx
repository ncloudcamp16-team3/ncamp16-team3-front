import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

const Distance = ({ dongName }) => {
    const steps = [0, 1, 2, 3];
    const [currentStep, setCurrentStep] = useState(1); // 기본 선택된 위치

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "0 25px",
                }}
            >
                <Typography
                    sx={{
                        textAlign: "center",
                        fontSize: "25px",
                        ml: "5px",
                    }}
                >
                    동네위치
                </Typography>
                <Typography
                    sx={{
                        backgroundColor: "#E9A260",
                        width: "120px",
                        height: "45px",
                        lineHeight: "45px",
                        textAlign: "center",
                        borderRadius: "10px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "18px",
                    }}
                >
                    {dongName}
                </Typography>
            </Box>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "450px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "25px auto",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: "6px",
                        width: "96%",
                        backgroundColor: "#D9D9D9",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                    }}
                />

                {steps.map((step) => (
                    <Box
                        key={step}
                        onClick={() => setCurrentStep(step)}
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: step === currentStep ? "#E9A260" : "#D9D9D9",
                            zIndex: 3,
                            cursor: "pointer",
                        }}
                    />
                ))}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: "0 25px",
                }}
            >
                <Typography>가까운 동네</Typography>
                <Typography>먼 동네</Typography>
            </Box>
        </>
    );
};

export default Distance;
