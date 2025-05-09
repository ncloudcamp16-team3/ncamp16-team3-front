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
    Container,
    Avatar,
    Grid,
    Stack,
    Divider,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import Star from "@mui/icons-material/Star";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";
import TitleBar from "../../components/Global/TitleBar.jsx";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import DateTimeSelector from "./DateTimeSelector.jsx";
import { addTempReserve, getFacilityToReserveById } from "../../services/reserveService.js";
import { Context } from "../../context/Context.jsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const transformScoreToChartData = (ratingRatio) => {
    if (!ratingRatio || !Array.isArray(ratingRatio)) return [];

    const scoreMap = {
        "5Stars": 0,
        "4Stars": 0,
        "3Stars": 0,
        "2Stars": 0,
        "1Star": 0,
    };

    // ratingRatio = [[5, 1], [4, 2], ...] 이런 형태
    ratingRatio.forEach(([star, count]) => {
        if (star === 5) scoreMap["5Stars"] = count;
        else if (star === 4) scoreMap["4Stars"] = count;
        else if (star === 3) scoreMap["3Stars"] = count;
        else if (star === 2) scoreMap["2Stars"] = count;
        else if (star === 1) scoreMap["1Star"] = count;
    });

    console.log("ratingRatio" + ratingRatio);

    const total = Object.values(scoreMap).reduce((sum, cur) => sum + cur, 0);

    return [
        {
            name: "★5",
            value: scoreMap["5Stars"],
            percentage: total ? Math.round((scoreMap["5Stars"] / total) * 100) : 0,
        },
        {
            name: "★4",
            value: scoreMap["4Stars"],
            percentage: total ? Math.round((scoreMap["4Stars"] / total) * 100) : 0,
        },
        {
            name: "★3",
            value: scoreMap["3Stars"],
            percentage: total ? Math.round((scoreMap["3Stars"] / total) * 100) : 0,
        },
        {
            name: "★2",
            value: scoreMap["2Stars"],
            percentage: total ? Math.round((scoreMap["2Stars"] / total) * 100) : 0,
        },
        { name: "★1", value: scoreMap["1Star"], percentage: total ? Math.round((scoreMap["1Star"] / total) * 100) : 0 },
    ];
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
    const [isTimetableEmpty, setIsTimetableEmpty] = useState(false);

    // Facility data
    const [facilityData, setFacilityData] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [chartData, setChartData] = useState([]);
    // NaverPay
    const naverPayRef = useRef(null);

    // 모달설정 관련
    const { showModal } = useContext(Context);

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

    // 요일 정보
    const today = dayjs().format("ddd").toUpperCase();
    const inRange = facilityData?.openingHours?.[today]?.isOpen || false;

    // API에서 데이터 가져오기
    useEffect(() => {
        const fetchFacilityDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getFacilityToReserveById(id);
                const data = response.data;

                console.log(data);

                setFacilityData(data.data.facility);
                setReviews(data.data.reviews || []);
                setChartData(transformScoreToChartData(data.data.ratingRatio));
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
            showModal("불러오기 실패", "알 수 없는 서버 오류로 인해 결제를 진행할 수 없습니다.");
            return;
        }

        if (!startDate || !startTime) {
            showModal("입력값 검증 실패", "예약 날짜와 시간을 선택해주세요.");
            return;
        }

        // Format dates for API
        const entryTime = dayjs
            .tz(`${dayjs(startDate).format("YYYY-MM-DD")}T${startTime}`, "Asia/Seoul")
            .format("YYYY-MM-DDTHH:mm:ss");
        console.log(entryTime);
        const exitTime =
            endDate && endTime
                ? dayjs
                      .tz(`${dayjs(endDate).format("YYYY-MM-DD")}T${endTime}`, "Asia/Seoul")
                      .format("YYYY-MM-DDTHH:mm:ss")
                : null;
        console.log(exitTime);
        try {
            const response = await addTempReserve({
                userId: user.id,
                facilityId: id,
                entryTime,
                exitTime,
                amount: 30000,
            });

            const merchantPayKey = response.data.reserveId;

            // Open NaverPay window
            naverPayRef.current.open({
                merchantPayKey,
                productName: facilityData.name,
                productCount: "1",
                totalPayAmount: "30000",
                taxScopeAmount: "30000",
                taxExScopeAmount: "0",
                returnUrl: `http://localhost:5173/api/reserve/payment/naver/return?merchantPayKey=${merchantPayKey}`,
            });
        } catch (err) {
            console.error("예약 생성 실패:", err);
            showModal("예약 확정 실패", "예약 처리 중 오류가 발생했습니다.");
        }
    };

    const handleBack = () => {
        setUserWantReserve(false);
    };

    const rating = facilityData.starPoint || 0;

    const StarRating = () => {
        const percentage = (rating / 5) * 100;

        return (
            <Box
                sx={{
                    position: "relative",
                    display: "inline-block",
                    width: 100,
                    height: 20,
                }}
            >
                {/* 빈 별 5개 */}
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        color: "#ccc", // 빈 별 색상
                    }}
                >
                    {Array.from({ length: 5 }).map((_, i) => (
                        <StarBorder key={i} sx={{ width: 20, height: 20 }} />
                    ))}
                </Box>

                {/* 채워진 별 5개 (클리핑) */}
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: `${percentage}%`,
                        height: "100%",
                        overflow: "hidden",
                        color: "#FFD700", // 채워진 별 색상
                        pointerEvents: "none",
                    }}
                >
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} sx={{ width: 20, height: 20 }} />
                    ))}
                </Box>
            </Box>
        );
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

    const facilityType = facilityData.facilityType || "호텔";

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container disableGutters sx={{ display: "flex", width: 500, flexDirection: "column" }}>
                <TitleBar
                    sx={{ width: "100%", display: "flex" }}
                    name="편의시설 상세정보"
                    {...(userWantReserve ? { onBack: () => setUserWantReserve(false) } : {})}
                />
                <Divider sx={{ width: "100%" }} />
                <Box sx={{ width: "100%", display: "flex" }}>
                    {/* 상단 이미지 */}
                    <Card sx={{ mb: 2, width: "100%", height: "100%", boxShadow: "none" }}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={facilityData.imagePath || "https://via.placeholder.com/400x300"}
                            alt={facilityData.name}
                        />
                    </Card>
                </Box>
                <Divider />
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1, px: 3, mt: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        {facilityData.name}
                    </Typography>
                    <Chip
                        size="small"
                        label={inRange ? "영업중" : "영업종료"}
                        color={inRange ? "success" : "default"}
                        sx={{ color: "#fff", mb: 1 }}
                    />
                    {inRange ? (
                        <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                            {facilityData?.openingHours?.[today]?.openTime.substring(0, 5)} -{" "}
                            {facilityData?.openingHours?.[today]?.closeTime.substring(0, 5)}
                        </Typography>
                    ) : (
                        <Typography sx={{ fontWeight: "bold", mb: 1 }}>휴무</Typography>
                    )}
                </Box>

                {/* 기본 정보 */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
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

                {/* 지도 */}
                {isMapOpen && (
                    <Box>
                        <Divider />
                        <ReserveMap lat={facilityData.latitude} lng={facilityData.longitude} />
                    </Box>
                )}
                <Divider />
                <Box sx={{ display: "flex", ml: 3 }}>
                    <Typography sx={{ whiteSpace: "pre-wrap", mb: 2, mt: 2 }}>{facilityData.comment}</Typography>
                </Box>

                <Divider />

                {/* 예약 화면 */}
                {userWantReserve &&
                    (isTimetableEmpty ? (
                        <Box
                            sx={{
                                width: "100%",
                                height: "30%",
                                py: 10,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Typography variant="h5" sx={{ fontSize: "bold" }}>
                                예약이 가능한 일정을 준비중입니다...
                            </Typography>
                            <Button sx={{ fontSize: 18 }} onClick={handleBack}>
                                뒤로 가기
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                mb: 2,
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <DateTimeSelector
                                openHours={facilityData?.openingHours}
                                facilityType={facilityType}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                startTime={startTime}
                                setStartTime={setStartTime}
                                endTime={endTime}
                                setEndTime={setEndTime}
                                isTimetableEmpty={isTimetableEmpty}
                                setIsTimetableEmpty={setIsTimetableEmpty}
                            />
                        </Box>
                    ))}
                <Box
                    sx={{
                        display: userWantReserve && !isTimetableEmpty ? "flex" : "none",
                        flexDirection: "column",
                    }}
                >
                    <Divider />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            px: 3,
                            mt: 2,
                            mb: 2,
                            gap: 2,
                        }}
                    >
                        <Typography sx={{ width: "100%" }}>・예약금</Typography>

                        <Typography sx={{ textAlign: "right", width: "100%" }}>30,000원</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: "#E9A260", borderRadius: 3, mt: 2, mb: 3, width: "90%" }}
                            size="large"
                            onClick={handlePaymentClick}
                        >
                            결제하기
                        </Button>
                    </Box>
                </Box>
                {/* 상세 정보 */}
                <Box sx={{ display: userWantReserve ? "none" : "block" }}>
                    <Divider />
                    {/* 예약 버튼 */}
                    <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            sx={{ bgcolor: "#E9A260", borderRadius: 3, width: "90%" }}
                            size="large"
                            onClick={() => setUserWantReserve(true)}
                        >
                            <CalendarTodayIcon /> 예약하기
                        </Button>
                    </Box>

                    <Divider />

                    <Stack
                        direction="row"
                        spacing={4}
                        sx={{ my: 4, width: "100%", px: 3, justifyContent: "center" }}
                        alignItems="stretch"
                    >
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
                            <Typography variant="h6" sx={{ mb: 1, color: "#FF5555", ml: 4, mt: 1, fontWeight: "bold" }}>
                                {rating.toFixed(1)}/5.0
                            </Typography>
                            <Box sx={{ mb: 1, ml: 3 }}>
                                <StarRating />
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
                                <ResponsiveContainer width="100%" height={150}>
                                    <BarChart
                                        layout="vertical"
                                        data={chartData} // 위에서 생성한 chartData 사용
                                        margin={{ top: 5, right: 40, left: 30, bottom: 20 }}
                                        barCategoryGap={8}
                                        barGap={4}
                                    >
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={30}
                                            tick={{ fontSize: 13, fill: "#FF5555", fontWeight: 500 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            content={({ payload }) => {
                                                if (!payload || payload.length === 0) return null;
                                                return (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: "white",
                                                            p: 1,
                                                            border: "1px solid #ccc",
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        <Typography fontSize={13}>
                                                            {payload[0].payload.name}: {payload[0].value}명 (
                                                            {payload[0].payload.percentage}%)
                                                        </Typography>
                                                    </Box>
                                                );
                                            }}
                                        />
                                        <Bar
                                            dataKey="percentage"
                                            fill="#1976d2"
                                            barSize={12} // 더 두껍게
                                            radius={[10, 10, 10, 10]} // 모서리 둥글게
                                            background={{ fill: "#E0E0E0", radius: [10, 10, 10, 10] }}
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
                    <Box sx={{ display: "flex", ml: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            이용자 리뷰
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {reviews.length > 0 ? (
                            reviews.map((review, idx) => (
                                <Grid item xs={12} md={12} key={idx} sx={{ width: "100%" }}>
                                    <Card sx={{ width: "100%", height: "100%" }}>
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
            </Container>
        </LocalizationProvider>
    );
};

export default ReserveDetail;
