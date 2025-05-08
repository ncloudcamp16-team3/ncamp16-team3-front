import React, { useState } from "react";
// MUI Components
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
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
    const [timeOptions, setTimeOptions] = useState([]);
    const [isTimetableEmpty, setIsTimetableEmpty] = useState(false);

    const today = dayjs().format("ddd").toUpperCase();

    const isHotel = facilityType === "HOTEL";
    const startDateLabel = isHotel ? "시작일자" : "예약일자";
    const startTimeLabel = isHotel ? "시작시간" : "예약시간";

    const generateTimeOptions = () => {
        const defaultTimes = [
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
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
            "21:00",
            "22:00",
            "23:00",
        ];

        const count = Object.values(openHours).filter((dayInfo) => dayInfo?.isOpen);
        if (count.length === 0) {
            setIsTimetableEmpty(true);
        }
        let startTime = openHours[today]?.openTime || null;
        let endTime = openHours[today]?.closeTime || null;

        if (startTime && endTime) {
            try {
                const timePattern = /(\d{1,2}:\d{2})/;
                const matches = openHours.match(timePattern);

                if (!matches || matches.length < 3) return defaultTimes;

                const startTimeStr = matches[1].trim();
                const endTimeStr = matches[2].trim();

                let startHour = parseInt(startTimeStr.split(":")[0]);
                let endHour = parseInt(endTimeStr.split(":")[0]);

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
        if (!endDate) return [];

        const startHour = parseInt(startTime.split(":")[0]);
        const isToday = isTodayEnd;
        const currentHour = now.hour();

        return timeOptions.filter((time) => {
            const hour = parseInt(time.split(":")[0]);
            const afterStart = hour > startHour;
            const afterNow = !isToday || hour > currentHour;
            return afterStart && afterNow;
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
    const now = dayjs();
    const isTodayStart = startDate && dayjs(startDate).isSame(now, "day");
    const isTodayEnd = endDate && dayjs(endDate).isSame(now, "day");

    const getFilteredTimeOptions = (isStart) => {
        const base = isStart ? startDate : endDate;
        const isToday = isStart ? isTodayStart : isTodayEnd;
        const currentHour = now.hour();
        const currentMinute = now.minute();

        const filteredTimeOptions = timeOptions.filter((time) => {
            const [hour, minute] = time.split(":").map((v) => parseInt(v));

            // 오늘이라면, 현재 시간 이후로만 필터링
            if (isToday) {
                return hour > currentHour || (hour === currentHour && minute > currentMinute);
            }

            return true; // 오늘이 아니면 모두 허용
        });

        if (endDate && endTime) {
            // 종료 날짜와 시간이 선택되어 있을 경우
            const endDateTime = dayjs(`${endDate.format("YYYY-MM-DD")}T${endTime}`);
            // 시작시간이 종료시간보다 이후일 경우, 시작시간 필터링
            return filteredTimeOptions.filter((time) => {
                const [hour, minute] = time.split(":").map((v) => parseInt(v));
                const startDateTime = dayjs(`${startDate.format("YYYY-MM-DD")}T${time}`);

                return startDateTime.isBefore(endDateTime); // 종료시간 이후로만 선택 가능
            });
        }

        return filteredTimeOptions;
    };

    if (isTimetableEmpty)
        return (
            <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography>예약이 가능한 일정을 준비중입니다...</Typography>
                <Typography>이 시설의 일정에 대해 궁금하신 분은 관리자에게 문의 해주세요</Typography>
            </Container>
        );

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
                    disabled={!startDate} // ✅ 시작일 없으면 비활성화
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
                    <ScheduleIcon />
                    {startTime || startTimeLabel}
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
                        {getFilteredTimeOptions(true).map((time) => (
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
                        {getFilteredTimeOptions().map((time) => (
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
                            minDate={dateDialog.target === "end" ? (startDate ? dayjs(startDate) : dayjs()) : dayjs()}
                            maxDate={dateDialog.target === "start" && endDate ? dayjs(endDate) : undefined}
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
