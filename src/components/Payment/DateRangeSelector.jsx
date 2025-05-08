import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export const SimpleDateRangeSelector = ({ startDate, endDate, onDateChange }) => {
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const [tempDate, setTempDate] = useState(null); // 선택 중인 날짜 임시 보관

    const today = dayjs();
    const format = (date) => (date ? dayjs(date).format("YYYY.MM.DD") : "날짜 선택");

    const renderCalendar = (target) => {
        const isStart = target === "start";
        const isOpen = isStart ? startOpen : endOpen;
        const selectedDate = isStart ? startDate : endDate;
        const title = isStart ? "시작일 선택" : "종료일 선택";

        if (!isOpen) return null;

        return (
            <Box sx={{ width: "100%", mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>{title}</Typography>
                <DateCalendar
                    value={tempDate || selectedDate ? dayjs(selectedDate) : null}
                    onChange={(newValue) => setTempDate(newValue)}
                    disableFuture={isStart} // ✅ 시작일은 미래 선택 불가
                    minDate={isStart ? undefined : startDate ? dayjs(startDate) : today}
                    maxDate={isStart ? today : undefined}
                />
                {tempDate && (
                    <Button
                        variant="contained"
                        size="big"
                        sx={{ mt: 1, bgcolor: "#F97316", borderRadius: 2 }}
                        onClick={() => {
                            onDateChange(target, tempDate);
                            setTempDate(null);
                            if (isStart) setStartOpen(false);
                            else setEndOpen(false);
                        }}
                    >
                        {dayjs(tempDate).format("YYYY년 MM월 DD일")} 선택
                    </Button>
                )}
            </Box>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    gap: 2,
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}
            >
                {/* 표시되는 날짜 텍스트 */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        cursor: "pointer",
                        fontWeight: "bold",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <div
                        onClick={() => {
                            setStartOpen(true);
                            setEndOpen(false);
                            setTempDate(startDate ? dayjs(startDate) : null);
                        }}
                    >
                        {format(startDate)}
                    </div>
                    ~
                    <div
                        onClick={() => {
                            setEndOpen(true);
                            setStartOpen(false);
                            setTempDate(endDate ? dayjs(endDate) : null);
                        }}
                    >
                        {format(endDate)}
                    </div>
                </Box>
            </Box>

            {/* 달력 렌더링 */}
            {renderCalendar("start")}
            {renderCalendar("end")}
        </LocalizationProvider>
    );
};
