import React, { useEffect, useState } from "react";
import { PeriodSelector } from "./PeriodSelector.jsx";
import { SimpleDateRangeSelector } from "./DateRangeSelector.jsx";
import { Box, Typography, Paper, Divider } from "@mui/material";
import dayjs from "dayjs";

export const FilterSection = ({ onSearch }) => {
    const [periodSelect, setPeriodSelect] = useState("15일");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const today = dayjs();
        let newStart = null;

        switch (periodSelect) {
            case "15일":
                newStart = today.subtract(15, "day");
                break;
            case "1개월":
                newStart = today.subtract(1, "month");
                break;
            case "3개월":
                newStart = today.subtract(3, "month");
                break;
            case "6개월":
                newStart = today.subtract(6, "month");
                break;
            case "1년":
                newStart = today.subtract(1, "year");
                break;
            case "직접입력":
                // 유지 (직접입력 선택 시 날짜를 초기화하지 않음)
                return;
            default:
                return;
        }

        setStartDate(newStart);
        setEndDate(today);
    }, [periodSelect]);

    const handlePeriodChange = (value) => {
        // 직접입력으로 바뀌었을 때도 기존 날짜 유지
        setPeriodSelect(value);
    };

    const handleDateChange = (target, value) => {
        if (target === "start") setStartDate(value);
        else if (target === "end") setEndDate(value);
    };

    return (
        <Paper
            elevation={1}
            sx={{
                maxWidth: "500px",
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                zIndex: 2,
                backgroundColor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                paddingBottom: "10px",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    ml: 2,
                    mt: 2,
                    mb: 1,
                    order: -1,
                }}
            >
                <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    결제내역
                </Typography>
            </Box>

            <Divider sx={{ width: "100%", mb: 1 }} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    px: 1,
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                <Box
                    sx={{
                        flexShrink: 1,
                        flexGrow: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        width: "50%",
                    }}
                >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        조회기간 선택
                    </Typography>
                    <PeriodSelector selected={periodSelect} onChange={handlePeriodChange} />
                </Box>

                <Box
                    sx={{
                        flexShrink: 1,
                        flexGrow: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        width: "50%",
                    }}
                >
                    {periodSelect === "직접입력" && (
                        <Box sx={{ width: "100%", mt: 2 }}>
                            <SimpleDateRangeSelector
                                startDate={startDate}
                                endDate={endDate}
                                onDateChange={handleDateChange}
                            />
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: "#F97316",
                                borderRadius: "20px",
                                width: "60px",
                                height: "30px",
                                textAlign: "center",
                                cursor: "pointer",
                                padding: "2px",
                                color: "white",
                                lineHeight: "26px",
                                fontWeight: "bold",
                            }}
                            onClick={onSearch}
                        >
                            검색
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};
