import React, { useState } from "react";
// MUI Components
import { Box, Typography, Button, Card, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

const DateTimeSelector = ({
    openHours,
    facilityType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
}) => {
    const [dateDialog, setDateDialog] = useState({ open: false, target: "start" });
    const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
    const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);

    const isHotel = facilityType === "호텔";
    const startDateLabel = isHotel ? "시작일자" : "예약일자";
    const startTimeLabel = isHotel ? "시작시간" : "예약시간";

    const generateTimeOptions = () => {
        const defaultTimes = [
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
        ];

        if (!openHours || typeof openHours !== "string") return defaultTimes;

        try {
            const timePattern = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
            const matches = openHours.match(timePattern);

            if (!matches || matches.length < 3) return defaultTimes;

            const startTimeStr = matches[1].trim();
            const endTimeStr = matches[2].trim();

            let startHour = parseInt(startTimeStr.split(":"[0]));
            let endHour = parseInt(endTimeStr.split(":"[0]));

            if (endHour < startHour) endHour += 24;

            const timeOptions = [];
            for (let hour = startHour; hour <= endHour; hour++) {
                const displayHour = hour % 24;
                timeOptions.push(`${displayHour.toString().padStart(2, "0")}:00`);
            }

            return timeOptions;
        } catch (error) {
            console.error("영업 시간 형식 파싱 오류:", error);
            return defaultTimes;
        }
    };

    const timeOptions = generateTimeOptions();

    const handleOpenDateDialog = (target) => setDateDialog({ open: true, target });
    const handleCloseDateDialog = () => setDateDialog({ ...dateDialog, open: false });

    const handleDateSelect = (value) => {
        if (dateDialog.target === "start") setStartDate(value);
        else setEndDate(value);
        handleCloseDateDialog();
    };

    const handleResetDate = () => {
        if (dateDialog.target === "start") setStartDate(null);
        else setEndDate(null);
    };

    const toggleTimeSelector = (target) => {
        if (target === "start") {
            setShowStartTimeSelector(!showStartTimeSelector);
            setShowEndTimeSelector(false);
        } else {
            setShowEndTimeSelector(!showEndTimeSelector);
            setShowStartTimeSelector(false);
        }
    };

    const handleTimeSelect = (time, target) => {
        if (target === "start") {
            setStartTime(time);
            setShowStartTimeSelector(false);
        } else {
            setEndTime(time);
            setShowEndTimeSelector(false);
        }
    };

    const getAvailableEndTimes = () => {
        if (!startTime) return timeOptions;

        const startHour = parseInt(startTime.split(":"[0]));

        return timeOptions.filter((time) => {
            const hour = parseInt(time.split(":"[0]));
            if (startHour >= 20 && hour < 8) return true;
            return hour > startHour;
        });
    };

    const getTimeButtonStyle = (time, selectedTime) => {
        const isSelected = time === selectedTime;
        return {
            width: "calc(33.33% - 8px)",
            height: 36,
            fontSize: 14,
            borderRadius: 20,
            margin: "4px",
            backgroundColor: isSelected ? "#E9A260" : "#FFFFFF",
            color: isSelected ? "#FFFFFF" : "#000000",
            border: `1px solid ${isSelected ? "#E9A260" : "#DDDDDD"}`,
            fontWeight: isSelected ? "bold" : "normal",
            "&:hover": {
                backgroundColor: isSelected ? "#E9A260" : "#F5F5F5",
                border: `1px solid ${isSelected ? "#E9A260" : "#CCCCCC"}`,
            },
        };
    };

    return (
        <Stack spacing={2} direction="column">
            <Box sx={{ display: "flex", gap: 3, pt: 2, justifyContent: "center" }}>
                <Button
                    variant="outlined"
                    sx={{
                        width: isHotel ? "40%" : "80%",
                        display: "flex",
                        borderRadius: 2,
                        borderColor: "#C8C8C8",
                        bgcolor: "#FFF7EF",
                        color: "#000",
                        gap: 1,
                    }}
                    onClick={() => handleOpenDateDialog("start")}
                >
                    {" "}
                    <CalendarTodayIcon />
                    {startDate ? dayjs(startDate).format("YYYY-MM-DD") : startDateLabel}{" "}
                </Button>
                {isHotel && (
                    <Button
                        variant="outlined"
                        sx={{
                            width: "40%",
                            display: "flex",
                            borderRadius: 2,
                            borderColor: "#C8C8C8",
                            bgcolor: "#FFF7EF",
                            color: "#000",
                            gap: 1,
                        }}
                        onClick={() => handleOpenDateDialog("end")}
                        disabled={!startDate}
                    >
                        {" "}
                        <CalendarTodayIcon />
                        {endDate ? dayjs(endDate).format("YYYY-MM-DD") : "종료일자"}{" "}
                    </Button>
                )}
            </Box>

            <Box sx={{ gap: 3, display: "flex", justifyContent: "center" }}>
                <Button
                    variant="outlined"
                    sx={{
                        width: isHotel ? "40%" : "80%",
                        display: "flex",
                        borderRadius: 2,
                        borderColor: "#C8C8C8",
                        bgcolor: "#FFF7EF",
                        color: "#000",
                        gap: 1,
                    }}
                    onClick={() => toggleTimeSelector("start")}
                >
                    {" "}
                    <ScheduleIcon />
                    {startTime || startTimeLabel}{" "}
                </Button>
                {isHotel && (
                    <Button
                        variant="outlined"
                        sx={{
                            width: "40%",
                            display: "flex",
                            borderRadius: 2,
                            borderColor: "#C8C8C8",
                            bgcolor: "#FFF7EF",
                            color: "#000",
                            gap: 1,
                        }}
                        onClick={() => toggleTimeSelector("end")}
                        disabled={!startTime}
                    >
                        {" "}
                        <ScheduleIcon />
                        {endTime || "종료시간"}{" "}
                    </Button>
                )}
            </Box>

            {showStartTimeSelector && (
                <Card
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 4,
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                        bgcolor: "#FFF7EF",
                    }}
                >
                    <Box
                        sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #EEEEEE", pb: 1, mb: 1 }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                            <ScheduleIcon sx={{ mr: 1, color: "#666666" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                시간 선택
                            </Typography>
                        </Box>
                        <Box
                            onClick={() => setShowStartTimeSelector(false)}
                            sx={{ cursor: "pointer", fontSize: 18, color: "#666666", transform: "rotate(180deg)" }}
                        >
                            ▲
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            maxHeight: 200,
                            overflow: "auto",
                            p: 1,
                        }}
                    >
                        {timeOptions.map((time) => (
                            <Button
                                key={time}
                                onClick={() => handleTimeSelect(time, "start")}
                                sx={getTimeButtonStyle(time, startTime)}
                            >
                                {time}
                            </Button>
                        ))}
                    </Box>
                </Card>
            )}

            {isHotel && showEndTimeSelector && (
                <Card
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 4,
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                        bgcolor: "#FFF7EF",
                    }}
                >
                    <Box
                        sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #EEEEEE", pb: 1, mb: 1 }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                            <ScheduleIcon sx={{ mr: 1, color: "#666666" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                시간 선택
                            </Typography>
                        </Box>
                        <Box
                            onClick={() => setShowEndTimeSelector(false)}
                            sx={{ cursor: "pointer", fontSize: 18, color: "#666666", transform: "rotate(180deg)" }}
                        >
                            ▲
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            maxHeight: 200,
                            overflow: "auto",
                            p: 1,
                        }}
                    >
                        {getAvailableEndTimes().map((time) => (
                            <Button
                                key={time}
                                onClick={() => handleTimeSelect(time, "end")}
                                sx={getTimeButtonStyle(time, endTime)}
                            >
                                {time}
                            </Button>
                        ))}
                    </Box>
                </Card>
            )}

            <Dialog open={dateDialog.open} onClose={handleCloseDateDialog}>
                <DialogTitle sx={{ bgcolor: "#FFF7EF" }}>
                    {dateDialog.target === "start" ? (isHotel ? "시작일 선택" : "예약일 선택") : "종료일 선택"}
                </DialogTitle>
                <DialogContent sx={{ bgcolor: "#FFF7EF" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={dateDialog.target === "start" ? startDate : endDate}
                            onChange={(newValue) => handleDateSelect(newValue)}
                            minDate={dateDialog.target === "end" && startDate ? startDate : undefined}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions sx={{ bgcolor: "#FFF7EF" }}>
                    <Button onClick={handleResetDate}>초기화</Button>
                    <Box sx={{ flex: 1 }} />
                    <Button onClick={handleCloseDateDialog}>취소</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default DateTimeSelector;
