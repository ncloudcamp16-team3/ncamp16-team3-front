import React from "react";
import { Box, Button, Container, Divider, Tooltip, Typography } from "@mui/material";
import DateTimeSelector from "../view/FacilityDetailView.jsx";
import { useFacilityDetailContext } from "../../../context/ReserveContext.jsx";
import { Bar, XAxis, YAxis } from "recharts";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star";

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

const FacilityDetailToggle = ({ detail }) => {
    const { userWantReserve, setUserWantReserve } = useFacilityDetailContext();
    const [facility, photos, timetables, facilityType] = detail;

    const chartData = transformScoreToChartData(facility.starPoint);
    const filledStars = facility.starPoint === 5 ? 5 : Math.round(facility.starPoint);

    return (
        <Container>
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
            </Box>
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
                    <Typography variant="h6" sx={{ mb: 1, color: "#FF5555", ml: 4, mt: 1, fontWeight: "bold" }}>
                        {facility.starPoint}/5.0
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
                        {facility.reviewCount}명 참여
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
            <Box sx={{ display: userWantReserve ? "block" : "none" }}>
                <Typography sx={{ whiteSpace: "pre-wrap", mb: 2, mt: 2 }}>{facility.comment}</Typography>
                <Divider />
                <Box sx={{ mb: 2 }}>
                    <DateTimeSelector timetables={timetables} facilityType={facilityType.name} />
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
                        <Typography sx={{ textAlign: "right", width: "100%" }}>50,000원</Typography>
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
        </Container>
    );
};

export default FacilityDetailToggle;
