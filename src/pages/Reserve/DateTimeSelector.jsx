import React, { useEffect, useState } from "react";
// MUI Components
import {
    Box,
    Typography,
    Button,
    Card,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Container,
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
    isTimetableEmpty,
    setIsTimetableEmpty,
}) => {
    const [dateDialog, setDateDialog] = useState({ open: false, target: "start" });
    const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
    const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);
    const [timeOptions, setTimeOptions] = useState([]);

    const [selectedStartDay, setSelectedStartDay] = useState(null);
    const [selectedEndDay, setSelectedEndDay] = useState(null);

    const isHotel = facilityType === "HOTEL";
    const startDateLabel = isHotel ? "시작일자" : "예약일자";
    const startTimeLabel = isHotel ? "시작시간" : "예약시간";

    useEffect(() => {
        const count = Object.values(openHours).filter((dayInfo) => dayInfo?.isOpen);
        setIsTimetableEmpty(count.length === 0);
    }, [openHours, setIsTimetableEmpty]);

    useEffect(() => {
        const generateStartTimeOptions = () => {
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

            const selectedStartDayData = openHours[selectedStartDay] || {};
            const { openTime: startOpenTime, closeTime: startCloseTime } = selectedStartDayData;
            let newStartTimeOptions = [];

            if (startOpenTime && startCloseTime) {
                try {
                    let startHourNumber = parseInt(startOpenTime.split(":")[0]);
                    let endHourNumber = parseInt(startCloseTime.split(":")[0]);

                    for (let hour = startHourNumber; hour <= endHourNumber; hour++) {
                        const displayHour = hour % 24;
                        newStartTimeOptions.push(`${displayHour.toString().padStart(2, "0")}:00`);
                    }
                    setTimeOptions(newStartTimeOptions);
                } catch (error) {
                    console.error("시작 시간 옵션 생성 오류:", error);
                    setTimeOptions(defaultTimes);
                }
            } else {
                setTimeOptions(defaultTimes);
            }
        };

        const generateEndTimeOptions = () => {
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

            const selectedEndDayData = openHours[selectedEndDay] || {};
            const { openTime: endOpenTime, closeTime: endCloseTime } = selectedEndDayData;
            let newEndTimeOptions = [];

            if (endOpenTime && endCloseTime) {
                try {
                    let startHourNumber = parseInt(endOpenTime.split(":")[0]);
                    let endHourNumber = parseInt(endCloseTime.split(":")[0]);

                    for (let hour = startHourNumber; hour <= endHourNumber; hour++) {
                        const displayHour = hour % 24;
                        newEndTimeOptions.push(`${displayHour.toString().padStart(2, "0")}:00`);
                    }

                    // 시작 요일과 종료 요일이 같고 시작 시간이 있는 경우,
                    // 종료 시간 옵션에서 시작 시간 이전의 시간을 제외합니다.
                    if (selectedStartDay === selectedEndDay && startTime) {
                        const selectedStartHour = parseInt(startTime.split(":")[0]);
                        newEndTimeOptions = newEndTimeOptions.filter(
                            (time) => parseInt(time.split(":")[0]) > selectedStartHour
                        );
                    }

                    setTimeOptions(newEndTimeOptions);
                } catch (error) {
                    console.error("종료 시간 옵션 생성 오류:", error);
                    setTimeOptions(defaultTimes);
                }
            } else {
                setTimeOptions(defaultTimes);
            }
        };

        if (selectedStartDay) {
            generateStartTimeOptions();
        } else {
            setTimeOptions([]); // 시작 요일이 없으면 시간 옵션 초기화
        }

        if (selectedEndDay && isHotel && startTime) {
            generateEndTimeOptions();
        }
    }, [openHours, selectedStartDay, selectedEndDay, startTime, isHotel]);

    const handleOpenDateDialog = (target) => setDateDialog({ open: true, target });
    const handleCloseDateDialog = () => setDateDialog({ ...dateDialog, open: false });

    const handleDateSelect = (value) => {
        const dayCode = value.format("ddd").toUpperCase();
        if (dateDialog.target === "start") {
            setStartDate(value);
            setStartTime("");
            setSelectedStartDay(dayCode);
        } else {
            setEndDate(value);
            setEndTime("");
            setSelectedEndDay(dayCode);
        }
        handleCloseDateDialog();
    };

    const handleResetDate = () => {
        if (dateDialog.target === "start") {
            setStartDate(null);
            setStartTime("");
            setSelectedStartDay(null);
        } else {
            setEndDate(null);
            setEndTime("");
            setSelectedEndDay(null);
        }
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
        const baseDate = isStart ? startDate : endDate;
        const selectedDayCode = isStart ? selectedStartDay : selectedEndDay;
        const isToday = isStart ? isTodayStart : isTodayEnd;
        const currentTime = dayjs();
        const currentHour = currentTime.hour();
        const currentMinute = currentTime.minute();

        if (!selectedDayCode || !openHours[selectedDayCode]?.isOpen) {
            return []; // 선택된 요일이 유효하지 않거나 영업일이 아니면 빈 배열 반환
        }

        const openTimeStr = openHours[selectedDayCode]?.openTime?.trim();
        const closeTimeStr = openHours[selectedDayCode]?.closeTime?.trim();

        if (!openTimeStr || !closeTimeStr) {
            return []; // 영업 시작/종료 시간이 없으면 빈 배열 반환
        }

        const [openHour, openMinute] = openTimeStr.split(":").map(Number);
        const [closeHour, closeMinute] = closeTimeStr.split(":").map(Number);

        const startTimeOfDay = dayjs().hour(openHour).minute(openMinute).second(0);
        const endTimeOfDay = dayjs().hour(closeHour).minute(closeMinute).second(0);

        const generatedTimes = [];
        let current = startTimeOfDay.clone();
        while (current.isBefore(endTimeOfDay) || current.isSame(endTimeOfDay)) {
            generatedTimes.push(current.format("HH:mm"));
            current = current.add(60, "minute"); // 1시간 단위로 생성 (조정 가능)
            if (current.isSame(endTimeOfDay) && closeMinute > 0) {
                generatedTimes.push(current.format("HH:mm"));
                break;
            } else if (current.isAfter(endTimeOfDay)) {
                break;
            }
        }

        return generatedTimes.filter((time) => {
            const [hour, minute] = time.split(":").map(Number);

            if (isToday && baseDate?.isSame(currentTime, "day")) {
                return hour > currentHour || (hour === currentHour && minute >= currentMinute);
            }
            return true;
        });
    };

    // 요일 매핑 테이블 정의
    const dayMapping = {
        MON: "월",
        TUE: "화",
        WED: "수",
        THU: "목",
        FRI: "금",
        SAT: "토",
        SUN: "일",
    };

    const orderedDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]; // 고정된 요일 순서

    // 날짜의 요일에 따라 영어 코드 반환
    const getDayCode = (date) => {
        return date.format("ddd").toUpperCase();
    };

    // 날짜 비활성화 함수 추가
    const shouldDisableDate = (date) => {
        // 현재 날짜보다 이전인 경우 비활성화
        if (date.isBefore(dayjs(), "day")) {
            return true;
        }

        // 시작일 선택 중이고 종료일이 있는 경우, 종료일 이전이면 비활성화
        if (dateDialog.target === "start" && endDate && date.isAfter(endDate, "day")) {
            return true;
        }

        // 종료일 선택 중이고 시작일이 있는 경우, 시작일 이전이면 비활성화
        if (dateDialog.target === "end" && startDate && date.isBefore(startDate, "day")) {
            return true;
        }

        // 해당 날짜의 요일 코드 가져오기
        const dayCode = getDayCode(date);

        // openHours에서 해당 요일이 영업일인지 확인
        const dayInfo = openHours[dayCode];

        // 해당 요일이 영업일이 아니면 비활성화
        if (!dayInfo || !dayInfo.isOpen) {
            return true;
        }

        return false;
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
                    <Typography variant="caption" sx={{ display: "block", color: "#666666", mt: 1 }}>
                        ※ 영업일(
                        {orderedDays
                            .filter((day) => openHours[day]?.isOpen)
                            .map((day) => dayMapping[day])
                            .join(", ")}
                        )만 선택 가능합니다.
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ bgcolor: "#FFF7EF", paddingX: "0" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            sx={{ maxWidth: "100%" }}
                            value={dateDialog.target === "start" ? startDate : endDate}
                            onChange={(newValue) => handleDateSelect(newValue)}
                            minDate={dayjs()} // 오늘 이전 날짜는 선택 불가
                            shouldDisableDate={shouldDisableDate} // 날짜 비활성화 함수 적용
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
