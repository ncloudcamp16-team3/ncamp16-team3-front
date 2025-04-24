import React from "react";
import { Box, Typography } from "@mui/material";

const Distance = ({ dongName, distance, setDistance }) => {
    const steps = ["1", "2", "3", "4"];

    console.log("지금 거리는? " + distance);

    return (
        <Box
            sx={{
                width: "100%",
                mx: "auto",
                px: 2,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography sx={{ fontSize: "22px" }}>동네위치</Typography>

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
                        flexShrink: 0,
                    }}
                >
                    {dongName ? dongName : "주소선택"}
                </Typography>
            </Box>

            {/* Stepper */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: "6px",
                        backgroundColor: "#D9D9D9",
                        width: "97%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                    }}
                />

                {steps.map((step) => (
                    <Box
                        key={step}
                        onClick={() => setDistance(step)}
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: step === distance ? "#E9A260" : "#D9D9D9",
                            zIndex: 3,
                            cursor: "pointer",
                        }}
                    />
                ))}
            </Box>

            {/* Labels */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>가까운 동네</Typography>
                <Typography>먼 동네</Typography>
            </Box>
        </Box>
    );
};

export default Distance;
