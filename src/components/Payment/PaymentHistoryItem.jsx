import React from "react";
import { formatPrice } from "./utils/formatters.jsx";
import { Box, Typography, Card, CardMedia, CardContent, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

// 날짜/시간 포맷 (ex. 2025-05-06T10:00:00 → "2025.05.06 (화) 10:00")
const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24시간제
    }).format(date);
};

export const PaymentHistoryItem = ({ payment }) => {
    const navigate = useNavigate();
    const hasReview = payment.reviewDto != null;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Card
                elevation={3}
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: 1.5,
                    mb: 0,
                    mx: 1.5, // 좌우 마진 추가
                    borderRadius: 2,
                    cursor: "pointer",
                    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
                    border: "1px solid #eee",
                    transition: "transform 0.2s ease-in-out",
                    position: "relative",
                    "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "4px 8px 15px rgba(0, 0, 0, 0.2)",
                    },
                }}
                onClick={() => navigate(`/reserve/detail/${payment.reserveId}`)}
            >
                {/* 리뷰 배지 */}
                {hasReview && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(255, 215, 0, 0.1)",
                            border: "1px solid rgba(255, 215, 0, 0.5)",
                            borderRadius: "16px",
                            padding: "2px 8px",
                            zIndex: 1,
                        }}
                    >
                        <StarIcon sx={{ color: "#FFD700", fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" fontWeight="bold">
                            {payment.reviewDto.starPoint}
                        </Typography>
                    </Box>
                )}

                <CardMedia
                    component="img"
                    sx={{
                        width: 120,
                        height: 96,
                        minWidth: 120, // 작아도 영역 확보
                        objectFit: "cover",
                        objectPosition: "center",
                        bgcolor: "grey.100",
                    }}
                    image={payment.imageUrl}
                    alt={payment.name}
                />

                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "5px 5px 5px 16px",
                        width: "100%",
                        "&:last-child": { paddingBottom: "5px" },
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1.3rem",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                pr: "130px", // 날짜 위치만큼 패딩
                            }}
                        >
                            {payment.name}
                        </Typography>
                        {/* 예약시간 텍스트를 절대 위치로 배치 */}
                        <Typography
                            sx={{
                                position: "absolute",
                                top: 15,
                                right: 16,
                                fontSize: "0.75rem",
                                color: "text.secondary",
                            }}
                        >
                            [예약시간]
                        </Typography>

                        {payment.createdAt && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 28, // 제목 아랫줄로
                                    right: 16,
                                    textAlign: "right",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1 }}
                                ></Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ whiteSpace: "nowrap", lineHeight: 1.4 }}
                                >
                                    {formatDateTime(payment.createdAt)}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, wordBreak: "keep-all" }}>
                        {payment.exitTime ? "체크인: " : "예약시간: "}
                        {formatDateTime(payment.entryTime)}
                    </Typography>

                    {/* 체크아웃 (있을 경우만) */}
                    {payment.exitTime && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, wordBreak: "keep-all" }}>
                            체크아웃: {formatDateTime(payment.exitTime)}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1.2rem",
                            }}
                        >
                            {formatPrice(payment.price)}원
                        </Typography>

                        {hasReview && (
                            <Chip
                                label="리뷰작성가능"
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ height: 24, fontSize: "0.7rem" }}
                            />
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};
