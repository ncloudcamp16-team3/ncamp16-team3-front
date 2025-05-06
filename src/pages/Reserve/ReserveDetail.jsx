import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import reserveDetailData from "../../mock/Reserve/reserveDetail.json";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// MUI Components
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Avatar,
    Grid,
    Stack,
    Divider,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";
import TitleBar from "../../components/Global/TitleBar.jsx";
import useInTimeRange from "../../hook/Reserve/useInTimeRange.js";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

// 예시 데이터 변환 함수
const transformScoreToChartData = (score) => {
    const total = Object.values(score).reduce((sum, count) => sum + count, 0);
    return Object.entries(score)
        .sort(([a], [b]) => b - a)
        .map(([key, value]) => ({
            name: `★${key.replace(/Stars?/, "")}`,
            value,
            percentage: Math.round((value / total) * 100),
        }));
};

const timeOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

const DateTimeSelector = ({ openHours, facilityType }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateDialog, setDateDialog] = useState({ open: false, target: "start" });
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
    const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);

    // 시설 유형에 따라 라벨 설정
    const isHotel = facilityType === "호텔";
    const startDateLabel = isHotel ? "시작일자" : "예약일자";
    const startTimeLabel = isHotel ? "시작시간" : "예약시간";

    // 영업 시간에서 시간 옵션 생성
    const generateTimeOptions = () => {
        // 기본값으로 9시부터 20시까지 설정
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

        if (!openHours || typeof openHours !== "string") {
            return defaultTimes;
        }

        try {
            // 정규식으로 시간 추출
            const timePattern = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
            const matches = openHours.match(timePattern);

            if (!matches || matches.length < 3) {
                return defaultTimes;
            }

            const startTimeStr = matches[1].trim();
            const endTimeStr = matches[2].trim();

            // 시작 시간과 종료 시간 추출
            let startHour = parseInt(startTimeStr.split(":")[0]);
            let endHour = parseInt(endTimeStr.split(":")[0]);

            // 종료 시간이 시작 시간보다 작다면 24시간 형식으로 간주
            if (endHour < startHour) {
                endHour += 24;
            }

            const timeOptions = [];
            for (let hour = startHour; hour <= endHour; hour++) {
                // 24시간을 넘어가는 경우 처리
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

    // 예약 가능한 시간 필터링 (시작 시간 이후만 선택 가능하도록)
    const getAvailableEndTimes = () => {
        if (!startTime) return timeOptions;

        const startHourStr = startTime.split(":")[0];
        const startHour = parseInt(startHourStr);

        return timeOptions.filter((time) => {
            const hourStr = time.split(":")[0];
            const hour = parseInt(hourStr);

            // 24시간제로 비교 (예: 23시 이후의 00시, 01시 등도 고려)
            if (startHour >= 20 && hour < 8) {
                return true; // 자정을 넘어가는 경우
            }
            return hour > startHour;
        });
    };

    // 선택된 시간 강조 스타일
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

const ReserveDetail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [address, setAddress] = useState(null);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [userWantReserve, setUserWantReserve] = useState(false);

    useEffect(() => {
        const found = reserveDetailData.find((item) => item.id === Number(id));
        if (found) setDetail(found);
    }, [id]);
    const inRange = useInTimeRange(detail?.openHours ?? "");

    if (!detail) return <Typography>Loading...</Typography>;

    const chartData = transformScoreToChartData(detail.score);
    const filledStars = detail.rating === 5 ? 5 : Math.round(detail.rating);
    const facilityType = detail.tags || "호텔"; // 기본값은 호텔로 설정

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <TitleBar
                    sx={{ pt: 2 }}
                    name="편의시설 상세정보"
                    {...(userWantReserve ? { onBack: () => setUserWantReserve(false) } : {})}
                />
                <Divider sx={{ width: "100%", mb: 3 }} />
                <Box sx={{ pl: 3, pr: 3, pb: 3 }}>
                    {/* 상단 이미지 */}
                    <Card sx={{ mb: 2, width: "100%" }}>
                        <CardMedia component="img" height="300" image={detail.mainImage} alt={detail.name} />
                    </Card>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            {detail.name}
                        </Typography>
                        <Box sx={{ display: "flex", pb: 2, gap: 1 }}>
                            <Chip size="small" label={inRange ? "영업중" : "영업종료"} sx={{ color: "#fff" }} />
                            <Typography sx={{ fontWeight: "bold" }}>{detail.openHours}</Typography>
                        </Box>
                    </Box>
                    {/* 기본 정보 */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            ・ {detail.address}
                        </Typography>
                        <Typography
                            onClick={() => setIsMapOpen(!isMapOpen)}
                            role="button"
                            tabIndex={0}
                            sx={{
                                cursor: "pointer",
                                color: "primary.main",
                                fontWeight: 500,
                                userSelect: "none",
                            }}
                        >
                            {isMapOpen ? "지도접기 ▲" : "지도열기 ▼"}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* 지도 */}
                    {isMapOpen && (
                        <Box sx={{ my: 2 }}>
                            <ReserveMap address={address} setAddress={setAddress} />
                            <Divider />
                        </Box>
                    )}

                    <Box sx={{ display: userWantReserve ? "block" : "none" }}>
                        <Typography sx={{ whiteSpace: "pre-wrap", mb: 2, mt: 2 }}>
                            ・요금 정보{"\n\t"}・기본요금 24시간 50,000원{"\n\t"}・추가요금 6시간 단위로 10,000원
                        </Typography>
                        <Divider />
                        <Box sx={{ mb: 2 }}>
                            <DateTimeSelector openHours={detail.openHours} facilityType={facilityType} />
                        </Box>
                        <Divider />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                mt: 2,
                                mb: 2,
                            }}
                        >
                            <Box>
                                <Typography sx={{ width: "100%" }}>・결제 금액</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ textAlign: "right", width: "100%" }}>240,000원</Typography>
                            </Box>
                        </Box>
                        <Divider />
                        <Button
                            variant="contained"
                            sx={{ bgcolor: "#E9A260", borderRadius: 3, mt: 2, mb: 2 }}
                            size="large"
                            fullWidth
                        >
                            결제하기
                        </Button>
                    </Box>
                    {/* 상세 정보 */}
                    <Box sx={{ display: userWantReserve ? "none" : "block" }}>
                        <Box>
                            <Divider />
                            {/* 예약 버튼 */}
                            <Box sx={{ my: 2 }}>
                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: "#E9A260", borderRadius: 3 }}
                                    size="large"
                                    fullWidth
                                    onClick={() => setUserWantReserve(true)}
                                    onBack={() => setUserWantReserve(false)}
                                >
                                    <CalendarTodayIcon /> 예약하기
                                </Button>
                            </Box>
                        </Box>

                        <Divider />

                        <Stack direction="row" spacing={4} sx={{ my: 4, width: "100%" }} alignItems="stretch">
                            {/* 이용자 평점 */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 200,
                                    bgcolor: "#FFF7EF",
                                    borderRadius: 5,
                                }}
                            >
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", ml: 3, mt: 2 }}>
                                    이용자 평점
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 1, color: "#FF5555", ml: 4, mt: 1, fontWeight: "bold" }}
                                >
                                    {detail.rating}/5.0
                                </Typography>
                                <Box sx={{ mb: 1, ml: 3 }}>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <StarIcon
                                            key={index}
                                            fontSize="medium"
                                            sx={{ color: index < filledStars ? "#FFC107" : "#E0E0E0" }}
                                        />
                                    ))}
                                </Box>
                                <Typography variant="h7" sx={{ color: "#FF5555", ml: 4, fontWeight: "bold" }}>
                                    {detail.reviewCount}명 참여
                                </Typography>
                            </Box>

                            {/* 점수 비율 그래프 */}
                            <Box sx={{ flex: 1, height: 200, ml: 0, bgcolor: "#FFF7EF", borderRadius: 5 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", ml: 3, mt: 2 }}>
                                    점수 비율
                                </Typography>
                                <Box sx={{ position: "relative", width: "100%", height: 150 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            layout="vertical"
                                            data={chartData}
                                            margin={{ top: 5, right: 40, left: 30, bottom: 20 }}
                                            barCategoryGap={2}
                                            barGap={1}
                                        >
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={20}
                                                tick={{ fontSize: 13, fill: "#FF5555", fontWeight: 500 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip formatter={(value) => `${value}명`} />
                                            <Bar
                                                dataKey="value"
                                                fill="#1976d2"
                                                barSize={8}
                                                radius={30}
                                                background={{ fill: "#E0E0E0", radius: 30 }}
                                            ></Bar>
                                        </BarChart>
                                    </ResponsiveContainer>

                                    {/* 절대 위치 텍스트 */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 9,
                                            right: 0,
                                            height: "83%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-around",
                                            alignItems: "flex-end",
                                            pr: 2,
                                            pointerEvents: "none", // 마우스 방해 방지
                                        }}
                                    >
                                        {chartData.map((entry, idx) => (
                                            <Typography
                                                key={idx}
                                                sx={{
                                                    fontSize: "10px",
                                                    color: "#FF5555",
                                                    height: `${100 / chartData.length}%`,
                                                }}
                                            >
                                                {entry.percentage}%
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 4 }} />

                        {/* 리뷰 목록 */}
                        <Typography variant="h6" gutterBottom>
                            이용자 리뷰
                        </Typography>
                        <Grid container spacing={3}>
                            {detail.reviews.map((review, idx) => (
                                <Grid item xs={12} md={6} key={idx}>
                                    <Card sx={{ height: "100%" }}>
                                        <CardContent>
                                            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                                <Avatar src={review.avatar} />
                                                <Typography variant="subtitle1">{review.user}</Typography>
                                            </Stack>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={review.image}
                                                alt="review"
                                                sx={{ borderRadius: 1, mb: 2 }}
                                            />
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {review.content}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {review.date}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default ReserveDetail;
