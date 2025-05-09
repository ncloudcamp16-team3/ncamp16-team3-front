import React from "react";
import { PeriodSelector } from "./PeriodSelector.jsx";
import { SimpleDateRangeSelector } from "./DateRangeSelector.jsx";
import { Box, Typography, Paper, Divider } from "@mui/material";
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
    const handlePeriodChange = (value) => {
        setPeriodSelect(value);

        const today = dayjs();
        let newStart = null;

        switch (value) {
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
                return;
            default:
                return;
        }

        if (newStart) {
            setStartDate(newStart);
            setEndDate(today);
        }
    };

    const handleDateChange = (target, value) => {
        const newValue = dayjs(value); // Convert the value to dayjs format
        if (target === "start") setStartDate(newValue);
        else if (target === "end") setEndDate(newValue);
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
            <Box sx={{ width: "100%", display: "flex", flexDirection: "row", ml: 2, mt: 2, mb: 1, order: -1 }}>
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
                                startDate={startDate.format("YYYY-MM-DD")}
                                endDate={endDate.format("YYYY-MM-DD")}
                                onDateChange={handleDateChange}
                            />
                        </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
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
                            onClick={() => onSearch(startDate, endDate)}
                        >
                            검색
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};
