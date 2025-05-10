import React, { useEffect } from "react";
import { PeriodSelector } from "./PeriodSelector.jsx";
import { Box, Typography, Paper } from "@mui/material";
import dayjs from "dayjs";

export const FilterSection = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onSearch,
    periodSelect,
    setPeriodSelect,
}) => {
    const today = dayjs();

    const handlePeriodChange = (value) => {
        // ✅ '직접입력'이면 토글 처리
        if (value === "직접입력") {
            if (periodSelect === "직접입력") {
                setPeriodSelect(""); // 초기화
            } else {
                setPeriodSelect("직접입력");
                setEndDate(today); // 초기값 설정
            }
            return;
        }

        setPeriodSelect(value); // 상태만 먼저 업데이트
    };

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
            case "전체보기":
                newStart = dayjs("1970-01-01");
                break;
            default:
                return;
        }

        if (newStart) {
            setStartDate(newStart);
            setEndDate(today);
        }
    }, [periodSelect]);

    // ✅ 날짜가 변경되었을 때 필터링 적용
    useEffect(() => {
        if (startDate && endDate && periodSelect !== "") {
            onSearch(startDate, endDate);
        }
    }, [startDate, endDate]);

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
            <Box sx={{ width: "100%", display: "flex", flexDirection: "row", ml: 2, mt: 2, mb: 1, order: -1 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "text.primary" }}>
                    결제내역
                </Typography>
            </Box>

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
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        px: 2,
                    }}
                >
                    <PeriodSelector selected={periodSelect} onChange={handlePeriodChange} />
                </Box>
            </Box>
        </Paper>
    );
};
