import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
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
    CircularProgress,
    Alert,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import dayjs from "dayjs";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";
import TitleBar from "../../components/Global/TitleBar.jsx";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import useInTimeRange from "../../hook/Reserve/useInTimeRange.js";
import DateTimeSelector from "./DateTimeSelector.jsx";
import { addTempReserve, getFacilityToReserveById } from "../../services/reserveService.js";
import { Context } from "../../context/Context.jsx";

const transformScoreToChartData = (ratingDistribution) => {
    if (!ratingDistribution) return [];

    const total = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);

    return Object.entries(ratingDistribution)
        .sort(([a], [b]) => b - a)
        .map(([key, value]) => ({
            name: `★${key}`,
            value,
            percentage: total > 0 ? Math.round((value / total) * 100) : 0,
        }));
};

const ReserveDetail = () => {
    const { id } = useParams();
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [userWantReserve, setUserWantReserve] = useState(false);
    const { user } = useContext(Context);

    // 예약 시간과 날짜
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // Facility data
    const [facilityData, setFacilityData] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NaverPay
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

    const inRange = useInTimeRange(facilityData?.openingHours?.MON?.openTime || "");

    // 요일 정보
    const today = dayjs().format("ddd").toUpperCase();

    // API에서 데이터 가져오기
    useEffect(() => {
        const fetchFacilityDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getFacilityToReserveById(id);
                const data = response.data;

                console.log(data);

                setFacilityData(data.facility);
                setReviews(data.reviews || []);
            } catch (err) {
                console.error("시설 정보를 불러오는데 실패했습니다:", err);
                setError("시설 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFacilityDetail();
        }
    }, [id]);

    const handlePaymentClick = async () => {
        if (!naverPayRef.current) {
            alert("결제 모듈을 불러오지 못했습니다.");
            return;
        }

        if (!startDate || !startTime) {
            alert("예약 날짜 및 시간을 선택해주세요");
            return;
        }

        // Format dates for API
        const entryTime = dayjs(`${dayjs(startDate).format("YYYY-MM-DD")}T${startTime}`).toISOString();

        const exitTime =
            endDate && endTime ? dayjs(`${dayjs(endDate).format("YYYY-MM-DD")}T${endTime}`).toISOString() : null;

        try {
            const response = await addTempReserve({
                userId: user.id,
                facilityId: id,
                entryTime,
                exitTime,
                amount: 240000,
            });

            const merchantPayKey = response.data.reserveId;

            // Open NaverPay window
            naverPayRef.current.open({
                merchantPayKey,
                productName: facilityData.name,
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
    };

    // 로딩 중이면 로딩 인디케이터 표시
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    // 에러가 있으면 에러 메시지 표시
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    // 데이터가 없으면 메시지 표시
    if (!facilityData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>시설 정보를 찾을 수 없습니다.</Typography>
            </Box>
        );
    }

    // const chartData = transformScoreToChartData(ratingDistribution);
    // const filledStars = avgRating === 5 ? 5 : Math.round(avgRating);
    const facilityType = facilityData.facilityType || "호텔";

    // 현재 요일의 영업 시간 정보
    const openTime = facilityData.openingHours?.[today]?.openTime || "09:00";
    const closeTime = facilityData.openingHours?.[today]?.closeTime || "18:00";

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
                        <CardMedia
                            component="img"
                            height="300"
                            image={facilityData.imagePath || "https://via.placeholder.com/400x300"}
                            alt={facilityData.name}
                        />
                    </Card>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            {facilityData.name}
                        </Typography>
                        <Box sx={{ display: "flex", pb: 2, gap: 1 }}>
                            <Chip
                                size="small"
                                label={inRange ? "영업중" : "영업종료"}
                                color={inRange ? "success" : "default"}
                                sx={{ color: "#fff" }}
                            />
                            <Typography sx={{ fontWeight: "bold" }}>
                                {openTime} - {closeTime}
                            </Typography>
                        </Box>
                    </Box>

                    {/* 기본 정보 */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            ・ {facilityData.address}
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
                            <ReserveMap lat={facilityData.latitude} lng={facilityData.longitude} />
                            <Divider />
                        </Box>
                    )}

                    {/* 예약 화면 */}
                    <Box sx={{ display: userWantReserve ? "block" : "none" }}>
                        <Typography sx={{ whiteSpace: "pre-wrap", mb: 2, mt: 2 }}>
                            ・요금 정보{"\n\t"}・기본요금 24시간 50,000원{"\n\t"}・추가요금 6시간 단위로 10,000원
                        </Typography>
                        <Divider />
                        <Box sx={{ mb: 2 }}>
                            <DateTimeSelector
                                openHours={`${openTime} - ${closeTime}`}
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
                            onClick={handlePaymentClick}
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
                                    {facilityData.starPoint.toFixed(1)}/5.0
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
                                    {facilityData.reviewCount}명 참여
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
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>

                                    {/* 퍼센트 표시 */}
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
                                            pointerEvents: "none",
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
                            {reviews.length > 0 ? (
                                reviews.map((review, idx) => (
                                    <Grid item xs={12} md={6} key={idx}>
                                        <Card sx={{ height: "100%" }}>
                                            <CardContent>
                                                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                                    <Avatar src={review.userProfileImage} />
                                                    <Typography variant="subtitle1">{review.userName}</Typography>
                                                </Stack>
                                                {review.reviewImages && review.reviewImages.length > 0 && (
                                                    <CardMedia
                                                        component="img"
                                                        height="180"
                                                        image={review.reviewImages[0]}
                                                        alt="review"
                                                        sx={{ borderRadius: 1, mb: 2 }}
                                                    />
                                                )}
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    {review.comment}
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <StarIcon
                                                            key={index}
                                                            fontSize="small"
                                                            sx={{
                                                                color: index < review.starPoint ? "#FFC107" : "#E0E0E0",
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography align="center" color="text.secondary">
                                        아직 리뷰가 없습니다.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default ReserveDetail;
