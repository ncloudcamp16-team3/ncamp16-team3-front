import React from "react";
import { Box, Button } from "@mui/material";

export const PeriodSelector = ({ selected, onChange }) => {
    const periods = ["15일", "1개월", "3개월", "6개월", "1년", "전체보기"];

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                gap: 0.5,
                backgroundColor: "#f5f7f9",
                padding: "6px",
                borderRadius: "12px",
                justifyContent: "space-between",
            }}
        >
            {periods.map((period) => (
                <Button
                    key={period}
                    onClick={() => onChange(period)}
                    sx={{
                        flex: "1 1 16%", // 6개 정렬용
                        minWidth: 0,
                        paddingY: "6px",
                        paddingX: "2px",
                        fontSize: "0.75rem",
                        fontWeight: selected === period ? "bold" : 500,
                        borderRadius: "10px",
                        whiteSpace: "nowrap",
                        backgroundColor: selected === period ? "white" : "transparent",
                        color: selected === period ? "text.primary" : "text.secondary",
                        boxShadow: selected === period ? "0 0 0 1.5px rgba(0,0,0,0.15)" : "none",
                        "&:hover": {
                            backgroundColor: selected === period ? "white" : "rgba(0,0,0,0.04)",
                        },
                    }}
                >
                    {period}
                </Button>
            ))}
        </Box>
    );
};
