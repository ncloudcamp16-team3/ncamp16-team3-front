import { useFacilityDetailContext } from "../../../context/ReserveContext.jsx";
import { useState } from "react";
import { generateTimeOptions } from "../../../hook/Reserve/generateTimeOptions.js";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Stack, Box, Card } from "@mui/material";
import { getTimeButtonStyle } from "../../../hook/Reserve/getTimeButtonStyle.js";
import { getAvailableEndTimes } from "../../../hook/Reserve/getAvailableEndTimes.js";
import { DateCalendar } from "@mui/x-date-pickers";

const DateTimeSelector = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateDialog, setDateDialog] = useState({ open: false, target: "start" });
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
    const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);
    const { detail } = useFacilityDetailContext();

    const isHotel = detail.type === "HOTEL";

    // 시설 유형에 따라 라벨 설정
    const startDateLabel = isHotel ? "시작일자" : "예약일자";
    const startTimeLabel = isHotel ? "시작시간" : "예약시간";

    // 영업 시간에서 시간 옵션 생성
    const timeOptions = generateTimeOptions(detail?.openTime, detail?.closeTime);

    // === 달력 모달 ===
    const handleOpenDateDialog = (target) => {
        setDateDialog({ open: true, target });
    };

    const handleCloseDateDialog = () => {
        setDateDialog({ ...dateDialog, open: false });
    };

    const handleDateSelect = (value) => {
        if (dateDialog.target === "start") setStartDate(value);
        else setEndDate(value);
        handleCloseDateDialog();
    };

    const handleResetDate = () => {
        if (dateDialog.target === "start") setStartDate(null);
        else setEndDate(null);
    };

    // === 시간 선택 ===
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

    return (
        <Stack spacing={2} direction="column">
            {/* 날짜 선택 버튼 */}
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
                    <CalendarTodayIcon sx={{}} />
                    {startDate ? dayjs(startDate).format("YYYY-MM-DD") : startDateLabel}
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
                        <CalendarTodayIcon />
                        {endDate ? dayjs(endDate).format("YYYY-MM-DD") : "종료일자"}
                    </Button>
                )}
            </Box>

            {/* 시간 선택 버튼 */}
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
                    <ScheduleIcon /> {startTime || startTimeLabel}
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
                        <ScheduleIcon /> {endTime || "종료시간"}
                    </Button>
                )}
            </Box>

            {/* 시작 시간 선택 패널 */}
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
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid #EEEEEE",
                            pb: 1,
                            mb: 1,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                            <ScheduleIcon sx={{ mr: 1, color: "#666666" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                시간 선택
                            </Typography>
                        </Box>
                        <Box
                            onClick={() => setShowStartTimeSelector(false)}
                            sx={{
                                cursor: "pointer",
                                fontSize: 18,
                                color: "#666666",
                                transform: "rotate(180deg)",
                            }}
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

            {/* 종료 시간 선택 패널 (호텔 타입일 때만 표시) */}
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
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid #EEEEEE",
                            pb: 1,
                            mb: 1,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                            <ScheduleIcon sx={{ mr: 1, color: "#666666" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                시간 선택
                            </Typography>
                        </Box>
                        <Box
                            onClick={() => setShowEndTimeSelector(false)}
                            sx={{
                                cursor: "pointer",
                                fontSize: 18,
                                color: "#666666",
                                transform: "rotate(180deg)",
                            }}
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

            {/* 날짜 선택 모달 */}
            <Dialog open={dateDialog.open} onClose={handleCloseDateDialog}>
                <DialogTitle sx={{ bgcolor: "#FFF7EF" }}>
                    {dateDialog.target === "start" ? (isHotel ? "시작일 선택" : "예약일 선택") : "종료일 선택"}
                </DialogTitle>
                <DialogContent sx={{ bgcolor: "#FFF7EF" }}>
                    <DateCalendar
                        value={dateDialog.target === "start" ? startDate : endDate}
                        onChange={(newValue) => handleDateSelect(newValue)}
                        minDate={dateDialog.target === "end" && startDate ? startDate : undefined}
                    />
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
