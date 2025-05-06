import React, { useEffect, useState, useRef, useContext } from "react";
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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import dayjs from "dayjs";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";
import TitleBar from "../../components/Global/TitleBar.jsx";
import useInTimeRange from "../../hook/Reserve/useInTimeRange.js";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { addTempReserve } from "../../services/reserveService.js";
import { Context } from "../../context/Context.jsx";
import DateTimeSelector from "./DateTimeSelector.jsx";

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

const ReserveDetail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [address, setAddress] = useState(null);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [userWantReserve, setUserWantReserve] = useState(false);
    const { user } = useContext(Context);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const naverPayRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://nsp.pay.naver.com/sdk/js/naverpay.min.js";
        script.onload = () => {
            naverPayRef.current = window.Naver?.Pay.create({
                mode: "development", // production 시 'production'으로 변경
                clientId: "HN3GGCMDdTgGUfl0kFCo",
                chainId: "N2RuTHNTcUh6cHV",
            });
        };
        document.body.appendChild(script);
    }, []);

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
                            <DateTimeSelector
                                openHours={detail.openHours}
                                facilityType={facilityType}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                startTime={startTime}
                                setStartTime={setStartTime}
                                endTime={endTime}
                                setEndTime={setEndTime}
                            />
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
                            onClick={async () => {
                                if (!naverPayRef.current) return alert("결제 모듈을 불러오지 못했습니다.");
                                if (!startDate || !startTime) return alert("예약 날짜 및 시간을 선택해주세요");

                                const entryTime = dayjs(
                                    `${dayjs(startDate).format("YYYY-MM-DD")}T${startTime}`
                                ).toISOString();
                                const exitTime =
                                    endDate && endTime
                                        ? dayjs(`${dayjs(endDate).format("YYYY-MM-DD")}T${endTime}`).toISOString()
                                        : null;

                                try {
                                    const response = await addTempReserve({
                                        userId: user.id,
                                        facilityId: detail.id,
                                        entryTime,
                                        exitTime,
                                        amount: 240000,
                                    });

                                    const merchantPayKey = response.data.reserveId;

                                    naverPayRef.current.open({
                                        merchantPayKey,
                                        productName: detail.name,
                                        productCount: "1",
                                        totalPayAmount: "240000",
                                        taxScopeAmount: "240000",
                                        taxExScopeAmount: "0",
                                        returnUrl: `http://localhost:5173/api/reserve/payment/naver/return?merchantPayKey=${merchantPayKey}`,
                                    });
                                } catch (err) {
                                    console.error("예약 생성 실패:", err);
                                    alert("예약 생성 중 오류가 발생했습니다.");
                                }
                            }}
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
