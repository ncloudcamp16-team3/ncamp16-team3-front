import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import reserveDetailData from "../../mock/Reserve/reserveDetail.json";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// MUI Components
import { Box, Typography, Button, Card, CardContent, CardMedia, Avatar, Grid, Stack, Divider } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ReserveMap from "../../components/Reserve/map/ReserveMap.jsx";

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

const ReserveDetail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [address, setAddress] = useState(null);
    const [isMapOpen, setIsMapOpen] = useState(false);

    useEffect(() => {
        const found = reserveDetailData.find((item) => item.id === Number(id));
        if (found) setDetail(found);
    }, [id]);

    if (!detail) return <Typography>Loading...</Typography>;

    const chartData = transformScoreToChartData(detail.score);
    const filledStars = detail.rating === 5 ? 5 : Math.round(detail.rating);

    return (
        <Box sx={{ p: 3 }}>
            {/* 상단 이미지 */}
            <Card sx={{ mb: 4 }}>
                <CardMedia component="img" height="300" image={detail.mainImage} alt={detail.name} />
            </Card>

            {/* 기본 정보 */}
            <Typography variant="h4" gutterBottom>
                {detail.name}
            </Typography>
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
            <Divider />

            <Box>
                <Divider />
                {/* 예약 버튼 */}
                <Box sx={{ my: 2 }}>
                    <Button variant="contained" color="primary" size="large" fullWidth>
                        예약하기
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
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", ml: 3, mt: 2 }}>
                        이용자 평점
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1, color: "#FF5555", ml: 4, mt: 1, fontWeight: "bold" }}>
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
                <Box sx={{ flex: 1, height: 200, ml: 0, bgcolor: "#FFF7EF" }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", ml: 3, mt: 2 }}>
                        점수 비율
                    </Typography>
                    <Box sx={{ position: "relative", width: "100%", height: 150 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={chartData}
                                margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
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
                                top: 16,
                                right: 0,
                                height: "86%",
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
                                    sx={{ fontSize: "10px", color: "#FF5555", height: `${100 / chartData.length}%` }}
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
    );
};

export default ReserveDetail;
