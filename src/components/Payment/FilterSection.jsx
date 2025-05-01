import React from "react";
import { PeriodSelector } from "./PeriodSelector.jsx";
import { DateRangeSelector } from "./DateRangeSelector.jsx";
import { Box, Typography, Paper, Divider } from "@mui/material";

export const FilterSection = ({ periodSelect, startDate, endDate, onPeriodChange, onDateChange, onSearch }) => {
    return (
        <Paper
            elevation={1}
            sx={{
                maxWidth: "500px",
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                position: "fixed",
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
                }}
            >
                <Box
                    sx={{
                        fontSize: "0.875rem",
                        color: "text.secondary",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        ml: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        조회기간 선택
                    </Typography>
                    <PeriodSelector selected={periodSelect} onChange={onPeriodChange} />
                </Box>

                <Box
                    sx={{
                        fontSize: "0.875rem",
                        color: "text.secondary",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        mr: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        조회일자 검색
                    </Typography>
                    <DateRangeSelector
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={onDateChange}
                        onSearch={onSearch}
                    />
                </Box>
            </Box>
        </Paper>
    );
};
