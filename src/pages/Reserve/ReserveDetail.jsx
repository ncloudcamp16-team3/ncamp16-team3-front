import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
// MUI Components
import { Box, Typography, Button, Container, Grid, Stack, Divider, Chip, CircularProgress, Alert } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";
import TitleBar from "../../components/Global/TitleBar.jsx";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import DateTimeSelector from "./DateTimeSelector.jsx";
import { addTempReserve, deleteReview, getFacilityToReserveById } from "../../services/reserveService.js";
import { Context } from "../../context/Context.jsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ReviewCardItem from "./ReviewCardItem.jsx";
import transformScoreToChartData from "../../hook/Reserve/transformScoreToChartData.js";
import ImgSlide from "../../components/Global/ImgSlider.jsx";
import ReviewFilter from "../../components/Reserve/filter/ReviewFilter.jsx";
import CustomizedDot from "../../components/Reserve/utils/CustomizedDot.jsx";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatPhone = (tel) => {
    return tel.replace(/^(02)(\d{3,4})(\d{4})$|^(0\d{2})(\d{3,4})(\d{4})$/, (_, p1, p2, p3, p4, p5, p6) =>
        p1 ? `${p1}-${p2}-${p3}` : `${p4}-${p5}-${p6}`
    );
};

const ReserveDetail = () => {
    const { id } = useParams();
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [userWantReserve, setUserWantReserve] = useState(false);
    const { user } = useContext(Context);
    const navigate = useNavigate();

    // 예약 시간과 날짜
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isTimetableEmpty, setIsTimetableEmpty] = useState(false);

    // Facility data
    const [facilityData, setFacilityData] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [sortBy, setSortBy] = useState("newest"); // 기본값: 최신순
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 별점 업데이트
    const [chartData, setChartData] = useState([]);

    // NaverPay
    const naverPayRef = useRef(null);

    // 모달설정 관련
    const { showModal, handleSnackbarOpen } = useContext(Context);

    // 리뷰 정렬 로직
    useEffect(() => {
        if (!reviews || reviews.length === 0) {
            setSortedReviews([]);
            return;
        }

        const sorted = [...reviews];

        switch (sortBy) {
            case "newest":
                // 최신순 정렬 (날짜 기준 내림차순)
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "oldest":
                // 오래된순 정렬 (날짜 기준 오름차순)
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "highest":
                // 평점높은순 정렬
                sorted.sort((a, b) => b.starPoint - a.starPoint);
                break;
            case "lowest":
                // 평점낮은순 정렬
                sorted.sort((a, b) => a.starPoint - b.starPoint);
                break;
            default:
                // 기본 정렬은 최신순
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setSortedReviews(sorted);
    }, [reviews, sortBy]);
    // 정렬 옵션 변경 핸들러
    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
    };

    // 리뷰 삭제 관련
    const handleReviewDelete = async (review) => {
        try {
            const reviewId = review.id;
            setLoading(true);
            setError(null);
            const response = await deleteReview(reviewId);
            const data = response;

            // console.log(data);

            setFacilityData(data.facility);
            setReviews(data.reviews || []);
            setChartData(transformScoreToChartData(data.ratingRatio));
            handleSnackbarOpen("리뷰가 삭제되었습니다");
        } catch (err) {
            console.error("리뷰를 불러오는데 실패했습니다:", err);
            setError("리뷰를 불러오는데 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

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
    const timeNow = dayjs().format("HH:mm:ss");

    const inRange =
        (facilityData?.openingHours?.[today]?.isOpen &&
            facilityData?.openingHours?.[today]?.openTime <= timeNow &&
            facilityData?.openingHours?.[today]?.closeTime >= timeNow) ||
        false;

    // API에서 데이터 가져오기
    useEffect(() => {
        const fetchFacilityDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getFacilityToReserveById(id);
                const data = response.data;

                // console.log(data);

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
            showModal("", "알 수 없는 서버 오류로 인해 결제를 진행할 수 없습니다.");
            return;
        }

        if (!startDate || !startTime) {
            showModal("", "예약 날짜와 시간을 선택해주세요.");
            return;
        }

        // Format dates for API
        const entryTime = dayjs
            .tz(`${dayjs(startDate).format("YYYY-MM-DD")}T${startTime}`, "Asia/Seoul")
            .format("YYYY-MM-DDTHH:mm:ss");
        // console.log(entryTime);
        const exitTime =
            endDate && endTime
                ? dayjs
                      .tz(`${dayjs(endDate).format("YYYY-MM-DD")}T${endTime}`, "Asia/Seoul")
                      .format("YYYY-MM-DDTHH:mm:ss")
                : null;
        // console.log(exitTime);
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
                returnUrl: `https://tailfriends.kro.kr/api/reserve/payment/naver/return?merchantPayKey=${merchantPayKey}`,
            });
        } catch (err) {
            console.error("예약 생성 실패:", err);
            showModal("", "예약 처리 중 오류가 발생했습니다.");
        }
    };

    const handleBack = () => {
        setUserWantReserve(false);
    };

    const ScoreBar = () => {
        return (
            <Box
                sx={{
                    backgroundColor: "#FFF5EE",
                    p: 1,
                    borderRadius: 3,
                    "@media (min-width: 390px)": {
                        p: 1,
                        gap: 0,
                    },
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                        mb: 3,
                        ml: 2,
                        mt: 1,
                        "@media (min-width: 390px)": {
                            mb: 1,
                            ml: 1,
                        },
                    }}
                >
                    점수 비율
                </Typography>
                {chartData.map((item) => (
                    <Box
                        key={item.name}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            ml: 3,
                            "@media (min-width: 390px)": {
                                ml: 1,
                            },
                        }}
                    >
                        <Typography sx={{ width: 24, fontSize: 14, color: "#FF5555", fontWeight: 500 }}>
                            {item.name}
                        </Typography>
                        <Box
                            sx={{
                                flex: 1,
                                height: 10,
                                backgroundColor: "#E0E0E0",
                                borderRadius: 5,
                                mx: 1,
                                position: "relative",
                                "@media (min-width: 390px)": {
                                    gap: 0,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: `${item.percentage}%`,
                                    height: "100%",
                                    backgroundColor: "#1976d2",
                                    borderRadius: 5,
                                }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: 13, color: "#FF5555", width: 30 }}>{item.percentage}%</Typography>
                    </Box>
                ))}
            </Box>
        );
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
                    ml: 2,
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

    const BusinessHoursDisplay = () => {
        const shortDayMapping = {
            MON: "월",
            TUE: "화",
            WED: "수",
            THU: "목",
            FRI: "금",
            SAT: "토",
            SUN: "일",
        };

        // 순서대로 요일 정렬
        const orderedDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

        if (!facilityData?.openingHours) {
            return <Typography color="text.secondary">영업시간 정보가 없습니다.</Typography>;
        }

        return (
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon sx={{ mr: 1 }} /> 영업시간
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        {orderedDays.slice(0, 4).map((day) => {
                            const dayInfo = facilityData.openingHours[day];
                            const isOpen = dayInfo?.isOpen;
                            const openTime = dayInfo?.openTime?.substring(0, 5);
                            const closeTime = dayInfo?.closeTime?.substring(0, 5);

                            return (
                                <Box
                                    key={day}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        py: 0.5,
                                        px: 1,
                                        mb: 0.5,
                                        borderRadius: 1,
                                        bgcolor: day === today ? "#FFF7EF" : "transparent",
                                    }}
                                >
                                    <Typography
                                        fontWeight={day === today ? "bold" : "normal"}
                                        color={day === today ? "#E9A260" : "text.primary"}
                                        sx={{ width: "40px" }}
                                    >
                                        {shortDayMapping[day]}
                                    </Typography>

                                    <Typography color={isOpen ? "text.primary" : "text.secondary"} sx={{ pl: 1 }}>
                                        {isOpen ? `${openTime} - ${closeTime}` : "휴무일"}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Grid>
                    <Grid item xs={6}>
                        {orderedDays.slice(4).map((day) => {
                            const dayInfo = facilityData.openingHours[day];
                            const isOpen = dayInfo?.isOpen;
                            const openTime = dayInfo?.openTime?.substring(0, 5);
                            const closeTime = dayInfo?.closeTime?.substring(0, 5);

                            return (
                                <Box
                                    key={day}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        py: 0.5,
                                        px: 1,
                                        mb: 0.5,
                                        borderRadius: 1,
                                        bgcolor: day === today ? "#FFF7EF" : "transparent",
                                    }}
                                >
                                    <Typography
                                        fontWeight={day === today ? "bold" : "normal"}
                                        color={day === today ? "#E9A260" : "text.primary"}
                                        sx={{ width: "40px" }}
                                    >
                                        {shortDayMapping[day]}
                                    </Typography>

                                    <Typography color={isOpen ? "text.primary" : "text.secondary"} sx={{ pl: 1 }}>
                                        {isOpen ? `${openTime} - ${closeTime}` : "휴무일"}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Grid>
                </Grid>
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
            <Container disableGutters sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
                <TitleBar
                    sx={{ width: "100%", display: "flex" }}
                    name="편의시설 상세정보"
                    {...(userWantReserve
                        ? { onBack: () => setUserWantReserve(false) }
                        : { onBack: () => navigate("/reserve") })}
                />
                <ImgSlide photos={facilityData.imagePaths} />
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
                    {facilityData?.openingHours?.[today]?.openTime && facilityData?.openingHours?.[today]?.closeTime ? (
                        <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                            {facilityData?.openingHours?.[today]?.openTime.substring(0, 5)} -{" "}
                            {facilityData?.openingHours?.[today]?.closeTime.substring(0, 5)}
                        </Typography>
                    ) : (
                        <Typography sx={{ fontWeight: "bold", mb: 1 }}>휴무</Typography>
                    )}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "row", alignItems: "center", px: 2, gap: 1, ml: 1.5 }}>
                    <Typography variant="body1" color="text.secondary">
                        <CustomizedDot />
                        문의전화:{" "}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {formatPhone(facilityData.tel)}
                    </Typography>
                </Box>
                {/* 기본 정보 */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, ml: 1.5 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        <CustomizedDot />
                        {facilityData.address}
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

                {/* 영업시간 정보 추가 */}
                <Box sx={{ px: 3 }}>
                    <BusinessHoursDisplay />
                </Box>

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

                    <Divider sx={{ my: 4, "@media (min-width: 390px)": { my: 2 } }} />

                    <Stack
                        direction="row"
                        sx={{
                            width: "100%",
                            px: 3,
                            justifyContent: "center",
                            gap: "5%",
                            "@media (min-width: 390px)": {
                                my: 2,
                                gap: 2,
                            },
                        }}
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
                                "@media (min-width: 390px)": {
                                    height: 120,
                                    m: 0,
                                    p: 0,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: "#FFF5EE",
                                    p: 1,
                                    borderRadius: 3,
                                    "@media (min-width: 390px)": {
                                        display: "flex",
                                        flexDirection: "column",
                                        p: 1,
                                        gap: 0.3,
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 3,
                                        ml: 2,
                                        mt: 1,
                                        "@media (min-width: 390px)": {
                                            mb: 0,
                                            ml: "10%",
                                        },
                                    }}
                                >
                                    이용자 평점
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 1,
                                        color: "#FF5555",
                                        ml: 4,
                                        mt: 1,
                                        fontWeight: "bold",
                                        "@media (min-width: 390px)": {
                                            ml: "10%",
                                            mt: 0,
                                            mb: 0,
                                            fontSize: 30,
                                        },
                                    }}
                                >
                                    {rating.toFixed(1)}/5.0
                                </Typography>
                                <Box
                                    sx={{
                                        mb: 1,
                                        ml: 3,
                                        "@media (min-width: 390px)": {
                                            ml: 0,
                                            mb: 0,
                                            mr: 3,
                                        },
                                    }}
                                >
                                    <StarRating rating={rating} />
                                </Box>
                                <Typography
                                    variant="h7"
                                    sx={{
                                        color: "#FF5555",
                                        ml: 4,
                                        fontWeight: "bold",
                                        "@media (min-width: 390px)": {
                                            ml: 2.4,
                                            pt: 1,
                                        },
                                    }}
                                >
                                    {facilityData.reviewCount}명 참여
                                </Typography>
                            </Box>
                        </Box>

                        {/* 점수 비율 그래프 */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                bgcolor: "#FFF7EF",
                                borderRadius: 5,
                                "@media (min-width: 390px)": {
                                    gap: 0,
                                    m: 0,
                                    p: 0,
                                },
                            }}
                        >
                            <ScoreBar />
                        </Box>
                    </Stack>

                    <Divider
                        sx={{
                            my: 4,
                            "@media (min-width: 390px)": {
                                my: 2,
                            },
                        }}
                    />

                    {/* 리뷰 목록 헤더 */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mx: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            이용자 리뷰 ({reviews?.length || 0})
                        </Typography>

                        {/* 별점 통계 요약 */}
                        {facilityData && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body2" fontWeight="bold" color="primary">
                                    평균 평점: {facilityData.starPoint?.toFixed(1) || "0.0"}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* 리뷰 필터 */}
                    <Box sx={{ mx: 3, mb: 2 }}>
                        <ReviewFilter sortBy={sortBy} onSortChange={handleSortChange} />
                    </Box>

                    {/* 리뷰 목록 */}
                    <Grid container sx={{ px: 2 }}>
                        {sortedReviews && sortedReviews.length > 0 ? (
                            sortedReviews.map((review, idx) => (
                                <ReviewCardItem
                                    key={idx}
                                    review={review}
                                    user={user}
                                    isLast={idx === sortedReviews.length - 1} // ✅ 마지막 여부 전달
                                    handleReviewDelete={handleReviewDelete}
                                    setChartData={setChartData}
                                    setReviews={setReviews}
                                    setFacilityData={setFacilityData}
                                    setLoading={setLoading}
                                    setError={setError}
                                />
                            ))
                        ) : (
                            <Box sx={{ py: 4, textAlign: "center", width: "100%" }}>
                                <Typography variant="body1" color="text.secondary">
                                    아직 등록된 리뷰가 없습니다.
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default ReserveDetail;
