import React from "react";
import { formatPrice } from "./utils/formatters.jsx";
import { Box, Typography, Card, CardMedia, CardContent, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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
                    alignItems: "flex-start", // ← 중요! 높이 균등
                    p: 1.5,
                    mb: 0,
                    mx: 1.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.15)",
                    border: "1px solid #eee",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "4px 8px 15px rgba(0, 0, 0, 0.2)",
                    },
                }}
                onClick={() => navigate(`/reserve/detail/${payment.reserveId}`)}
            >
                <CardMedia
                    component="img"
                    sx={{
                        width: 120,
                        height: 96,
                        minWidth: 120,
                        objectFit: "cover",
                        objectPosition: "center",
                        bgcolor: "grey.100",
                    }}
                    image={payment.imageUrl}
                    alt={payment.name}
                />

                <CardContent
                    sx={{
                        position: "relative",
                        padding: "5px 5px 5px 16px",
                        width: "100%",
                        minWidth: 0, // 💥 줄어들 수 있도록 허용
                        minHeight: 100,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        "&:last-child": { paddingBottom: "5px" },
                    }}
                >
                    {/* 오른쪽 상단 - 예약시간 */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            minWidth: 130,
                            textAlign: "right",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                color: "text.secondary",
                            }}
                        >
                            [예약시간]
                        </Typography>
                        {payment.createdAt && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ whiteSpace: "nowrap", lineHeight: 1.4 }}
                            >
                                {formatDateTime(payment.createdAt)}
                            </Typography>
                        )}
                    </Box>

                    {/* 제목 (왼쪽, 오른쪽 요소 피해서 pr) */}
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1.3rem",
                                lineHeight: 1.2,
                                mb: 2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "calc(100% - 60px)", // ← 이거 기준 OK
                                flex: 1, // 👈 이거 핵심! 폭을 남는 만큼만 차지하게
                                pr: 1,
                            }}
                        >
                            {payment.name}
                        </Typography>
                    </Box>

                    {/* 체크인 / 체크아웃 */}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, wordBreak: "keep-all" }}>
                        {payment.exitTime ? "체크인: " : "예약시간: "}
                        {formatDateTime(payment.entryTime)}
                    </Typography>

                    {payment.exitTime && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                wordBreak: "keep-all",
                                display: "block", // 블록 요소로 변경하여 새로운 줄에 표시되도록 함
                            }}
                        >
                            체크아웃: {formatDateTime(payment.exitTime)}
                        </Typography>
                    )}

                    {/* 가격 */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            mt: 1,
                        }}
                    >
                        {formatPrice(payment.price)}원
                    </Typography>

                    {/* 오른쪽 하단 - 리뷰작성가능 Chip */}
                    {!payment.reviewId && payment.exitTime && new Date(payment.exitTime) < new Date() && (
                        <Chip
                            label="리뷰작성가능"
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                                position: "absolute",
                                bottom: 8,
                                right: 8,
                                height: 24,
                                fontSize: "0.7rem",
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};
